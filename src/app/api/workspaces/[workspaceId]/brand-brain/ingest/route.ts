import { requireUser } from "@/lib/auth";
import { requireMembership } from "@/lib/access";
import { db } from "@/lib/db";
import { generateText } from "@/lib/ai";
import { fetchWebsite } from "@/lib/website";
import { error, handleError, ok } from "@/lib/http";
import { z } from "zod";

const schema = z.object({ websiteUrl: z.string().url().max(500) });
const extractionSchema = z.object({
  businessName: z.string().nullable().optional(),
  niche: z.string().nullable().optional(),
  audience: z.string().nullable().optional(),
  positioning: z.string().nullable().optional(),
  voice: z.string().nullable().optional(),
  goals: z.array(z.string()).optional(),
  offers: z.array(z.string()).optional(),
  competitors: z.array(z.string()).optional(),
  contentPillars: z.array(z.string()).optional()
});

function completeness(data: Record<string, unknown>) {
  const fields = ["businessName", "niche", "audience", "positioning", "voice", "websiteUrl"];
  return Math.round(fields.filter((key) => typeof data[key] === "string" && String(data[key]).trim()).length / fields.length * 100);
}

export async function POST(request: Request, { params }: { params: Promise<{ workspaceId: string }> }) {
  try {
    const user = await requireUser();
    const { workspaceId } = await params;
    await requireMembership(user.id, workspaceId, "MEMBER");
    const { websiteUrl } = schema.parse(await request.json());
    const site = await fetchWebsite(websiteUrl);

    const prompt = "Analyze this business website and return ONLY valid JSON matching this shape:\n" +
      '{"businessName":null,"niche":null,"audience":null,"positioning":null,"voice":null,"goals":[],"offers":[],"competitors":[],"contentPillars":[]}\n' +
      "Infer only from the supplied page. Use null/[] when unknown. Do not invent competitors. Keep strings concise.\n\n" +
      "URL: " + site.url + "\nTitle: " + (site.title || "") + "\nDescription: " + (site.description || "") +
      "\nPage text:\n" + site.text;

    const generated = await generateText({
      system: "You extract structured business context for a creator growth platform. Return strict JSON only.",
      prompt,
      temperature: 0.2
    });

    let extracted: z.infer<typeof extractionSchema>;
    try { extracted = extractionSchema.parse(JSON.parse(generated.text)); }
    catch { return error("AI could not produce valid Brand Brain data. Try again.", 502); }

    const current = await db.brandBrain.findUnique({ where: { workspaceId } });
    if (!current) return error("Brand Brain not found", 404);

    const data = {
      businessName: extracted.businessName ?? current.businessName,
      niche: extracted.niche ?? current.niche,
      audience: extracted.audience ?? current.audience,
      positioning: extracted.positioning ?? current.positioning,
      voice: extracted.voice ?? current.voice,
      goals: extracted.goals ?? current.goals,
      offers: extracted.offers ?? current.offers,
      competitors: extracted.competitors ?? current.competitors,
      contentPillars: extracted.contentPillars ?? current.contentPillars,
      websiteUrl: site.url,
      context: {
        ...(typeof current.context === "object" && current.context ? current.context : {}),
        source: "website", sourceUrl: site.url, sourceTitle: site.title, fetchedAt: new Date().toISOString()
      }
    };

    const brain = await db.brandBrain.update({
      where: { workspaceId },
      data: { ...data, completeness: completeness(data) }
    });
    return ok({ brain, source: { url: site.url, title: site.title, description: site.description } });
  } catch (err) {
    if (err instanceof Error && err.name === "AuthError") return error(err.message, 401);
    return handleError(err);
  }
}
