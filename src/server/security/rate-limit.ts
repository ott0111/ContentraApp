import { db } from "@/lib/db";

export async function checkDatabaseRateLimit(input: {
  workspaceId?: string;
  key: string;
  limit: number;
  windowMs: number;
}) {
  // This helper is intentionally isolated so it can move to Redis without changing API handlers.
  // Database-backed rate limiting is suitable for low-volume development; use Redis/Upstash for multi-instance production.
  const bucket = new Date(Math.floor(Date.now() / input.windowMs) * input.windowMs);
  const scope = input.workspaceId ? `${input.workspaceId}:${input.key}` : input.key;

  const record = await db.usageCounter.upsert({
    where: { workspaceId_metric_periodStart: {
      workspaceId: input.workspaceId ?? "global",
      metric: `rate:${scope}`,
      periodStart: bucket
    }},
    update: { count: { increment: 1 } },
    create: {
      workspaceId: input.workspaceId ?? "global",
      metric: `rate:${scope}`,
      periodStart: bucket,
      count: 1
    }
  });

  if (record.count > input.limit) throw new Error("RATE_LIMIT_EXCEEDED");
  return { remaining: Math.max(0, input.limit - record.count) };
}
