import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { error, handleError, ok } from "@/lib/http";
import { analyzeContentDNA } from "@/lib/content-dna";

export async function POST(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    return ok(await analyzeContentDNA(workspaceId));
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
