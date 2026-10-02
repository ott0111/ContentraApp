import { db } from "@/lib/db";
import { PLAN_LIMITS, type Plan } from "@/server/access/plans";

type UsageMetric = "aiGenerations" | "ugcVideos" | "socialConnections" | "teamSeats" | "campaigns";

export async function assertPlanLimit(workspaceId: string, metric: UsageMetric, increment = 1) {
  const workspace = await db.workspace.findUnique({
    where: { id: workspaceId },
    select: { plan: true }
  });
  if (!workspace) throw new Error("Workspace not found");

  const plan = workspace.plan as Plan;
  const limit = PLAN_LIMITS[plan][metric];

  const now = new Date();
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  const usage = await db.usageCounter.findUnique({
    where: { workspaceId_metric_periodStart: { workspaceId, metric, periodStart } }
  });

  const current = usage?.count ?? 0;
  if (current + increment > limit) {
    throw new Error(`PLAN_LIMIT_EXCEEDED:${metric}:${limit}`);
  }

  return { plan, limit, current, remaining: limit - current };
}

export async function consumePlanUsage(workspaceId: string, metric: UsageMetric, amount = 1) {
  const now = new Date();
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));

  return db.usageCounter.upsert({
    where: { workspaceId_metric_periodStart: { workspaceId, metric, periodStart } },
    update: { count: { increment: amount }, updatedAt: new Date() },
    create: { workspaceId, metric, periodStart, count: amount }
  });
}
