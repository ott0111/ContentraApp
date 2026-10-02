import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { created, error, handleError, ok } from "@/lib/http";
import { z } from "zod";
import { requireEntitlement } from "@/server/access/require-entitlement";

const schema = z.object({
  contentId: z.string().nullable().optional(),
  platform: z.enum(["INSTAGRAM", "TIKTOK", "YOUTUBE", "X", "LINKEDIN", "OTHER"]),
  date: z.coerce.date(),
  views: z.number().int().min(0).default(0),
  likes: z.number().int().min(0).default(0),
  comments: z.number().int().min(0).default(0),
  shares: z.number().int().min(0).default(0),
  saves: z.number().int().min(0).default(0),
  followers: z.number().int().min(0).default(0),
  reach: z.number().int().min(0).default(0),
  engagementRate: z.number().min(0).default(0),
  metadata: z.record(z.string(), z.any()).nullable().optional()
});

export async function GET(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId);
    await requireEntitlement(workspaceId, "analytics_advanced");
    const url = new URL(request.url);
    const days = Math.min(Math.max(Number(url.searchParams.get("days") || 30), 1), 365);
    const since = new Date(Date.now() - days * 86400000);
    const rows = await db.analyticsSnapshot.findMany({
      where: { workspaceId, date: { gte: since } },
      orderBy: { date: "asc" }
    });
    return ok(rows);
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
    const date = new Date(input.date);
    date.setHours(0, 0, 0, 0);

    const existing = await db.analyticsSnapshot.findFirst({
      where: {
        workspaceId,
        platform: input.platform,
        date,
        contentId: input.contentId ?? null
      }
    });

    const data = {
      ...input,
      workspaceId,
      date,
      contentId: input.contentId ?? null,
      userId: user.id
    };

    const row = existing
      ? await db.analyticsSnapshot.update({ where: { id: existing.id }, data })
      : await db.analyticsSnapshot.create({ data });

    return created(row);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
