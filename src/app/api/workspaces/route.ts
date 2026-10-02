import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { created, error, handleError, ok } from "@/lib/http";
import { uniqueWorkspaceSlug } from "@/lib/slug";
import { z } from "zod";

const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1).max(100)
});

export async function GET() {
  try {
    const user = await requireUser();
    const memberships = await db.membership.findMany({
      where: { userId: user.id },
      include: { workspace: true },
      orderBy: { createdAt: "asc" }
    });
    return ok(memberships.map((m) => ({ ...m.workspace, role: m.role })));
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const { name } = createWorkspaceSchema.parse(await request.json());
    const workspace = await db.workspace.create({
      data: {
        name,
        slug: await uniqueWorkspaceSlug(name),
        brandBrain: { create: {} },
        contentDNA: { create: {} },
        memberships: { create: { userId: user.id, role: "OWNER" } }
      }
    });
    return created(workspace);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
