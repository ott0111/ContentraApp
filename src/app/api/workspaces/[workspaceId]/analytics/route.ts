import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { created, error, handleError, ok } from "@/lib/http";
import { z } from "zod";

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
  metadata: z.record(z.string(), z.unknown()).nullable().optional()
});

export async function GET(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId);
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

    const row = await db.analyticsSnapshot.upsert({
      where: {
        workspaceId_platform_date_contentId: {
          workspaceId,
          platform: input.platform,
          date,
          contentId: input.contentId ?? null
        }
      },
      create: { ...input, workspaceId, date, userId: user.id },
      update: { ...input, date }
    });

    return created(row);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
