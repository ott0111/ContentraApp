import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { error, handleError, ok } from "@/lib/http";
import { getWorkspaceEntitlements } from "@/server/access/entitlements";

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId);
    return ok(await getWorkspaceEntitlements(workspaceId));
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
