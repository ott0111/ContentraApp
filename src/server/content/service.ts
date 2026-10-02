import { db } from "@/lib/db";
import type { ContentStatus } from "@prisma/client";

export async function listContent(workspaceId: string, status?: ContentStatus) {
  return db.contentItem.findMany({
    where: { workspaceId, ...(status ? { status } : {}) },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getContent(workspaceId: string, contentId: string) {
  return db.contentItem.findFirst({ where: { id: contentId, workspaceId } });
}
