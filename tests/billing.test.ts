import { describe, expect, it } from "vitest";
import { BILLING_PLANS } from "@/server/billing/plans";

describe("billing catalog", () => {
  it("matches Contentra's current monthly pricing", () => {
    expect(BILLING_PLANS.FREE.priceMonthly).toBe(0);
    expect(BILLING_PLANS.PRO.priceMonthly).toBe(19.99);
    expect(BILLING_PLANS.BUSINESS.priceMonthly).toBe(49.99);
    expect(BILLING_PLANS.AGENCY.priceMonthly).toBe(129.99);
  });
});
