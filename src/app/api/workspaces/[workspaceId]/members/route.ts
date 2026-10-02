import { requireUser, AuthError } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";
import { requireEntitlement } from "@/server/access/require-entitlement";

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser(); const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    await requireEntitlement(workspaceId, "team");
    const members = await db.membership.findMany({ where:{workspaceId}, include:{user:{select:{id:true,name:true,email:true,image:true}}}, orderBy:{createdAt:"asc"} });
    return ok(members);
  } catch (err) { if (err instanceof AuthError) return error(err.message,401); return handleError(err); }
}