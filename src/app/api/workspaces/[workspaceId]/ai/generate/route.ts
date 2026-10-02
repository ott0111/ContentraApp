import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { generateText } from "@/lib/ai";
import { error, handleError, ok } from "@/lib/http";
import { z } from "zod";

const schema = z.object({
  task: z.enum(["IDEA", "HOOK", "SCRIPT", "CAPTION", "POST", "REMIX", "UGC", "NEXT_ACTION", "GENERAL"]),
  prompt: z.string().trim().min(1).max(10000),
  temperature: z.number().min(0).max(1.5).optional()
});

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    const input = schema.parse(await request.json());

    const [brain, dna] = await Promise.all([
      db.brandBrain.findUnique({ where: { workspaceId } }),
      db.contentDNA.findUnique({ where: { workspaceId } })
    ]);

    const system = [
      "You are Contentra AI, a practical growth and content strategist.",
      "Help creators, businesses and agencies make useful content decisions.",
      "Never invent facts about the user's business. Use only supplied context.",
      "Prefer concise, actionable outputs over generic marketing language.",
      brain ? `Brand Brain: ${JSON.stringify(brain)}` : "Brand Brain: not configured",
      dna ? `Content DNA: ${JSON.stringify(dna)}` : "Content DNA: not configured"
    ].join("\n\n");

    const result = await generateText({
      system,
      prompt: `Task: ${input.task}\nUser request: ${input.prompt}`,
      temperature: input.temperature
    });

    return ok(result);
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    if (err instanceof Error && err.message === "AI provider is not configured") {
      return error("AI provider is not configured. Add GEMINI_API_KEY to the server environment.", 503);
    }
    return handleError(err);
  }
}
