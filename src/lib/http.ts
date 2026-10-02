import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { PlanRequiredError } from "@/server/access/require-entitlement";

export function ok<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ data }, init);
}

export function created<T>(data: T) {
  return NextResponse.json({ data }, { status: 201 });
}

export function error(message: string, status = 400, details?: unknown) {
  return NextResponse.json({ error: message, ...(details ? { details } : {}) }, { status });
}

export function handleError(err: unknown) {
  if (err instanceof ZodError) {
    return error("Validation failed", 422, err.issues);
  }
  if (err instanceof PlanRequiredError) {
    return error("This feature requires a paid plan", 403, {
      code: "PLAN_REQUIRED",
      feature: err.feature,
      currentPlan: err.currentPlan,
      requiredPlan: err.requiredPlan
    });
  }
  if (err instanceof Error && err.message.startsWith("PLAN_LIMIT_EXCEEDED:")) {
    const [, metric, limit] = err.message.split(":");
    return error("Plan usage limit reached", 429, {
      code: "PLAN_LIMIT_EXCEEDED",
      metric,
      limit: Number(limit)
    });
  }
  console.error(err);
  return error("Internal server error", 500);
}
