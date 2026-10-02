import { db } from "@/lib/db";
import { AuthError } from "@/lib/auth";
import type { MembershipRole } from "@prisma/client";

const roleRank: Record<MembershipRole, number> = {
  VIEWER: 10,
  MEMBER: 20,
  ADMIN: 30,
  OWNER: 40
};

export async function requireMembership(
  userId: string,
  workspaceId: string,
  minimumRole: MembershipRole = "VIEWER"
) {
  const membership = await db.membership.findUnique({
    where: { userId_workspaceId: { userId, workspaceId } },
    include: { workspace: true }
  });

  if (!membership || roleRank[membership.role] < roleRank[minimumRole]) {
    throw new AuthError("You do not have access to this workspace");
  }

  return membership;
}

export async function getDefaultWorkspaceId(userId: string) {
  const membership = await db.membership.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { workspaceId: true }
  });
  return membership?.workspaceId ?? null;
}
