import { describe, expect, it } from "vitest";
import { FEATURE_MINIMUM_PLAN, PLAN_LIMITS, planIncludes } from "@/server/access/plans";

describe("plan entitlements", () => {
  it("orders plans correctly", () => {
    expect(planIncludes("FREE", "FREE")).toBe(true);
    expect(planIncludes("FREE", "PRO")).toBe(false);
    expect(planIncludes("BUSINESS", "PRO")).toBe(true);
    expect(planIncludes("AGENCY", "BUSINESS")).toBe(true);
  });

  it("protects paid features", () => {
    expect(FEATURE_MINIMUM_PLAN.ai_ugc).toBe("PRO");
    expect(FEATURE_MINIMUM_PLAN.team).toBe("BUSINESS");
    expect(FEATURE_MINIMUM_PLAN.multi_workspace).toBe("AGENCY");
  });

  it("defines usage limits for every plan", () => {
    for (const plan of ["FREE", "PRO", "BUSINESS", "AGENCY"] as const) {
      expect(PLAN_LIMITS[plan].aiGenerations).toBeGreaterThanOrEqual(0);
      expect(PLAN_LIMITS[plan].teamSeats).toBeGreaterThanOrEqual(1);
    }
  });
});
