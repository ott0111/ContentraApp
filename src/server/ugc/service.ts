import { db } from "@/lib/db";
import { requireEntitlement } from "@/server/access/require-entitlement";
import { assertPlanLimit, consumePlanUsage } from "@/server/usage/limits";
import { auditLog } from "@/server/security/audit";
import { getBrandBrain } from "@/server/brand-brain/service";
import { startVideoGeneration } from "./veo";

export async function createUGCJob(input: {
  workspaceId: string;
  userId: string;
  prompt: string;
  aspectRatio?: "9:16" | "16:9";
  characterId?: string;
}) {
  await requireEntitlement(input.workspaceId, "ai_ugc");
  await assertPlanLimit(input.workspaceId, "ugcVideos");

  const [brandBrain, character] = await Promise.all([
    getBrandBrain(input.workspaceId),
    input.characterId
      ? db.uGCCharacter.findFirst({
          where: { id: input.characterId, workspaceId: input.workspaceId, active: true }
        })
      : null
  ]);

  const prompt = [
    "Create a short-form social video for this brand.",
    brandBrain?.positioning ? `Positioning: ${brandBrain.positioning}` : "",
    brandBrain?.audience ? `Audience: ${brandBrain.audience}` : "",
    character?.visualPrompt ? `Character direction: ${character.visualPrompt}` : "",
    `User brief: ${input.prompt}`
  ].filter(Boolean).join("\n");

  const generation = await db.generationJob.create({
    data: {
      workspaceId: input.workspaceId,
      createdById: input.userId,
      characterId: character?.id,
      kind: "UGC_VIDEO",
      status: "PROCESSING",
      provider: "GOOGLE_GEMINI",
      model: process.env.VEO_MODEL || "veo-3.1-fast-generate-preview",
      prompt
    }
  });

  try {
    const operation = await startVideoGeneration({
      prompt,
      aspectRatio: input.aspectRatio
    });

    await consumePlanUsage(input.workspaceId, "ugcVideos");
    const updated = await db.generationJob.update({
      where: { id: generation.id },
      data: { operationName: operation.operationName, model: operation.model }
    });

    await auditLog({
      workspaceId: input.workspaceId,
      userId: input.userId,
      action: "ugc.generation.started",
      resource: "GenerationJob",
      resourceId: generation.id
    });

    return updated;
  } catch (err) {
    await db.generationJob.update({
      where: { id: generation.id },
      data: { status: "FAILED", error: err instanceof Error ? err.message : "Generation failed" }
    });
    throw err;
  }
}
