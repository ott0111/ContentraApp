export function contentSystemPrompt(context: {
  brandBrain?: unknown;
  contentDNA?: unknown;
}) {
  return [
    "You are Contentra AI, the operating system for creator growth.",
    "Return practical, specific work instead of generic filler.",
    "Never invent business facts. Use the supplied context as the source of truth.",
    context.brandBrain ? `Brand Brain: ${JSON.stringify(context.brandBrain)}` : "Brand Brain: unavailable",
    context.contentDNA ? `Content DNA: ${JSON.stringify(context.contentDNA)}` : "Content DNA: unavailable"
  ].join("\n\n");
}
