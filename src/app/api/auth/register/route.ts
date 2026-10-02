import { hash } from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { created, error, handleError } from "@/lib/http";
import { registerSchema } from "@/lib/validators";
import { uniqueWorkspaceSlug } from "@/lib/slug";

export async function POST(request: Request) {
  try {
    const input = registerSchema.parse(await request.json());
    const email = input.email.toLowerCase();

    const exists = await db.user.findUnique({ where: { email } });
    if (exists) return error("An account with that email already exists", 409);

    const passwordHash = await hash(input.password, 12);
    const workspaceName = input.workspaceName || `${input.name || "My"} Workspace`;
    const slug = await uniqueWorkspaceSlug(workspaceName);

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, passwordHash, name: input.name }
      });

      const workspace = await tx.workspace.create({
        data: {
          name: workspaceName,
          slug,
          brandBrain: { create: {} },
          contentDNA: { create: {} }
        }
      });

      await tx.membership.create({
        data: { userId: user.id, workspaceId: workspace.id, role: "OWNER" }
      });

      await tx.subscription.create({
        data: {
          workspaceId: workspace.id,
          plan: "FREE",
          status: "ACTIVE",
          provider: "MANUAL"
        }
      });

      return { user, workspace };
    });

    await createSession(result.user.id);

    return created({
      user: { id: result.user.id, email: result.user.email, name: result.user.name },
      workspace: result.workspace
    });
  } catch (err) {
    return handleError(err);
  }
}
