type GenerateOptions = {
  system?: string;
  prompt: string;
  model?: string;
  temperature?: number;
};

export async function generateText({ system, prompt, model, temperature = 0.7 }: GenerateOptions) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("AI provider is not configured");

  const selectedModel = model || process.env.AI_MODEL || "gemini-3.6-flash";

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${selectedModel}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: { temperature, maxOutputTokens: 3000 }
      }),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`AI provider returned ${response.status}: ${body.slice(0, 500)}`);
  }

  const json = await response.json();
  const text = json?.candidates?.[0]?.content?.parts
    ?.map((part: { text?: string }) => part.text || "")
    .join("")
    ?.trim();

  if (!text) throw new Error("AI provider returned no text");
  return { text, model: json.modelVersion || selectedModel, usage: json.usageMetadata ?? null };
}
