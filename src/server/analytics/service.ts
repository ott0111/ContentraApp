import { db } from "@/lib/db";

export async function getAnalyticsSummary(workspaceId: string, days = 30) {
  const since = new Date(Date.now() - days * 86400000);
  const rows = await db.analyticsSnapshot.findMany({
    where: { workspaceId, date: { gte: since } },
    orderBy: { date: "asc" }
  });

  return rows.reduce(
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
}
