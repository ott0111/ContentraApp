import { getCurrentUser } from "@/lib/auth";
import { error, ok } from "@/lib/http";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return error("Authentication required", 401);

  const memberships = await (await import("@/lib/db")).db.membership.findMany({
    where: { userId: user.id },
    include: { workspace: true },
    orderBy: { createdAt: "asc" }
  });

  return ok({
    user: { id: user.id, email: user.email, name: user.name, image: user.image },
    workspaces: memberships.map((m) => ({ ...m.workspace, role: m.role }))
  });
}
