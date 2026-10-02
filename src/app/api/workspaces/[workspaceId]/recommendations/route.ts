import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";
import { requireEntitlement } from "@/server/access/require-entitlement";

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId);
    await requireEntitlement(workspaceId, "next_actions");
    const recommendations = await db.recommendation.findMany({
      where: { workspaceId, status: "OPEN" },
      orderBy: [{ priority: "desc" }, { confidence: "desc" }, { createdAt: "desc" }],
      take: 20
    });
    return ok(recommendations);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
