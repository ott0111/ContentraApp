import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId);

    const since = new Date(Date.now() - 30 * 86400000);

    const [workspace, content, opportunities, recommendations, analytics] = await Promise.all([
      db.workspace.findUnique({ where: { id: workspaceId }, include: { brandBrain: true, contentDNA: true } }),
      db.contentItem.findMany({ where: { workspaceId }, orderBy: { updatedAt: "desc" }, take: 8 }),
      db.opportunity.findMany({ where: { workspaceId, status: "NEW" }, orderBy: { score: "desc" }, take: 5 }),
      db.recommendation.findMany({ where: { workspaceId, status: "OPEN" }, orderBy: { priority: "desc" }, take: 5 }),
      db.analyticsSnapshot.findMany({ where: { workspaceId, date: { gte: since } } })
    ]);

    if (!workspace) return error("Workspace not found", 404);

    const totals = analytics.reduce(
      (acc, row) => ({
        views: acc.views + row.views,
        likes: acc.likes + row.likes,
        comments: acc.comments + row.comments,
        shares: acc.shares + row.shares,
        saves: acc.saves + row.saves,
        reach: acc.reach + row.reach
      }),
      { views: 0, likes: 0, comments: 0, shares: 0, saves: 0, reach: 0 }
    );

    return ok({
      workspace,
      metrics: { ...totals, contentCount: content.length },
      recentContent: content,
      opportunities,
      recommendations
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
