import { db } from "@/lib/db";

function words(value: string) {
  return value.toLowerCase().match(/[a-z0-9][a-z0-9'-]{2,}/g) || [];
}

function topTerms(values: string[], limit = 10) {
  const counts = new Map<string, number>();
  for (const value of values) for (const word of words(value)) counts.set(word, (counts.get(word) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit)
    .map(([term, count]) => ({ term, count }));
}

function hookShape(hook: string | null) {
  if (!hook) return "missing";
  const value = hook.trim();
  if (value.endsWith("?") || /^(how|why|what|when|who|can|do|does|is|are)\b/i.test(value)) return "question";
  if (/^(stop|don't|never|avoid|here's|here is|3|5|7|10)\b/i.test(value)) return "directive";
  return value.length <= 70 ? "short_statement" : "long_statement";
}

export async function analyzeContentDNA(workspaceId: string) {
  const items = await db.contentItem.findMany({
    where: { workspaceId },
    include: { analytics: true },
    orderBy: { createdAt: "desc" },
    take: 500
  });
  const published = items.filter((item) => item.status === "PUBLISHED");
  const source = published.length ? published : items;
  const analytics = source.flatMap((item) => item.analytics);

  const formats = topTerms(source.map((item) => item.type), 8);
  const topics = topTerms(source.map((item) => [item.title, item.body || "", item.caption || ""].join(" ")), 15);
  const hooks = topTerms(source.map((item) => item.hook || ""), 15);
  const structures = topTerms(source.map((item) => {
    const length = (item.body || item.caption || "").length;
    return length < 300 ? "short" : length < 1200 ? "medium" : "long";
  }), 5);

  const platformCounts = new Map<string, number>();
  for (const item of source) if (item.platform) platformCounts.set(item.platform, (platformCounts.get(item.platform) || 0) + 1);
  const platformPatterns = [...platformCounts.entries()].sort((a, b) => b[1] - a[1])
    .map(([platform, count]) => ({ platform, count }));

  const hookShapes = source.reduce<Record<string, number>>((acc, item) => {
    const shape = hookShape(item.hook);
    acc[shape] = (acc[shape] || 0) + 1;
    return acc;
  }, {});

  const rates = analytics.map((a) => a.engagementRate).filter(Number.isFinite);
  const averageEngagementRate = rates.length ? rates.reduce((a, b) => a + b, 0) / rates.length : 0;
  const audienceSignals = {
    averageEngagementRate: Number(averageEngagementRate.toFixed(4)),
    totalViews: analytics.reduce((sum, a) => sum + a.views, 0),
    totalLikes: analytics.reduce((sum, a) => sum + a.likes, 0),
    totalComments: analytics.reduce((sum, a) => sum + a.comments, 0),
    totalShares: analytics.reduce((sum, a) => sum + a.shares, 0),
    totalSaves: analytics.reduce((sum, a) => sum + a.saves, 0)
  };

  const confidence = Math.min(1, source.length / 30) * (analytics.length ? 1 : 0.7);
  const learnings = [
    source.length ? source.length + " content items analyzed" : "Add content to start learning your Content DNA",
    published.length ? published.length + " published items were prioritized" : "Publish content to improve performance-based learning",
    analytics.length ? "Performance metrics are included in audience signals" : "Connect analytics to learn which formats and topics perform"
  ];

  return db.contentDNA.upsert({
    where: { workspaceId },
    create: { workspaceId, winningFormats: formats, winningTopics: topics, winningHooks: { topTerms: hooks, shapes: hookShapes }, winningStructures: structures, audienceSignals, platformPatterns, learnings, confidence, analyzedItems: source.length },
    update: { winningFormats: formats, winningTopics: topics, winningHooks: { topTerms: hooks, shapes: hookShapes }, winningStructures: structures, audienceSignals, platformPatterns, learnings, confidence, analyzedItems: source.length }
  });
}
