import { compare } from "bcryptjs";
import { db } from "@/lib/db";
import { createSession } from "@/lib/auth";
import { error, handleError, ok } from "@/lib/http";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  try {
    const input = loginSchema.parse(await request.json());
    const user = await db.user.findUnique({ where: { email: input.email.toLowerCase() } });

    if (!user || !(await compare(input.password, user.passwordHash))) {
      return error("Invalid email or password", 401);
    }

    await createSession(user.id);

    return ok({ user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    return handleError(err);
  }
}
