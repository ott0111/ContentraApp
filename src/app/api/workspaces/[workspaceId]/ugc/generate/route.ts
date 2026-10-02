import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { error, handleError, ok } from "@/lib/http";
import { createUGCJob } from "@/server/ugc/service";
import { z } from "zod";
import { getIdempotencyState, storeIdempotencyResult } from "@/server/security/idempotency";
import { checkDatabaseRateLimit } from "@/server/security/rate-limit";
import { requireEntitlement } from "@/server/access/require-entitlement";

const schema = z.object({
  prompt: z.string().trim().min(1).max(10000),
  aspectRatio: z.enum(["9:16", "16:9"]).optional(),
  characterId: z.string().cuid().optional()
});

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    await requireEntitlement(workspaceId, "ai_ugc");
    const body = await request.json();
    const input = schema.parse(body);
    const idemKey = request.headers.get("idempotency-key");
    if (!idemKey) return error("Idempotency-Key header is required for generation requests", 400);
    await checkDatabaseRateLimit({ key: `ugc:${user.id}`, limit: 20, windowMs: 60_000 });
    const idem = await getIdempotencyState({ key: idemKey, workspaceId, userId: user.id, body });
    if (idem.existing) return ok(idem.existing.response, { status: idem.existing.status });
    const result = await createUGCJob({ workspaceId, userId: user.id, ...input });
    await storeIdempotencyResult({ key: idemKey, workspaceId, userId: user.id, requestHash: idem.requestHash, status: 202, response: result });
    return ok(result, { status: 202 });
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
