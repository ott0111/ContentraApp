import { createHash } from "node:crypto";
import { db } from "@/lib/db";

export async function getIdempotencyState(input: {
  key: string;
  workspaceId?: string;
  userId?: string;
  body: unknown;
}) {
  const requestHash = createHash("sha256").update(JSON.stringify(input.body)).digest("hex");
  const existing = await db.idempotencyKey.findUnique({
    where: { workspaceId_key: { workspaceId: input.workspaceId ?? "", key: input.key } }
  }).catch(() => null);

  if (!existing) {
    return { requestHash, existing: null };
  }

  if (existing.expiresAt <= new Date()) {
    await db.idempotencyKey.delete({ where: { id: existing.id } });
    return { requestHash, existing: null };
  }

  if (existing.requestHash !== requestHash) {
    throw new Error("IDEMPOTENCY_KEY_REUSED");
  }

  return { requestHash, existing };
}

export async function storeIdempotencyResult(input: {
  key: string;
  workspaceId?: string;
  userId?: string;
  requestHash: string;
  status: number;
  response: unknown;
  ttlMs?: number;
}) {
  return db.idempotencyKey.upsert({
    where: { workspaceId_key: { workspaceId: input.workspaceId ?? "", key: input.key } },
    update: { status: input.status, response: input.response as object },
    create: {
      workspaceId: input.workspaceId,
      userId: input.userId,
      key: input.key,
      requestHash: input.requestHash,
      status: input.status,
      response: input.response as object,
      expiresAt: new Date(Date.now() + (input.ttlMs ?? 24 * 60 * 60 * 1000))
    }
  });
}
