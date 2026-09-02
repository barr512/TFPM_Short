import codlingMothMonitoring from "./knowledge/codling-moth-monitoring.js";
import codlingMothManagement from "./knowledge/codling-moth-management.js";
import orientalFruitMoth from "./knowledge/oriental-fruit-moth.js";
import orientalFruitMothManagement from "./knowledge/oriental-fruit-moth-management.js";
import sourceGuides from "./knowledge/source-guides.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS } });
}
function normalize(text) { return String(text || "").toLowerCase().replace(/\bcm\b/g, "codling moth").replace(/\bofm\b/g, "oriental fruit moth").replace(/[^a-z0-9\s-]/g, " ").replace(/\s+/g, " ").trim(); }
function tokenize(text) { return normalize(text).split(" ").filter(w => w.length > 2); }
function sanitizeHistory(history) { if (!Array.isArray(history)) return []; return history.filter(x => x && ["user", "assistant"].includes(x.role) && x.content).slice(-12).map(x => ({ role: x.role, content: String(x.content).slice(0, 1800) })); }
function scoreRecord(record, tokens, conversation) {
  const searchable = normalize([record.id, ...(record.topics || []), ...(record.facts || [])].join(" "));
  let score = 0;
  for (const token of tokens) if (searchable.includes(token)) score++;
  for (const topic of record.topics || []) if (conversation.includes(normalize(topic))) score += 4;
  return score;
}
function retrieveRecords(question, history, context, limit = 12) {
  const text = [...history.map(x => x.content), question, JSON.stringify(context || {})].join(" ");
  const conversation = normalize(text), tokens = tokenize(text);
  const records = [
    ...codlingMothMonitoring.records,
    ...codlingMothManagement.records,
    ...orientalFruitMoth.records,
    ...orientalFruitMothManagement.records,
    ...sourceGuides.records,
  ];
  const relevant = records.map(record => ({ record, score: scoreRecord(record, tokens, conversation) })).sort((a,b) => b.score-a.score).filter(x => x.score > 0).slice(0, limit).map(x => x.record);
  if (relevant.length) return relevant;
  const target = normalize(context?.target || text);
  if (target.includes("oriental fruit moth")) return [...orientalFruitMoth.records, ...orientalFruitMothManagement.records].slice(0, limit);
  if (target.includes("codling moth")) return [...codlingMothMonitoring.records, ...codlingMothManagement.records].slice(0, limit);
  return [];
}
function evidenceForModel(records) { return records.map(r => ({ id:r.id, topics:r.topics||[], facts:r.facts||[], required_context:r.required_context||[], confidence:r.confidence, source_ids:r.source_ids||[] })); }
function modelText(result) { if (typeof result === "string") return result.trim(); if (result?.response && typeof result.response === "object") return JSON.stringify(result.response); if (result?.response) return String(result.response).trim(); if (result?.result?.response && typeof result.result.response === "object") return JSON.stringify(result.result.response); if (result?.result?.response) return String(result.result.response).trim(); return ""; }
function parseModelJson(raw) { const text=String(raw||"").trim(), fenced=text.match(/```(?:json)?\s*([\s\S]*?)```/i), candidate=fenced?fenced[1].trim():text; try{return JSON.parse(candidate)}catch{const s=candidate.indexOf("{"),e=candidate.lastIndexOf("}");if(s>=0&&e>s)return JSON.parse(candidate.slice(s,e+1));throw new Error("Workers AI returned an unreadable response.")}}

async function interpretAndAnswer(env, question, context, history, records) {
  if (!env.AI) throw new Error("Workers AI binding is unavailable.");
  const systemPrompt = `You are TFPM, a conversational tree-fruit pest-management information assistant.
Read the ENTIRE current question and recent conversation. Resolve references such as it, the trap, and that lure. Address every part of multi-part questions.
Use ONLY VERIFIED_KNOWLEDGE below. Do not add facts from pretrained memory. Do not invent thresholds, pesticide rates, label directions, spray schedules, or regional recommendations.
TFPM provides information, not personal recommendations. Explain applicable practices, alternatives, conditions, and tradeoffs without telling the grower what they personally should do. Never use phrases such as "I recommend", "TFPM recommends", or "you should".
Keep regional, crop-specific, program-specific, monitoring-objective, and publication-year limits attached to facts. Do not blend different contexts into one universal rule.
Write naturally for a grower, using short clear paragraphs. Do not mention sources unless the user asks for sources. If the verified knowledge does not answer the question, say so plainly.
If a clarification is truly necessary, ask only one concise question. If the user has just answered a previous clarification, use that answer and continue rather than asking again.
Return ONLY valid JSON: {"status":"answered|needs_clarification|insufficient_knowledge","answer":"","clarification":"","detected":{"target":"","domain":""},"used_record_ids":[]}`;
  const result = await env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", {
    messages:[{role:"system",content:`${systemPrompt}\n\nKNOWN_CONTEXT:\n${JSON.stringify(context||{})}\n\nVERIFIED_KNOWLEDGE:\n${JSON.stringify(evidenceForModel(records))}`}, ...history, {role:"user",content:question}],
    max_tokens:650, temperature:0.35,
    guided_json:{type:"object",properties:{status:{type:"string",enum:["answered","needs_clarification","insufficient_knowledge"]},answer:{type:"string"},clarification:{type:"string"},detected:{type:"object",properties:{target:{type:"string"},domain:{type:"string"}},required:["target","domain"]},used_record_ids:{type:"array",items:{type:"string"}}},required:["status","answer","clarification","detected","used_record_ids"]}
  });
  const parsed=parseModelJson(modelText(result));
  const valid=new Set(records.map(r=>r.id));
  const used=Array.isArray(parsed.used_record_ids)?parsed.used_record_ids.filter(id=>valid.has(id)):[];
  return {status:parsed.status,answer:parsed.answer?String(parsed.answer).trim():null,clarification:parsed.clarification?String(parsed.clarification).trim():null,detected:{target:parsed.detected?.target?String(parsed.detected.target):context?.target||null,domain:parsed.detected?.domain?String(parsed.detected.domain):context?.domain||null},retrieved_record_ids:used.length?used:records.map(r=>r.id),confidence:records.length&&records.every(r=>r.confidence==="high")?"high":"mixed"};
}
async function answerQuestion(question,context,history,env){
  if(!question)return jsonResponse({error:"A question is required."},400);
  const clean=sanitizeHistory(history), records=retrieveRecords(question,clean,context);
  if(!records.length)return jsonResponse({status:"needs_clarification",clarification:"Which tree-fruit pest or disease is this question about?",missing_context:["target"],detected:{target:null,domain:null},retrieved_record_ids:[]});
  try{return jsonResponse(await interpretAndAnswer(env,question,context,clean,records))}catch(error){console.error("TFPM reasoning failed",error);return jsonResponse({error:"TFPM could not interpret the question with Workers AI.",detail:String(error?.message||error)},502)}
}
export default {async fetch(request,env){try{if(request.method==="OPTIONS")return new Response(null,{status:204,headers:CORS_HEADERS});const url=new URL(request.url);if(url.pathname==="/health")return jsonResponse({ok:true,knowledge_version:"cm-0.1+ofm-0.1+cm-management-0.1+ofm-management-0.1",source_catalog_version:sourceGuides.schema_version,reasoning:"full-question-grounded-generation"});if(url.pathname!=="/ask")return jsonResponse({error:"Not found"},404);if(request.method==="GET"){const question=String(url.searchParams.get("question")||"").trim();let context={},history=[];try{if(url.searchParams.get("context"))context=JSON.parse(url.searchParams.get("context"));if(url.searchParams.get("history"))history=JSON.parse(url.searchParams.get("history"))}catch{return jsonResponse({error:"Context and history must be valid JSON."},400)}return await answerQuestion(question,context,history,env)}if(request.method==="POST"){let body;try{body=await request.json()}catch{return jsonResponse({error:"Request body must be valid JSON."},400)}return await answerQuestion(String(body?.question||"").trim(),body?.context||{},body?.history||[],env)}return jsonResponse({error:"Method not allowed"},405)}catch(error){console.error("Unhandled TFPM Worker error",error);return jsonResponse({error:"Worker runtime error",detail:String(error?.message||error)},500)}}};
