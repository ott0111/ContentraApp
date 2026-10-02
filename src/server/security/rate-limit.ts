import { db } from "@/lib/db";

export async function checkDatabaseRateLimit(input: {
  key: string;
  limit: number;
  windowMs: number;
}) {
  const windowStart = new Date(Math.floor(Date.now() / input.windowMs) * input.windowMs);
  const record = await db.rateLimitBucket.upsert({
    where: { key_windowStart: { key: input.key, windowStart } },
    update: { count: { increment: 1 } },
    create: { key: input.key, windowStart, count: 1 }
  });

  if (record.count > input.limit) {
    throw new Error("RATE_LIMIT_EXCEEDED");
  }

  return { remaining: Math.max(0, input.limit - record.count) };
}
