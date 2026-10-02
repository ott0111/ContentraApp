import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId);
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
