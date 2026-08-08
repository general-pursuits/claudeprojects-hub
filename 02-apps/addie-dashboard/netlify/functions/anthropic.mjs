// Server-side proxy for the Anthropic API.
// The key lives only in the Netlify environment (ANTHROPIC_API_KEY) and is never
// shipped to the browser. Any VITE_-prefixed variable would be inlined into the
// public bundle instead.

const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS_LIMIT = 1000;
const MAX_PROMPT_CHARS = 8000;

const json = (status, body) => new Response(JSON.stringify(body), {
  status,
  headers: { "Content-Type": "application/json" },
});

export default async (request) => {
  if (request.method !== "POST") return json(405, { error: "Method not allowed" });

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return json(503, { error: "AI generation is not configured" });

  let payload;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: "Invalid JSON body" });
  }

  const system = typeof payload.system === "string" ? payload.system : "";
  const prompt = typeof payload.prompt === "string" ? payload.prompt : "";
  const maxTokens = Number.isInteger(payload.max_tokens) ? payload.max_tokens : 700;

  if (!prompt || prompt.length > MAX_PROMPT_CHARS || system.length > MAX_PROMPT_CHARS) {
    return json(400, { error: "Invalid prompt" });
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: Math.min(Math.max(maxTokens, 1), MAX_TOKENS_LIMIT),
      system,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!upstream.ok) return json(502, { error: "Upstream request failed" });

  const data = await upstream.json();
  const text = data.content?.find(b => b.type === "text")?.text || "";
  return json(200, { text });
};

export const config = { path: "/api/anthropic" };
