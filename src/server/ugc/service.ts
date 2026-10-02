import { requireEntitlement } from "@/server/access/require-entitlement";
import { assertPlanLimit, consumePlanUsage } from "@/server/usage/limits";
import { createUGCBrief, startVeoGeneration } from "@/lib/ugc";

export async function startWorkspaceUGC(input: {
  workspaceId: string;
  prompt: string;
  aspectRatio?: "9:16" | "16:9";
  characterImageUrl?: string;
}) {
  await requireEntitlement(input.workspaceId, "ai_ugc");
  await assertPlanLimit(input.workspaceId, "ugcVideos");
  const brief = await createUGCBrief(input.workspaceId, input.prompt);
  const operation = await startVeoGeneration({
    prompt: brief.script,
    aspectRatio: input.aspectRatio,
    referenceImageUrl: input.characterImageUrl
  });
  await consumePlanUsage(input.workspaceId, "ugcVideos");
  return { brief, operation };
}
