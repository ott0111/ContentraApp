import { db } from "@/lib/db";
import { FEATURE_MINIMUM_PLAN, planIncludes, type Feature, type Plan } from "./plans";

export async function getWorkspacePlan(workspaceId: string): Promise<Plan> {
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
    select: { plan: true }
  });

  return (workspace?.plan ?? "FREE") as Plan;
}

export async function getWorkspaceEntitlements(workspaceId: string) {
  const plan = await getWorkspacePlan(workspaceId);
  const features = Object.fromEntries(
    Object.entries(FEATURE_MINIMUM_PLAN).map(([feature, required]) => [
      feature,
      planIncludes(plan, required)
    ])
  ) as Record<Feature, boolean>;

  return { plan, features };
}
