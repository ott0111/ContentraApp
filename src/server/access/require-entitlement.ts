import { db } from "@/lib/db";
import { AuthError } from "@/lib/auth";
import { getWorkspacePlan } from "./entitlements";
import { FEATURE_MINIMUM_PLAN, planIncludes, type Feature } from "./plans";

export class PlanRequiredError extends Error {
  name = "PlanRequiredError";
  constructor(
    public readonly feature: Feature,
    public readonly currentPlan: string,
    public readonly requiredPlan: string
  ) {
    super(`The ${feature} feature requires the ${requiredPlan} plan.`);
  }
}

export async function requireEntitlement(workspaceId: string, feature: Feature) {
  const plan = await getWorkspacePlan(workspaceId);
  const required = FEATURE_MINIMUM_PLAN[feature];

  if (!planIncludes(plan, required)) {
    throw new PlanRequiredError(feature, plan, required);
  }

  return { plan, requiredPlan: required };
}

export async function requireWorkspaceRole(
  userId: string,
  workspaceId: string,
  minimumRole: "VIEWER" | "MEMBER" | "ADMIN" | "OWNER" = "VIEWER"
) {
  const rank = { VIEWER: 10, MEMBER: 20, ADMIN: 30, OWNER: 40 } as const;
  const membership = await db.membership.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
    select: { role: true }
  });

  if (!membership || rank[membership.role] < rank[minimumRole]) {
    throw new AuthError("You do not have access to this workspace");
  }

  return membership;
}
