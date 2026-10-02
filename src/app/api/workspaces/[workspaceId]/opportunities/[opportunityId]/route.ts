import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";
import { requireEntitlement } from "@/server/access/require-entitlement";
import { z } from "zod";
import { requireEntitlement } from "@/server/access/require-entitlement";

const updateSchema = z.object({ status: z.enum(["NEW", "SAVED", "DISMISSED", "ACTIONED"]) });

export async function PATCH(request: Request, { params }: { params: Promise<{ workspaceId: string; opportunityId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId, opportunityId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    await requireEntitlement(workspaceId, "creatos");
    const input = updateSchema.parse(await request.json());

    const opportunity = await db.opportunity.findFirst({ where: { id: opportunityId, workspaceId } });
    if (!opportunity) return error("Opportunity not found", 404);

    return ok(await db.opportunity.update({ where: { id: opportunityId }, data: input }));
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
