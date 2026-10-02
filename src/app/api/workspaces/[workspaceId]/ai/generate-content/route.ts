import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { generateText } from "@/lib/ai";
import { error, handleError, ok } from "@/lib/http";
import { parseJsonObject } from "@/lib/json";
import { z } from "zod";
import { requireEntitlement } from "@/server/access/require-entitlement";

const schema = z.object({
  prompt: z.string().trim().min(1).max(10000),
  platform: z.enum(["INSTAGRAM", "TIKTOK", "YOUTUBE", "X", "LINKEDIN", "OTHER"]).optional(),
  save: z.boolean().optional().default(true)
});

const packageSchema = z.object({
  title: z.string(),
  hook: z.string(),
  script: z.string(),
  caption: z.string(),
  cta: z.string(),
  visualDirection: z.string()
});

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    await requireEntitlement(workspaceId, "ai_generation");
    const input = schema.parse(await request.json());

    const [brain, dna] = await Promise.all([
      db.brandBrain.findUnique({ where: { workspaceId } }),
      db.contentDNA.findUnique({ where: { workspaceId } })
    ]);

    const result = await generateText({
      system: [
        "You are Contentra's short-form content engine.",
        "Create specific, publishable content instead of generic advice.",
        "Never invent facts, customer results, testimonials, statistics, or product capabilities.",
        "Return JSON only."
      ].join("\n"),
      prompt: [
        '{"title":"","hook":"","script":"","caption":"","cta":"","visualDirection":""}',
        "Platform: " + (input.platform || "TIKTOK"),
        "Request: " + input.prompt,
        "Brand Brain: " + JSON.stringify(brain),
        "Content DNA: " + JSON.stringify(dna)
      ].join("\n\n"),
      temperature: 0.7
    });

    const parsed = packageSchema.safeParse(parseJsonObject(result.text));
    if (!parsed.success) return error("AI returned invalid content data. Try again.", 502);

    let saved = null;
    if (input.save) {
      saved = await db.contentItem.create({
        data: {
          workspaceId,
          createdById: user.id,
          title: parsed.data.title,
          type: "VIDEO",
          platform: input.platform || "TIKTOK",
          body: parsed.data.script,
          hook: parsed.data.hook,
          caption: parsed.data.caption,
          metadata: {
            cta: parsed.data.cta,
            visualDirection: parsed.data.visualDirection,
            generatedBy: "Contentra AI"
          }
        }
      });
    }

    return ok({ content: parsed.data, contentItem: saved, model: result.model, usage: result.usage });
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    if (err instanceof Error && err.message === "AI provider is not configured") return error("AI provider is not configured. Add GEMINI_API_KEY.", 503);
    return handleError(err);
  }
}
