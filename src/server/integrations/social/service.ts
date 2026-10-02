import { db } from "@/lib/db";
import { requireEntitlement } from "@/server/access/require-entitlement";
import { auditLog } from "@/server/security/audit";
import { assertPlanLimit, consumePlanUsage } from "@/server/usage/limits";

export async function listConnections(workspaceId: string) {
  return db.socialConnection.findMany({
    where: { workspaceId },
    select: {
      id: true, platform: true, accountId: true, username: true,
      expiresAt: true, scopes: true, status: true, metadata: true,
      createdAt: true, updatedAt: true
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createConnection(input: {
  workspaceId: string;
  platform: "INSTAGRAM" | "TIKTOK" | "YOUTUBE" | "X" | "LINKEDIN" | "OTHER";
  accountId: string;
  username?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  scopes?: string[];
  metadata?: Record<string, unknown>;
  userId: string;
}) {
  await requireEntitlement(input.workspaceId, "social_connections");
  await assertPlanLimit(input.workspaceId, "socialConnections");
  const connection = await db.socialConnection.upsert({
    where: {
      workspaceId_platform_accountId: {
        workspaceId: input.workspaceId,
        platform: input.platform,
        accountId: input.accountId
      }
    },
    update: {
      username: input.username,
      accessToken: input.accessToken,
      refreshToken: input.refreshToken,
      expiresAt: input.expiresAt,
      scopes: input.scopes ?? [],
      metadata: input.metadata
    },
    create: {
      workspaceId: input.workspaceId,
      platform: input.platform,
      accountId: input.accountId,
      username: input.username,
      accessToken: input.accessToken,
      refreshToken: input.refreshToken,
      expiresAt: input.expiresAt,
      scopes: input.scopes ?? [],
      metadata: input.metadata
    }
  });
  await consumePlanUsage(input.workspaceId, "socialConnections");
  await auditLog({
    workspaceId: input.workspaceId,
    userId: input.userId,
    action: "social.connection.created",
    resource: "SocialConnection",
    resourceId: connection.id,
    metadata: { platform: input.platform }
  });
  return connection;
}
