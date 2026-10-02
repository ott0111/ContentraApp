import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";
import { contentCreateSchema } from "@/lib/validators";
import { z } from "zod";

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string; contentId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId, contentId } = await params;
    await requireMembership(user.id, workspaceId);
    const item = await db.contentItem.findFirst({ where: { id: contentId, workspaceId }, include: { analytics: true } });
    if (!item) return error("Content not found", 404);
    return ok(item);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ workspaceId: string; contentId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId, contentId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    const input = contentCreateSchema.partial().parse(await request.json());

    const existing = await db.contentItem.findFirst({ where: { id: contentId, workspaceId } });
    if (!existing) return error("Content not found", 404);

    const item = await db.contentItem.update({ where: { id: contentId }, data: input });
    return ok(item);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ workspaceId: string; contentId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId, contentId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    const existing = await db.contentItem.findFirst({ where: { id: contentId, workspaceId } });
    if (!existing) return error("Content not found", 404);
    await db.contentItem.delete({ where: { id: contentId } });
    return ok({ deleted: true });
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
