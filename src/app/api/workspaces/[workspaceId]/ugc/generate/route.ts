import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";
import { createUGCBrief, startVeoGeneration } from "@/lib/ugc";
import { z } from "zod";

const schema = z.object({
  request: z.string().trim().min(1).max(10000),
  platform: z.enum(["INSTAGRAM", "TIKTOK", "YOUTUBE"]).default("TIKTOK"),
  characterId: z.string().optional(),
  aspectRatio: z.enum(["9:16", "16:9"]).default("9:16"),
  referenceImage: z.object({
    data: z.string().max(12_000_000),
    mimeType: z.enum(["image/png", "image/jpeg", "image/webp"])
  }).optional()
});

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    const input = schema.parse(await request.json());

    const character = input.characterId
      ? await db.uGCCharacter.findFirst({ where: { id: input.characterId, workspaceId, active: true } })
      : null;
    if (input.characterId && !character) return error("UGC character not found", 404);

    const brief = await createUGCBrief(workspaceId, input.request, input.platform, character?.visualPrompt);

    const prompt = [
      "Vertical social-media UGC video.",
      "Authentic phone-camera creator style, natural lighting, believable human delivery, subtle handheld movement, not a polished commercial.",
      "Do not fabricate customer reviews or unsupported claims.",
      character?.visualPrompt ? "Creator character: " + character.visualPrompt : "",
      "Hook: " + brief.hook,
      "Script: " + brief.script,
      "Visual style: " + brief.visualStyle,
      "Scene plan: " + JSON.stringify(brief.scenes),
      "Dialogue should match the supplied script naturally."
    ].filter(Boolean).join("\n");

    const job = await db.generationJob.create({
      data: {
        workspaceId,
        createdById: user.id,
        characterId: character?.id,
        kind: "UGC_VIDEO",
        status: "PROCESSING",
        provider: "google",
        prompt,
        metadata: { brief, platform: input.platform, aspectRatio: input.aspectRatio }
      }
    });

    try {
      const started = await startVeoGeneration({
        prompt,
        aspectRatio: input.aspectRatio,
        referenceImage: input.referenceImage
      });

      const updated = await db.generationJob.update({
        where: { id: job.id },
        data: { operationName: started.operationName, model: started.model }
      });

      return ok({ generation: updated, brief });
    } catch (providerError) {
      await db.generationJob.update({
        where: { id: job.id },
        data: { status: "FAILED", error: providerError instanceof Error ? providerError.message : "Video generation failed" }
      });
      throw providerError;
    }
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    if (err instanceof Error && err.message === "AI provider is not configured") return error("AI provider is not configured. Add GEMINI_API_KEY.", 503);
    return handleError(err);
  }
}
