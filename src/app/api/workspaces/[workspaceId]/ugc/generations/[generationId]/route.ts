import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";
import { pollVeoOperation } from "@/lib/ugc";

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string; generationId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId, generationId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");

    const job = await db.generationJob.findFirst({ where: { id: generationId, workspaceId } });
    if (!job) return error("Generation not found", 404);
    if (job.status === "PROCESSING" && job.operationName) {
      const result = await pollVeoOperation(job.operationName);
      if (result.status === "COMPLETED") {
        const updated = await db.generationJob.update({
          where: { id: job.id },
          data: { status: "COMPLETED", outputUrl: result.outputUrl, outputMimeType: result.outputMimeType }
        });
        return ok(updated);
      }
      if (result.status === "FAILED") {
        const updated = await db.generationJob.update({
          where: { id: job.id },
          data: { status: "FAILED", error: result.error }
        });
        return ok(updated);
      }
    }
    return ok(job);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    if (err instanceof Error && err.message === "AI provider is not configured") return error("AI provider is not configured. Add GEMINI_API_KEY.", 503);
    return handleError(err);
  }
}
