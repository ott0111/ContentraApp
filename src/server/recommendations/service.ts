import { db } from "@/lib/db";

export async function getOpenRecommendations(workspaceId: string) {
  return db.recommendation.findMany({
    where: { workspaceId, status: "OPEN" },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: 20
  });
}
