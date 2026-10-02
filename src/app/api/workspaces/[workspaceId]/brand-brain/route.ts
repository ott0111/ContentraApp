import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { error, handleError, ok } from "@/lib/http";
import { brandBrainSchema } from "@/lib/validators";

function completeness(data: Record<string, unknown>) {
  const fields = ["businessName", "niche", "audience", "positioning", "voice", "websiteUrl"];
  const filled = fields.filter((key) => {
    const value = data[key];
    return typeof value === "string" && value.trim().length > 0;
  }).length;
  return Math.round((filled / fields.length) * 100);
}

export async function GET(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId);
    const brain = await db.brandBrain.findUnique({ where: { workspaceId } });
    if (!brain) return error("Brand Brain not found", 404);
    return ok(brain);
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
    const input = brandBrainSchema.parse(await request.json());
    const current = await db.brandBrain.findUnique({ where: { workspaceId } });
    if (!current) return error("Brand Brain not found", 404);

    const merged = {
      businessName: input.businessName ?? current.businessName,
      niche: input.niche ?? current.niche,
      audience: input.audience ?? current.audience,
      positioning: input.positioning ?? current.positioning,
      voice: input.voice ?? current.voice,
      goals: input.goals ?? current.goals,
      offers: input.offers ?? current.offers,
      competitors: input.competitors ?? current.competitors,
      contentPillars: input.contentPillars ?? current.contentPillars,
      websiteUrl: input.websiteUrl ?? current.websiteUrl,
      context: input.context ?? current.context
    };

    const brain = await db.brandBrain.update({
      where: { workspaceId },
      data: { ...merged, completeness: completeness(merged) }
    });

    return ok(brain);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
