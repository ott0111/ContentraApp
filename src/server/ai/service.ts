import { generateText } from "@/lib/ai";
import { requireEntitlement } from "@/server/access/require-entitlement";
import { assertPlanLimit, consumePlanUsage } from "@/server/usage/limits";

export async function generateWorkspaceAI(input: {
  workspaceId: string;
  system?: string;
  prompt: string;
  temperature?: number;
  maxOutputTokens?: number;
}) {
  await requireEntitlement(input.workspaceId, "ai_generation");
  await assertPlanLimit(input.workspaceId, "aiGenerations");
  const result = await generateText({
    system: input.system,
    prompt: input.prompt,
    temperature: input.temperature,
    maxOutputTokens: input.maxOutputTokens
  });
  await consumePlanUsage(input.workspaceId, "aiGenerations");
  return result;
}
