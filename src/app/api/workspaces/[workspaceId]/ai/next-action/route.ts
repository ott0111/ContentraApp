import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { generateText } from "@/lib/ai";
import { error, handleError, ok } from "@/lib/http";

export async function POST(_request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");

    const [brain, dna, analytics, recentContent] = await Promise.all([
      db.brandBrain.findUnique({ where: { workspaceId } }),
      db.contentDNA.findUnique({ where: { workspaceId } }),
      db.analyticsSnapshot.findMany({ where: { workspaceId }, orderBy: { date: "desc" }, take: 30 }),
      db.contentItem.findMany({ where: { workspaceId }, orderBy: { updatedAt: "desc" }, take: 10 })
    ]);

    const prompt = `Decide the single most useful next content/growth action for this workspace.
Return JSON only with keys: title, description, actionType, priority, confidence.
priority is 1-5. confidence is 0-1.
Brand Brain: ${JSON.stringify(brain)}
Content DNA: ${JSON.stringify(dna)}
Recent analytics: ${JSON.stringify(analytics)}
Recent content: ${JSON.stringify(recentContent)}`;

    const result = await generateText({
      system: "You are Contentra's Next Best Action engine. Be specific and grounded in the supplied data.",
      prompt,
      temperature: 0.3
    });

    let recommendation: { title: string; description: string; actionType: string; priority: number; confidence: number };
    try {
      recommendation = JSON.parse(result.text);
    } catch {
      return ok({ generatedText: result.text, saved: false });
    }

    const saved = await db.recommendation.create({
      data: {
        workspaceId,
        title: recommendation.title,
        description: recommendation.description,
        actionType: recommendation.actionType,
        priority: recommendation.priority,
        confidence: recommendation.confidence
      }
    });

    return ok({ recommendation: saved, generated: result });
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    if (err instanceof Error && err.message === "AI provider is not configured") {
      return error("AI provider is not configured. Add GEMINI_API_KEY to the server environment.", 503);
    }
    return handleError(err);
  }
}
