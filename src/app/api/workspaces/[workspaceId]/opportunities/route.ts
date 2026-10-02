import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";
import { requireEntitlement } from "@/server/access/require-entitlement";
import { z } from "zod";
import { requireEntitlement } from "@/server/access/require-entitlement";

const querySchema = z.object({
  status: z.enum(["NEW", "SAVED", "DISMISSED", "ACTIONED"]).optional(),
  platform: z.enum(["INSTAGRAM", "TIKTOK", "YOUTUBE", "X", "LINKEDIN", "OTHER"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50)
});

export async function GET(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId);
    await requireEntitlement(workspaceId, "creatos");
    const query = querySchema.parse(Object.fromEntries(new URL(request.url).searchParams));
    const opportunities = await db.opportunity.findMany({
      where: { workspaceId, ...(query.status ? { status: query.status } : {}), ...(query.platform ? { platform: query.platform } : {}) },
      orderBy: [{ score: "desc" }, { createdAt: "desc" }],
      take: query.limit
    });
    return ok(opportunities);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
