import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error } from "@/lib/http";

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string; generationId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId, generationId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");

    const job = await db.generationJob.findFirst({ where: { id: generationId, workspaceId } });
    if (!job) return error("Generation not found", 404);
    if (job.status !== "COMPLETED" || !job.outputUrl) return error("Video is not ready yet", 409);

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return error("AI provider is not configured", 503);

    const response = await fetch(job.outputUrl, {
      headers: { "x-goog-api-key": apiKey },
      cache: "no-store"
    });
    if (!response.ok || !response.body) return error("Generated video could not be retrieved", 502);

    return new Response(response.body, {
      status: 200,
      headers: {
        "Content-Type": job.outputMimeType || response.headers.get("content-type") || "video/mp4",
        "Cache-Control": "private, max-age=3600"
      }
    });
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return error(err instanceof Error ? err.message : "Unable to retrieve video", 500);
  }
}
