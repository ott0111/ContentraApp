import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";
import { z } from "zod";

const schema = z.object({
  winningFormats: z.unknown().optional(),
  winningTopics: z.unknown().optional(),
  winningHooks: z.unknown().optional(),
  winningStructures: z.unknown().optional(),
  audienceSignals: z.unknown().optional(),
  platformPatterns: z.unknown().optional(),
  learnings: z.array(z.string().max(1000)).max(100).optional(),
  confidence: z.number().min(0).max(1).optional(),
  analyzedItems: z.number().int().min(0).optional()
});

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId);
    const dna = await db.contentDNA.findUnique({ where: { workspaceId } });
    if (!dna) return error("Content DNA not found", 404);
    return ok(dna);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    const input = schema.parse(await request.json());
    const dna = await db.contentDNA.upsert({
      where: { workspaceId },
      create: { workspaceId, ...input },
      update: input
    });
    return ok(dna);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
