import { analyzeContentDNA } from "@/lib/content-dna";

export async function refreshContentDNA(workspaceId: string) {
  return analyzeContentDNA(workspaceId);
}
