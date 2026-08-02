// Deployment trigger: Git connection restored 2026-08-02.
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
  return normalize(text).split(" ").filter((word) => word.length > 2 && !STOP_WORDS.has(word));
}

function detectTarget(question) {
  return normalize(question).includes("codling moth") ? "codling moth" : null;
}

function asksAboutTrapOrLure(question) {
  const normalizedQuestion = normalize(question);
  return /\blure\b|which trap|what trap|trap.*\buse\b|type of trap|cm 4k|cm 10x|cm da|cmda/.test(normalizedQuestion);
}

function asksAboutTrapLifespan(question) {
  const normalizedQuestion = normalize(question);
  return /how long.*trap|trap.*how long|trap.*last|life.*trap/.test(normalizedQuestion);
}

function trapComponentAnswer(component) {
  const bodyAnswer = "The delta trap body is reusable. Continue using it while it remains structurally sound, closes properly, and keeps the trap entrance unobstructed; replace it when damage prevents it from functioning correctly.";
  const linerAnswer = "Sticky liners are generally rated for four weeks, but should be replaced sooner when captured insects, debris, or contamination interferes with capture.";
  if (component === "body_and_liner") return `${bodyAnswer} ${linerAnswer}`;
  if (component === "body") return bodyAnswer;
  if (component === "liner") return linerAnswer;
  return null;
}

function detectMatingDisruption(question, context) {
  if (typeof context?.mating_disruption === "boolean") return context.mating_disruption;
  const normalizedQuestion = normalize(question);
  if (/\b(no|not|without)\s+(mating\s+)?disruption\b|not disrupted/.test(normalizedQuestion)) return false;
  if (/mating disruption|disrupted orchard|under disruption|using disruption/.test(normalizedQuestion)) return true;
  return null;
}

function detectMonitoringGoal(question, context) {
  if (context?.monitoring_goal === "suppression" || context?.monitoring_goal === "activity") return context.monitoring_goal;
  const normalizedQuestion = normalize(question);
  if (/check.*disruption|verify.*disruption|suppression|stay near zero|near zero|is disruption working/.test(normalizedQuestion)) return "suppression";
  if (/monitor.*activity|flight activity|detect activity|catch.*despite|monitor.*despite|track.*flight/.test(normalizedQuestion)) return "activity";
  return null;
}

function trapAndLureAnswer(usingMatingDisruption, monitoringGoal) {
  if (usingMatingDisruption && monitoringGoal === "suppression") {
    return "Use a delta-style trap with a replaceable sticky liner and a CM 1X lure when the objective is to evaluate whether mating disruption is suppressing catches from a standard pheromone lure. Under mating disruption, the CM 1X catch has historically been expected to remain very close to zero. Captures that depart from that expectation may indicate that a spray should be considered, but TFPM should not apply one universal numerical threshold or treat the trap catch as an automatic spray decision. Interpret the catch specifically as a measure of response to the standard pheromone lure, not as proof that codling moth is absent.";
  }
  if (usingMatingDisruption && monitoringGoal === "activity") {
    return "Use a delta-style trap with a replaceable sticky liner. Options for monitoring activity despite mating disruption include CM 10X, which is a higher-load pheromone lure, is not expected to remain near zero, and lasts about two weeks; CM-DA, which combines pheromone and kairomone and may be used with or without acetic acid, with an approximate field life of 8–12 weeks; and CM 4K, which contains kairomones but no pheromone and also has an approximate field life of 8–12 weeks. Variation in the reported efficacy of CM 4K, CM-DA, and other kairomone-containing lures has occurred among locations and even within a season, and there are no universally recognized treatment thresholds for these lures. Some growers and consultants use their own local and seasonal catch history to relate captures to treatment need. TFPM should not name one lure as universally best or convert a catch into a spray decision without that locally relevant evidence.";
  }
  return "Use a delta-style trap with a replaceable sticky liner. In an orchard without mating disruption, two common lure choices are CM 1X, which has a four-week field life, and CM L2, which has an eight-week field life. Choose between them based on the desired service interval, and record the installation and replacement dates.";
}

function scoreRecord(record, tokens, normalizedQuestion) {
  const searchable = normalize([record.id, ...(record.topics || []), ...(record.facts || [])].join(" "));
  let score = 0;
  for (const token of tokens) if (searchable.includes(token)) score += 1;
  for (const topic of record.topics || []) if (normalizedQuestion.includes(normalize(topic))) score += 4;
  if (record.id.includes("trap-quantity") && /how many|number|density|per acre/.test(normalizedQuestion)) score += 6;
  if (record.id.includes("block-position") && /edge|perimeter|inside|border|represent|orchard/.test(normalizedQuestion)) score += 6;
  if (record.id.includes("trap-height") && /height|canopy|hang|place|where|put/.test(normalizedQuestion)) score += 5;
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

function findMissingContext(records, context, question) {
  const normalizedQuestion = normalize(question);
  const asksForTrapQuantity = /how many|number of traps|trap density|traps? per acre|trap count/.test(normalizedQuestion);
  if (!asksForTrapQuantity) return [];

  const required = new Set(records.flatMap((record) => record.required_context || []));
  const missing = [];
  if (required.has("acreage") && !Number.isFinite(context?.acreage)) missing.push("acreage");
  if (required.has("number_of_blocks") && !Number.isFinite(context?.number_of_blocks)) missing.push("number_of_blocks");
  return missing;
}

function clarificationFor(missing) {
  if (missing.includes("acreage") && missing.includes("number_of_blocks")) return "How many acres are you monitoring, and are they in one continuous block or several separate blocks?";
  if (missing.includes("acreage")) return "How many acres are you monitoring?";
  if (missing.includes("number_of_blocks")) return "Is the acreage in one continuous block or several separate blocks?";
  return null;
}

function buildEvidence(records) {
  return records.map((record) => ({ id: record.id, confidence: record.confidence, facts: record.facts, source_ids: record.source_ids }));
}

function fallbackAnswer(records) {
  const facts = records.flatMap((record) => record.facts || []).slice(0, 5);
  return facts.length ? facts.join(" ") : null;
}

async function generateAnswer(env, question, context, records) {
  const systemPrompt = `You are TFPM, a tree-fruit pest-management information assistant. Use only the supplied verified evidence. Do not add facts from memory. Do not make an individualized pesticide recommendation. Answer only the user's question. If evidence is insufficient, say so plainly. Do not display source links unless asked. Use direct, practical language and avoid filler. Explain tradeoffs when placement changes interpretation.`;
  const result = await env.AI.run("@cf/meta/llama-3.1-8b-instruct", {
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: JSON.stringify({ question, known_context: context || {}, verified_evidence: buildEvidence(records) }) },
    ],
    max_tokens: 500,
    temperature: 0.25,
  });
  if (typeof result === "string") return result.trim();
  if (result?.response) return String(result.response).trim();
  if (result?.result?.response) return String(result.result.response).trim();
  return null;
}

async function answerQuestion(question, context, env) {
  if (!question) return jsonResponse({ error: "A question is required." }, 400);
  const target = detectTarget(question) || context?.target || null;
  if (!target) return jsonResponse({ status: "needs_clarification", clarification: "Which pest or disease is this question about?" });
  if (target !== "codling moth") return jsonResponse({ status: "insufficient_knowledge", answer: `The current test knowledge library does not yet include ${target}.` });

  if (asksAboutTrapLifespan(question) && !context?.trap_component) {
    return jsonResponse({
      status: "needs_clarification",
      clarification: "Do you mean the reusable delta trap body, the sticky liner, or the lure?",
      missing_context: ["trap_component"],
      detected: { target, domain: "monitoring" },
      retrieved_record_ids: ["cm.monitoring.trap-type", "cm.monitoring.lure-maintenance"]
    });
  }
  if (asksAboutTrapLifespan(question) && ["body", "liner", "body_and_liner"].includes(context?.trap_component)) {
    return jsonResponse({
      status: "answered",
      answer: trapComponentAnswer(context.trap_component),
      detected: { target, domain: "monitoring" },
      retrieved_record_ids: ["cm.monitoring.trap-type", "cm.monitoring.lure-maintenance"],
      confidence: "high"
    });
  }

  if (asksAboutTrapOrLure(question) || context?.trap_component === "lure") {
    const usingMatingDisruption = detectMatingDisruption(question, context);
    if (usingMatingDisruption === null) {
      return jsonResponse({
        status: "needs_clarification",
        clarification: "Are you using mating disruption in this orchard?",
        missing_context: ["mating_disruption"],
        detected: { target, domain: "monitoring" },
        retrieved_record_ids: ["cm.monitoring.trap-type", "cm.monitoring.mating-disruption"]
      });
    }
    const monitoringGoal = usingMatingDisruption ? detectMonitoringGoal(question, context) : null;
    if (usingMatingDisruption && !monitoringGoal) {
      return jsonResponse({
        status: "needs_clarification",
        clarification: "What do you want the trap to tell you: whether mating disruption is suppressing standard pheromone catches, or whether codling moth activity is occurring despite disruption?",
        missing_context: ["monitoring_goal"],
        detected: { target, domain: "monitoring" },
        retrieved_record_ids: ["cm.monitoring.trap-type", "cm.monitoring.mating-disruption"]
      });
    }
    return jsonResponse({
      status: "answered",
      answer: trapAndLureAnswer(usingMatingDisruption, monitoringGoal),
      detected: { target, domain: "monitoring" },
      retrieved_record_ids: ["cm.monitoring.trap-type", "cm.monitoring.mating-disruption", "cm.monitoring.lure-maintenance"],
      confidence: usingMatingDisruption && monitoringGoal === "activity" ? "variable-by-location-and-season" : "high"
    });
  }

  const records = retrieveRecords(question);
  if (!records.length) return jsonResponse({ status: "insufficient_knowledge", answer: "I do not yet have enough verified codling moth monitoring information to answer that question confidently.", detected: { target, domain: "monitoring" } });

  const missing = findMissingContext(records, context, question);
  if (missing.length) return jsonResponse({ status: "needs_clarification", clarification: clarificationFor(missing), missing_context: missing, detected: { target, domain: "monitoring" }, retrieved_record_ids: records.map((record) => record.id) });

  let answer = null;
  if (env.AI) {
    try { answer = await generateAnswer(env, question, context, records); }
    catch (error) { console.error("AI generation failed", error); }
  }
  answer ||= fallbackAnswer(records);
  return jsonResponse({ status: "answered", answer, detected: { target, domain: "monitoring" }, retrieved_record_ids: records.map((record) => record.id), confidence: records.every((record) => record.confidence === "high") ? "high" : "moderate" });
}

export default {
  async fetch(request, env) {
    try {
      if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS_HEADERS });
      const url = new URL(request.url);
      if (url.pathname === "/health") return jsonResponse({ ok: true, knowledge_version: codlingMothMonitoring.schema_version });
      if (url.pathname !== "/ask") return jsonResponse({ error: "Not found" }, 404);

      if (request.method === "GET") {
        const question = String(url.searchParams.get("question") || "").trim();
        let context = {};
        const rawContext = url.searchParams.get("context");
        if (rawContext) {
          try { context = JSON.parse(rawContext); }
          catch { return jsonResponse({ error: "Context must be valid JSON." }, 400); }
        }
        return await answerQuestion(question, context, env);
      }

      if (request.method === "POST") {
        let body;
        try { body = await request.json(); }
        catch { return jsonResponse({ error: "Request body must be valid JSON." }, 400); }
        return await answerQuestion(String(body?.question || "").trim(), body?.context || {}, env);
      }

      return jsonResponse({ error: "Method not allowed" }, 405);
    } catch (error) {
      console.error("Unhandled TFPM Worker error", error);
      const detail = String(error?.message || error);
      return jsonResponse({ error: `Worker runtime error: ${detail}`, detail }, 500);
    }
  },
};