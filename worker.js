import codlingMothMonitoring from "./knowledge/codling-moth-monitoring.js";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "no-store",
};

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "do", "for", "from",
  "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "should", "the",
  "this", "to", "what", "when", "where", "which", "with", "would"
]);

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...CORS_HEADERS },
  });
}

function normalize(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/\bcm\b/g, "codling moth")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(text) {
  return normalize(text)
    .split(" ")
    .filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function sanitizeHistory(history) {
  if (!Array.isArray(history)) return [];
  return history
    .filter((item) => item && ["user", "assistant"].includes(item.role) && item.content)
    .slice(-12)
    .map((item) => ({
      role: item.role,
      content: String(item.content).slice(0, 1800),
    }));
}

function scoreRecord(record, tokens, normalizedConversation) {
  const searchable = normalize([
    record.id,
    ...(record.topics || []),
    ...(record.facts || []),
  ].join(" "));
  let score = 0;
  for (const token of tokens) if (searchable.includes(token)) score += 1;
  for (const topic of record.topics || []) {
    if (normalizedConversation.includes(normalize(topic))) score += 4;
  }
  return score;
}

function retrieveRecords(question, history, context, limit = 10) {
  const conversationText = [
    ...history.map((item) => item.content),
    question,
    JSON.stringify(context || {}),
  ].join(" ");
  const normalizedConversation = normalize(conversationText);
  const tokens = tokenize(conversationText);
  const scored = codlingMothMonitoring.records
    .map((record) => ({ record, score: scoreRecord(record, tokens, normalizedConversation) }))
    .sort((a, b) => b.score - a.score);

  const relevant = scored.filter((item) => item.score > 0).slice(0, limit);
  if (relevant.length) return relevant.map((item) => item.record);

  const establishedTarget = normalize(context?.target || conversationText).includes("codling moth");
  return establishedTarget ? codlingMothMonitoring.records.slice(0, limit) : [];
}

function evidenceForModel(records) {
  return records.map((record) => ({
    id: record.id,
    topics: record.topics || [],
    facts: record.facts || [],
    required_context: record.required_context || [],
    confidence: record.confidence,
    source_ids: record.source_ids || [],
  }));
}

function modelText(result) {
  if (typeof result === "string") return result.trim();
  if (result?.response && typeof result.response === "object") return JSON.stringify(result.response);
  if (result?.response) return String(result.response).trim();
  if (result?.result?.response && typeof result.result.response === "object") return JSON.stringify(result.result.response);
  if (result?.result?.response) return String(result.result.response).trim();
  return "";
}

function parseModelJson(raw) {
  const text = String(raw || "").trim();
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced ? fenced[1].trim() : text;
  try {
    return JSON.parse(candidate);
  } catch {
    const start = candidate.indexOf("{");
    const end = candidate.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(candidate.slice(start, end + 1));
    throw new Error("Workers AI returned an unreadable response.");
  }
}

async function interpretAndAnswer(env, question, context, history, records) {
  if (!env.AI) throw new Error("Workers AI binding is unavailable.");

  const systemPrompt = `You are TFPM, a conversational tree-fruit pest-management information assistant.

Read the user's ENTIRE current question and the recent conversation. Resolve references such as "it", "the trap", and "that lure" from the conversation. If the user asks about two or more things, address every requested thing.

Use only VERIFIED_KNOWLEDGE supplied below. It includes information supplied directly by the TFPM owner as well as reviewed source material. Do not add facts, tools, procedures, or practical suggestions from your pretrained memory. If the requested practical method is absent, plainly say that TFPM does not yet have that information. Do not invent a threshold, regional recommendation, label direction, product rate, or pesticide recommendation.

TFPM provides information, not recommendations. Explain the applicable guidance, alternatives, conditions, and tradeoffs, but do not decide for the user. Never write "I recommend", "TFPM recommends", "you should", "you could consider", "it is recommended", or otherwise turn the information into a personal instruction or suggested choice. Present practices and guidelines as neutral facts. If the user asks what is "best", explain what the choice depends on rather than selecting for them.

Do not name, cite, or discuss sources in the normal answer. Give the information directly in natural language. Only identify source names or citations when the user specifically asks for the sources.

Write as if speaking directly and naturally to a grower. Use relaxed, everyday wording and short, clear sentences. Prefer conversational phrasing such as "about every four weeks" rather than technical wording such as "rated for four weeks." Never refer to "the text", "the supplied information", "the evidence", or "the records." Compose a fresh answer from the facts; do not copy their wording or sentence structure mechanically and do not use a canned response. Equivalent questions may be worded differently while preserving the same facts.

Pay attention to each record's required_context, but ask for a missing detail only when it is necessary to answer the user's actual question and VERIFIED_KNOWLEDGE contains different information that can be selected using that detail. Do not ask for location merely because guidance might vary regionally; ask only when the supplied knowledge contains location-specific alternatives. Ask no more than one concise clarification at a time. Do not ask for a pest, crop, or condition already established in the recent conversation or known context. For codling moth trap counts, answer with the rule directly. Each orchard block has a minimum of two traps. A block of ten acres or less therefore has two traps. For blocks larger than ten acres, use one trap per five acres as the reference. If acreage falls between five-acre increments, give a neutral range using the whole-trap values on either side: more than 10 but less than 15 acres is 2–3 traps; more than 15 but less than 20 acres is 3–4 traps; continue that pattern for larger blocks. If acreage is an exact multiple of five, give the exact count, such as three traps for 15 acres. Do not choose one end of a range for the grower and do not describe either end as recommended. Do not ask the grower for the number of blocks, total acreage, individual block acreages, or whether any block is large. Do not turn a general "how many" question into a customized calculation or clarification sequence. If the user voluntarily supplies enough block information and asks for the arithmetic, calculate it; otherwise, explain the rule and stop. If the user asks where or how to place traps, answer the placement question directly without asking for acreage or block sizes. If the most recent assistant message asked a clarification and the current user message answers it—even with a short reply such as "yes", "no", or a noun phrase—use that answer and continue; never repeat the same clarification. When the knowledge is insufficient, say exactly what information is missing.

Return only valid JSON with this shape:
{
  "status": "answered" | "needs_clarification" | "insufficient_knowledge",
  "answer": string (use an empty string when not applicable),
  "clarification": string (use an empty string when not applicable),
  "detected": { "target": string, "domain": string },
  "used_record_ids": string[]
}`;

  const groundingPrompt = `${systemPrompt}

KNOWN_CONTEXT:
${JSON.stringify(context || {})}

VERIFIED_KNOWLEDGE:
${JSON.stringify(evidenceForModel(records))}`;

  const result = await env.AI.run("@cf/meta/llama-4-scout-17b-16e-instruct", {
    messages: [
      { role: "system", content: groundingPrompt },
      ...history,
      { role: "user", content: question },
    ],
    max_tokens: 650,
    temperature: 0.35,
    guided_json: {
      type: "object",
      properties: {
        status: { type: "string", enum: ["answered", "needs_clarification", "insufficient_knowledge"] },
        answer: { type: "string" },
        clarification: { type: "string" },
        detected: {
          type: "object",
          properties: {
            target: { type: "string" },
            domain: { type: "string" }
          },
          required: ["target", "domain"]
        },
        used_record_ids: {
          type: "array",
          items: { type: "string" }
        }
      },
      required: ["status", "answer", "clarification", "detected", "used_record_ids"]
    }
  });

  const parsed = parseModelJson(modelText(result));
  const allowed = new Set(["answered", "needs_clarification", "insufficient_knowledge"]);
  if (!allowed.has(parsed.status)) throw new Error("Workers AI returned an invalid answer status.");

  const validRecordIds = new Set(records.map((record) => record.id));
  const usedRecordIds = Array.isArray(parsed.used_record_ids)
    ? parsed.used_record_ids.filter((id) => validRecordIds.has(id))
    : [];

  return {
    status: parsed.status,
    answer: parsed.answer ? String(parsed.answer).trim() : null,
    clarification: parsed.clarification ? String(parsed.clarification).trim() : null,
    detected: {
      target: parsed.detected?.target ? String(parsed.detected.target) : context?.target || null,
      domain: parsed.detected?.domain ? String(parsed.detected.domain) : context?.domain || null,
    },
    retrieved_record_ids: usedRecordIds.length ? usedRecordIds : records.map((record) => record.id),
    confidence: records.length && records.every((record) => record.confidence === "high")
      ? "high"
      : "mixed",
  };
}

async function answerQuestion(question, context, history, env) {
  if (!question) return jsonResponse({ error: "A question is required." }, 400);

  const cleanHistory = sanitizeHistory(history);
  const records = retrieveRecords(question, cleanHistory, context);
  if (!records.length) {
    return jsonResponse({
      status: "needs_clarification",
      clarification: "Which tree-fruit pest or disease is this question about?",
      missing_context: ["target"],
      detected: { target: null, domain: null },
      retrieved_record_ids: [],
    });
  }

  try {
    const response = await interpretAndAnswer(env, question, context, cleanHistory, records);
    return jsonResponse(response);
  } catch (error) {
    console.error("TFPM reasoning failed", error);
    return jsonResponse({
      error: "TFPM could not interpret the question with Workers AI.",
      detail: String(error?.message || error),
    }, 502);
  }
}

export default {
  async fetch(request, env) {
    try {
      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }

      const url = new URL(request.url);
      if (url.pathname === "/health") {
        return jsonResponse({
          ok: true,
          knowledge_version: codlingMothMonitoring.schema_version,
          reasoning: "full-question-grounded-generation",
        });
      }
      if (url.pathname !== "/ask") return jsonResponse({ error: "Not found" }, 404);

      if (request.method === "GET") {
        const question = String(url.searchParams.get("question") || "").trim();
        let context = {};
        let history = [];
        try {
          if (url.searchParams.get("context")) context = JSON.parse(url.searchParams.get("context"));
          if (url.searchParams.get("history")) history = JSON.parse(url.searchParams.get("history"));
        } catch {
          return jsonResponse({ error: "Context and history must be valid JSON." }, 400);
        }
        return await answerQuestion(question, context, history, env);
      }

      if (request.method === "POST") {
        let body;
        try {
          body = await request.json();
        } catch {
          return jsonResponse({ error: "Request body must be valid JSON." }, 400);
        }
        return await answerQuestion(
          String(body?.question || "").trim(),
          body?.context || {},
          body?.history || [],
          env
        );
      }

      return jsonResponse({ error: "Method not allowed" }, 405);
    } catch (error) {
      console.error("Unhandled TFPM Worker error", error);
      return jsonResponse({
        error: "Worker runtime error",
        detail: String(error?.message || error),
      }, 500);
    }
  },
};
