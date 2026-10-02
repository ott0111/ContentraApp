import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { created, error, handleError, ok } from "@/lib/http";
import { campaignSchema } from "@/lib/validators";
import { requireEntitlement } from "@/server/access/require-entitlement";
import { assertPlanLimit, consumePlanUsage } from "@/server/usage/limits";

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId);
    await requireEntitlement(workspaceId, "campaigns");
    return ok(await db.campaign.findMany({ where: { workspaceId }, orderBy: { createdAt: "desc" } }));
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    await requireEntitlement(workspaceId, "campaigns");
    await assertPlanLimit(workspaceId, "campaigns");
    const input = campaignSchema.parse(await request.json());
    const campaign = await db.campaign.create({ data: { ...input, workspaceId } });
    await consumePlanUsage(workspaceId, "campaigns");
    return created(campaign);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
