import { db } from "@/lib/db";
import { generateText } from "@/lib/ai";
import { parseJsonObject } from "@/lib/json";

const VEO_BASE = "https://generativelanguage.googleapis.com/v1beta";

export type UGCBrief = {
  hook: string;
  script: string;
  scenes: Array<{ durationSeconds: number; visual: string; dialogue?: string; onScreenText?: string }>;
  caption: string;
  cta: string;
  visualStyle: string;
};

const briefSchema = (value: unknown): value is UGCBrief => {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.hook === "string" &&
    typeof v.script === "string" &&
    Array.isArray(v.scenes) &&
    v.scenes.length > 0 &&
    v.scenes.every((scene) => {
      if (!scene || typeof scene !== "object") return false;
      const s = scene as Record<string, unknown>;
      return typeof s.durationSeconds === "number" && typeof s.visual === "string";
    }) &&
    typeof v.caption === "string" &&
    typeof v.cta === "string" &&
    typeof v.visualStyle === "string";
};

export async function createUGCBrief(workspaceId: string, request: string, platform: string, characterPrompt?: string) {
  const [brain, dna] = await Promise.all([
    db.brandBrain.findUnique({ where: { workspaceId } }),
    db.contentDNA.findUnique({ where: { workspaceId } })
  ]);

  const result = await generateText({
    system: [
      "You are Contentra's UGC creative director.",
      "Create believable UGC-style short-form content for a real product or service.",
      "Ground every product claim in the supplied Brand Brain. Never invent testimonials, customers, statistics, guarantees, or product capabilities.",
      "The video should feel native to short-form feeds: immediate hook, conversational delivery, visual proof/demo, and a clear CTA.",
      "Return JSON only."
    ].join("\n"),
    prompt: [
      "Return exactly this JSON shape:",
      '{"hook":"","script":"","scenes":[{"durationSeconds":8,"visual":"","dialogue":"","onScreenText":""}],"caption":"","cta":"","visualStyle":""}',
      "Platform: " + platform,
      "User request: " + request,
      "Character direction: " + (characterPrompt || "authentic everyday creator, natural phone-camera UGC, conversational delivery"),
      "Brand Brain: " + JSON.stringify(brain),
      "Content DNA: " + JSON.stringify(dna),
      "Keep the generated concept suitable for an 8-second AI video clip. If a longer idea is requested, structure it as a concept that can be rendered as multiple clips later."
    ].join("\n\n"),
    temperature: 0.55
  });

  const parsed = parseJsonObject<UGCBrief>(result.text);
  if (!parsed || !briefSchema(parsed)) throw new Error("AI could not produce a valid UGC brief");
  return parsed;
}

export async function startVeoGeneration(input: {
  prompt: string;
  model?: string;
  aspectRatio?: "9:16" | "16:9";
  referenceImage?: { data: string; mimeType: string };
}) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("AI provider is not configured");

  const model = input.model || process.env.VEO_MODEL || "veo-3.1-fast-generate-preview";
  const instance: Record<string, unknown> = { prompt: input.prompt };
  if (input.referenceImage) {
    instance.image = {
      inlineData: {
        mimeType: input.referenceImage.mimeType,
        data: input.referenceImage.data
      }
    };
  }

  const response = await fetch(
    `${VEO_BASE}/models/${model}:predictLongRunning`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey
      },
      body: JSON.stringify({
        instances: [instance],
        parameters: {
          aspectRatio: input.aspectRatio || "9:16",
          resolution: "720p",
          numberOfVideos: 1
        }
      }),
      cache: "no-store"
    }
  );

  const body = await response.text();
  if (!response.ok) throw new Error(`Video provider returned ${response.status}: ${body.slice(0, 500)}`);

  const json = JSON.parse(body) as { name?: string };
  if (!json.name) throw new Error("Video provider did not return an operation name");
  return { operationName: json.name, model };
}

export async function pollVeoOperation(operationName: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("AI provider is not configured");

  const response = await fetch(`${VEO_BASE}/${operationName}`, {
    headers: { "x-goog-api-key": apiKey },
    cache: "no-store"
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`Video operation returned ${response.status}: ${body.slice(0, 500)}`);

  const json = JSON.parse(body) as {
    done?: boolean;
    error?: { message?: string };
    response?: {
      generateVideoResponse?: {
        generatedSamples?: Array<{ video?: { uri?: string; mimeType?: string } }>;
      };
      generatedVideos?: Array<{ video?: { uri?: string; mimeType?: string } }>;
    };
  };

  if (json.error) return { status: "FAILED" as const, error: json.error.message || "Video generation failed" };
  if (!json.done) return { status: "PROCESSING" as const };

  const sample = json.response?.generateVideoResponse?.generatedSamples?.[0]?.video ||
    json.response?.generatedVideos?.[0]?.video;
  if (!sample?.uri) return { status: "FAILED" as const, error: "Video generation completed without an output video" };

  return { status: "COMPLETED" as const, outputUrl: sample.uri, outputMimeType: sample.mimeType || "video/mp4" };
}
