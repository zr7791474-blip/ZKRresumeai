/**
 * LLM provider abstraction for the AI writing tools.
 *
 * If OPENAI_API_KEY is set, text-generation tools (summary, rewrite, grammar
 * fix, cover letter, skills suggestions) call OpenAI's Chat Completions API.
 * If it isn't set — or the call fails for any reason (network, rate limit,
 * bad response) — callers fall back to the deterministic heuristic engine in
 * ai.service.ts, so the product is always fully usable with zero external
 * dependencies and zero cost. Scoring and ATS keyword-matching stay heuristic
 * either way since they're structured/algorithmic, not generative, tasks.
 */

export interface CompletionOptions {
  system?: string;
  maxTokens?: number;
  temperature?: number;
}

export interface AIProvider {
  complete(prompt: string, options?: CompletionOptions): Promise<string>;
}

class OpenAIProvider implements AIProvider {
  constructor(private apiKey: string, private model: string) {}

  async complete(prompt: string, options: CompletionOptions = {}): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          ...(options.system ? [{ role: "system", content: options.system }] : []),
          { role: "user", content: prompt },
        ],
        max_tokens: options.maxTokens ?? 400,
        temperature: options.temperature ?? 0.7,
      }),
      // Give up quickly rather than hanging a request — the caller falls back
      // to the heuristic engine on any error, including a timeout.
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      throw new Error(`OpenAI request failed (${res.status}): ${body}`);
    }

    const data = await res.json();
    const content = data?.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) {
      throw new Error("OpenAI returned an empty completion.");
    }
    return content.trim();
  }
}

let cachedProvider: AIProvider | null | undefined;

/** Returns null (not an error) when no API key is configured — callers should fall back. */
export function getAIProvider(): AIProvider | null {
  if (cachedProvider !== undefined) return cachedProvider;

  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_MODEL || "gpt-4o-mini";

  cachedProvider = apiKey ? new OpenAIProvider(apiKey, model) : null;
  return cachedProvider;
}
