import codlingMothMonitoring from "./knowledge/codling-moth-monitoring.json";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "can", "do", "for", "from",
  "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "should", "the",
  "this", "to", "what", "when", "where", "which", "with", "would"
]);

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...CORS_HEADERS },
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

function detectTarget(question) {
  const text = normalize(question);
  if (text.includes("codling moth")) return "codling moth";
  return null;
}

function scoreRecord(record, tokens, normalizedQuestion) {
  const searchable = normalize([
    record.id,
    ...(record.topics || []),
    ...(record.facts || []),
  ].join(" "));

  let score = 0;
  for (const token of tokens) {
    if (searchable.includes(token)) score += 1;
  }

  for (const topic of record.topics || []) {
    if (normalizedQuestion.includes(normalize(topic))) score += 4;
  }

  if (record.id.includes("trap-quantity") && /how many|number|density|per acre/.test(normalizedQuestion)) score += 6;
  if (record.id.includes("block-position") && /edge|perimeter|inside|border|represent/.test(normalizedQuestion)) score += 6;
  if (record.id.includes("trap-height") && /height|canopy|hang|place|where/.test(normalizedQuestion)) score += 5;
  if (record.id.includes("trap-type") && /which trap|what trap|type of trap|delta/.test(normalizedQuestion)) score += 6;
  if (record.id.includes("mating-disruption") && /mating disruption|disrupted|cm-da|10x/.test(normalizedQuestion)) score += 7;
  if (record.id.includes("check-frequency") && /how often|check|inspect|service/.test(normalizedQuestion)) score += 6;
  if (record.id.includes("lure-maintenance") && /replace|lure life|sticky liner|maintenance/.test(normalizedQuestion)) score += 6;
  if (record.id.includes("deployment-timing") && /when.*trap|put.*out|install|deploy/.test(normalizedQuestion)) score += 6;
  if (record.id.includes("purpose") && /why monitor|what.*tell|what.*catch/.test(normalizedQuestion)) score += 5;

  return score;
}

function retrieveRecords(question, limit = 5) {
  const normalizedQuestion = normalize(question);
  const tokens = tokenize(question);

  return codlingMothMonitoring.records
    .map((record) => ({ record, score: scoreRecord(record, tokens, normalizedQuestion) }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.record);
}

function findMissingContext(records, context) {
  const required = new Set(records.flatMap((record) => record.required_context || []));
  const missing = [];

  if (required.has("acreage") && !Number.isFinite(context?.acreage)) missing.push("acreage");
  if (required.has("number_of_blocks") && !Number.isFinite(context?.number_of_blocks)) missing.push("number_of_blocks");

  return missing;
}

function clarificationFor(missing) {
  if (missing.includes("acreage") && missing.includes("number_of_blocks")) {
    return "How many acres are you monitoring, and are they in one continuous block or several separate blocks?";
  }
  if (missing.includes("acreage")) return "How many acres are you monitoring?";
  if (missing.includes("number_of_blocks")) return "Is the acreage in one continuous block or several separate blocks?";
  return null;
}

function buildEvidence(records) {
  return records.map((record) => ({
    id: record.id,
    confidence: record.confidence,
    facts: record.facts,
    source_ids: record.source_ids,
  }));
}

function fallbackAnswer(records) {
  const facts = records.flatMap((record) => record.facts || []).slice(0, 5);
  if (!facts.length) return null;
  return facts.join(" ");
}

async function generateAnswer(env, question, context, records) {
  const evidence = buildEvidence(records);
  const systemPrompt = `You are TFPM, a tree-fruit pest-management information assistant.

Use only the supplied verified evidence. Do not add facts from memory. Do not make an individualized pesticide recommendation. Answer only the user's question. If the evidence is insufficient, say so plainly. Ask one concise clarification only when necessary. Do not display source links unless the user asks. Use direct, practical language. Avoid filler such as "use appropriate methods" or "place traps where useful." Explain tradeoffs when placement changes how catches should be interpreted. Two answers may be worded differently, but the factual content must remain consistent with the evidence.`;

  const userPrompt = JSON.stringify({
    question,
    known_context: context || {},
    verified_evidence: evidence,
  });

  const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    max_tokens: 500,
    temperature: 0.25,
  });

  if (typeof result === "string") return result.trim();
  if (result?.response) return String(result.response).trim();
  if (result?.result?.response) return String(result.result.response).trim();
  return null;
}

export default {
  async fetch(request, env) {
    if (request.method === "OPTIONS") return new Response(null, { headers: CORS_HEADERS });

    const url = new URL(request.url);
    if (url.pathname === "/health") {
      return jsonResponse({ ok: true, knowledge_version: codlingMothMonitoring.schema_version });
    }

    if (url.pathname !== "/ask" || request.method !== "POST") {
      return jsonResponse({ error: "Not found" }, 404);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ error: "Request body must be valid JSON." }, 400);
    }

    const question = String(body?.question || "").trim();
    const context = body?.context || {};
    if (!question) return jsonResponse({ error: "A question is required." }, 400);

    const target = detectTarget(question) || context?.target || null;
    if (!target) {
      return jsonResponse({
        status: "needs_clarification",
        clarification: "Which pest or disease is this question about?",
      });
    }

    if (target !== "codling moth") {
      return jsonResponse({
        status: "insufficient_knowledge",
        answer: `The current test knowledge library does not yet include ${target}.`,
      });
    }

    const records = retrieveRecords(question);
    if (!records.length) {
      return jsonResponse({
        status: "insufficient_knowledge",
        answer: "I do not yet have enough verified codling moth monitoring information to answer that question confidently.",
        detected: { target, domain: "monitoring" },
      });
    }

    const missing = findMissingContext(records, context);
    if (missing.length) {
      return jsonResponse({
        status: "needs_clarification",
        clarification: clarificationFor(missing),
        missing_context: missing,
        detected: { target, domain: "monitoring" },
        retrieved_record_ids: records.map((record) => record.id),
      });
    }

    let answer = null;
    if (env.AI) {
      try {
        answer = await generateAnswer(env, question, context, records);
      } catch (error) {
        console.error("AI generation failed", error);
      }
    }

    answer ||= fallbackAnswer(records);

    return jsonResponse({
      status: "answered",
      answer,
      detected: { target, domain: "monitoring" },
      retrieved_record_ids: records.map((record) => record.id),
      confidence: records.every((record) => record.confidence === "high") ? "high" : "moderate",
    });
  },
};
