import { db } from "@/lib/db";

export async function getBrandBrain(workspaceId: string) {
  return db.brandBrain.findUnique({ where: { workspaceId } });
}

export async function updateBrandBrain(workspaceId: string, data: Record<string, unknown>) {
  return db.brandBrain.update({
    where: { workspaceId },
    data
  });
}
