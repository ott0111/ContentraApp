import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  description: z.string().max(1000).nullable().optional(),
  visualPrompt: z.string().trim().min(10).max(3000),
  imageUrl: z.string().url().max(2000).nullable().optional(),
  metadata: z.record(z.string(), z.unknown()).nullable().optional()
});

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    return ok(await db.uGCCharacter.findMany({ where: { workspaceId, active: true }, orderBy: { createdAt: "desc" } }));
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
    const input = schema.parse(await request.json());
    return ok(await db.uGCCharacter.create({ data: { workspaceId, ...input } }), 201);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
