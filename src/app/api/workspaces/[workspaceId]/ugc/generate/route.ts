import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { error, handleError, ok } from "@/lib/http";
import { createUGCJob } from "@/server/ugc/service";
import { z } from "zod";

const schema = z.object({
  prompt: z.string().trim().min(1).max(10000),
  aspectRatio: z.enum(["9:16", "16:9"]).optional(),
  characterId: z.string().cuid().optional()
});

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    const input = schema.parse(await request.json());
    return ok(await createUGCJob({ workspaceId, userId: user.id, ...input }), { status: 202 });
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
