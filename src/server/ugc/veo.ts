const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const DEFAULT_MODEL = "veo-3.1-fast-generate-preview";

function apiKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("GEMINI_API_KEY is not configured");
  return key;
}

export async function startVideoGeneration(input: {
  prompt: string;
  aspectRatio?: "9:16" | "16:9";
  referenceImages?: Array<{ mimeType: string; data: string }>;
}) {
  const model = process.env.VEO_MODEL || DEFAULT_MODEL;
  const instances: Record<string, unknown> = { prompt: input.prompt };

  if (input.referenceImages?.length) {
    instances.referenceImages = input.referenceImages.map((image) => ({
      image: { inlineData: { mimeType: image.mimeType, data: image.data } },
      referenceType: "ASSET"
    }));
  }

  const response = await fetch(
    `${GEMINI_BASE_URL}/models/${model}:predictLongRunning`,
    {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        instances: [instances],
        parameters: {
          aspectRatio: input.aspectRatio ?? "9:16",
          resolution: "720p",
          numberOfVideos: 1
        }
      }),
      cache: "no-store"
    }
  );

  if (!response.ok) {
    throw new Error(`Veo request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json() as { name?: string };
  if (!data.name) throw new Error("Veo did not return an operation name");

  return { operationName: data.name, model };
}

export async function getVideoOperation(operationName: string) {
  const response = await fetch(`${GEMINI_BASE_URL}/${operationName}`, {
    headers: { "x-goog-api-key": apiKey() },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Veo operation lookup failed: ${response.status}`);
  }

  return response.json() as Promise<Record<string, unknown>>;
}
