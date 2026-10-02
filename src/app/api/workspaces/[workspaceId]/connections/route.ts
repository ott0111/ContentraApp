import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";
import { z } from "zod";
import { requireEntitlement } from "@/server/access/require-entitlement";

const schema = z.object({
  platform: z.enum(["INSTAGRAM", "TIKTOK", "YOUTUBE", "X", "LINKEDIN", "OTHER"]),
  accountId: z.string().min(1).max(200),
  username: z.string().max(200).nullable().optional(),
  scopes: z.array(z.string().max(200)).max(100).optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional()
});

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId);
    await requireEntitlement(workspaceId, "social_connections");
    const connections = await db.socialConnection.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" } });
    return ok(connections.map(({ accessToken: _accessToken, refreshToken: _refreshToken, ...safe }) => safe));
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "ADMIN");
    await requireEntitlement(workspaceId, "social_connections");
    const input = schema.parse(await request.json());

    const connection = await db.socialConnection.upsert({
      where: {
        workspaceId_platform_accountId: {
          workspaceId,
          platform: input.platform,
          accountId: input.accountId
        }
      },
      create: { ...input, workspaceId },
      update: { ...input, status: "ACTIVE" }
    });

    const { accessToken: _accessToken, refreshToken: _refreshToken, ...safe } = connection;
    return ok(safe);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
