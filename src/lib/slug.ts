import { db } from "@/lib/db";

export function slugify(value: string) {
  const base = value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || "workspace";
  return base;
}

export async function uniqueWorkspaceSlug(name: string) {
  const base = slugify(name);
  let slug = base;
  let suffix = 2;

  while (await db.workspace.findUnique({ where: { slug } })) {
    slug = `${base}-${suffix++}`;
  }

  return slug;
}
