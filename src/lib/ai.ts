type GenerateOptions = {
  system?: string;
  prompt: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
};

type InteractionResponse = {
  id?: string;
  model?: string;
  output_text?: string;
  usage?: unknown;
  steps?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

export async function generateText({
  system,
  prompt,
  model,
  temperature = 0.7,
  maxOutputTokens = 3000
}: GenerateOptions) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("AI provider is not configured");

  const selectedModel = model || process.env.AI_MODEL || "gemini-3.8-flash";

  const response = await fetch("https://generativelanguage.googleapis.com/v1beta/interactions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey
    },
    body: JSON.stringify({
      model: selectedModel,
      ...(system ? { system_instruction: system } : {}),
      input: prompt,
      generation_config: {
        temperature,
        max_output_tokens: maxOutputTokens
      },
      store: false
    }),
    cache: "no-store"
  });

  const body = await response.text();
  if (!response.ok) {
    throw new Error(`AI provider returned ${response.status}: ${body.slice(0, 500)}`);
  }

  const json = JSON.parse(body) as InteractionResponse;
  const text = json.output_text ||
    json.steps
      ?.filter((step) => step.type === "model_output")
      .flatMap((step) => step.content || [])
      .filter((part) => part.type === "text")
      .map((part) => part.text || "")
      .join("")
      .trim();

  if (!text) throw new Error("AI provider returned no text");
  return {
    text,
    model: json.model || selectedModel,
    usage: json.usage ?? null,
    interactionId: json.id ?? null
  };
}
