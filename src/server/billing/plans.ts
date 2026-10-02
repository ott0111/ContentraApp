import { PLAN_LIMITS, FEATURE_MINIMUM_PLAN, PLAN_RANK, type Feature, type Plan } from "@/server/access/plans";

export const BILLING_PLANS = {
  FREE: { priceMonthly: 0, name: "Free" },
  PRO: { priceMonthly: 19.99, name: "Pro" },
  BUSINESS: { priceMonthly: 49.99, name: "Business" },
  AGENCY: { priceMonthly: 129.99, name: "Agency" }
} as const;

export function getPlanDefinition(plan: Plan) {
  return {
    ...BILLING_PLANS[plan],
    rank: PLAN_RANK[plan],
    limits: PLAN_LIMITS[plan],
    features: Object.entries(FEATURE_MINIMUM_PLAN)
      .filter(([, required]) => PLAN_RANK[plan] >= PLAN_RANK[required])
      .map(([feature]) => feature as Feature)
  };
}
