export const PLAN_RANK = {
  FREE: 0,
  PRO: 1,
  BUSINESS: 2,
  AGENCY: 3
} as const;

export type Plan = keyof typeof PLAN_RANK;

export type Feature =
  | "dashboard"
  | "brand_brain"
  | "content_dna"
  | "create"
  | "creatos"
  | "analytics_basic"
  | "analytics_advanced"
  | "campaigns"
  | "social_connections"
  | "team"
  | "ai_generation"
  | "ai_ugc"
  | "next_actions"
  | "api_integrations"
  | "multi_workspace";

export const FEATURE_MINIMUM_PLAN: Record<Feature, Plan> = {
  dashboard: "FREE",
  brand_brain: "FREE",
  content_dna: "FREE",
  create: "FREE",
  creatos: "PRO",
  analytics_basic: "FREE",
  analytics_advanced: "PRO",
  campaigns: "PRO",
  social_connections: "PRO",
  team: "BUSINESS",
  ai_generation: "PRO",
  ai_ugc: "PRO",
  next_actions: "PRO",
  api_integrations: "BUSINESS",
  multi_workspace: "AGENCY"
};

export const PLAN_LIMITS = {
  FREE: { aiGenerations: 20, ugcVideos: 0, socialConnections: 1, teamSeats: 1, campaigns: 0 },
  PRO: { aiGenerations: 250, ugcVideos: 10, socialConnections: 5, teamSeats: 1, campaigns: 10 },
  BUSINESS: { aiGenerations: 1000, ugcVideos: 50, socialConnections: 20, teamSeats: 10, campaigns: 50 },
  AGENCY: { aiGenerations: 5000, ugcVideos: 250, socialConnections: 100, teamSeats: 50, campaigns: 250 }
} as const;

export function planIncludes(current: Plan, required: Plan) {
  return PLAN_RANK[current] >= PLAN_RANK[required];
}
