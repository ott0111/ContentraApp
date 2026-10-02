import { db } from "@/lib/db";
import { ok } from "@/lib/http";

export async function GET() {
  const started = Date.now();
  await db.$queryRaw`SELECT 1`;
  return ok({ status: "ok", database: "ok", latencyMs: Date.now() - started, timestamp: new Date().toISOString() });
}
