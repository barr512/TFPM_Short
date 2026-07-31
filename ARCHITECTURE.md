# TFPM Retrieval-and-Generation Prototype

## Purpose

TFPM should not match a grower's wording to a canned paragraph. It should:

1. identify the grower's intent and target pest or disease;
2. ask only for missing information that changes the answer;
3. retrieve verified facts from the TFPM knowledge library;
4. use AI to compose a focused response from those facts;
5. admit when the library does not contain enough verified information.

## Current test domain

The first domain is **codling moth monitoring**. The knowledge file is:

`knowledge/codling-moth-monitoring.json`

It currently contains structured records for:

- monitoring purpose;
- trap type and lure context;
- deployment timing;
- trap height and canopy position;
- position within the orchard block and edge effects;
- trap quantity;
- checking frequency;
- lure and liner maintenance;
- monitoring under mating disruption;
- fruit sampling.

Each record contains atomic facts, topic phrases, confidence, required context when applicable, and source identifiers. The records are not complete grower-facing answers.

## Worker API

`worker.js` exposes:

### `GET /health`

Returns the Worker and knowledge schema status.

### `POST /ask`

Example request:

```json
{
  "question": "Where should I hang my CM traps?",
  "context": {}
}
```

Example follow-up request when acreage is required:

```json
{
  "question": "How many CM traps do I need?",
  "context": {
    "target": "codling moth",
    "acreage": 31,
    "number_of_blocks": 4
  }
}
```

Possible statuses:

- `answered`
- `needs_clarification`
- `insufficient_knowledge`

Development responses also include the IDs of the records retrieved. These can later support an internal coverage report without displaying sources to growers.

## Answer-generation rules

The AI is instructed to:

- use only the retrieved verified evidence;
- answer only the question asked;
- avoid unrelated teaching;
- avoid empty phrases such as “use appropriate methods”;
- ask one concise clarification when necessary;
- explain how monitoring choices affect interpretation;
- avoid making an individualized pesticide recommendation;
- say when the evidence is insufficient;
- omit source links unless requested.

## Cloudflare setup

The repository includes `wrangler.toml` with a Workers AI binding named `AI` and a JSON module rule.

Deployment command after Cloudflare authentication:

```bash
npx wrangler deploy
```

The deployed Worker URL must then be connected to the GitHub Pages interface. Until that connection is made, the current browser-only prototype remains active.

## Next development steps

1. Deploy the Worker and test `/health` and `/ask` directly.
2. Update `index.html` to send questions and retained conversation context to `/ask`.
3. Add a development-only coverage panel showing detected target, retrieved record IDs, missing context, and confidence.
4. Test natural grower wording and add missing knowledge rather than adding canned responses.
5. Review and correct the initial codling moth records before expanding to another pest.
