import { db } from "@/lib/db";

export async function listCampaigns(workspaceId: string) {
  return db.campaign.findMany({
    where: { workspaceId },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getCampaign(workspaceId: string, campaignId: string) {
  return db.campaign.findFirst({ where: { id: campaignId, workspaceId } });
}
