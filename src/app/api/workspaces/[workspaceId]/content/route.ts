import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { created, error, handleError, ok } from "@/lib/http";
import { contentCreateSchema } from "@/lib/validators";
import { z } from "zod";

const querySchema = z.object({
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).optional(),
  platform: z.enum(["INSTAGRAM", "TIKTOK", "YOUTUBE", "X", "LINKEDIN", "OTHER"]).optional(),
  limit: z.coerce.number().int().min(1).max(100).default(50)
});

export async function GET(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId);
    const url = new URL(request.url);
    const query = querySchema.parse(Object.fromEntries(url.searchParams));

    const items = await db.contentItem.findMany({
      where: { workspaceId, ...(query.status ? { status: query.status } : {}), ...(query.platform ? { platform: query.platform } : {}) },
      orderBy: { createdAt: "desc" },
      take: query.limit
    });

    return ok(items);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    const input = contentCreateSchema.parse(await request.json());

    const item = await db.contentItem.create({
      data: { ...input, workspaceId, createdById: user.id }
    });

    return created(item);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
