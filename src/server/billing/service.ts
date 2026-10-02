import { db } from "@/lib/db";
import type { Plan, SubscriptionStatus } from "@prisma/client";

export async function getSubscription(workspaceId: string) {
  return db.subscription.findUnique({ where: { workspaceId } });
}

export async function setWorkspacePlan(input: {
  workspaceId: string;
  plan: Plan;
  status?: SubscriptionStatus;
  provider?: "PADDLE" | "STRIPE" | "MANUAL";
  customerId?: string;
  subscriptionId?: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
}) {
  return db.$transaction(async (tx) => {
    await tx.workspace.update({
      where: { id: input.workspaceId },
      data: { plan: input.plan }
    });

    return tx.subscription.upsert({
      where: { workspaceId: input.workspaceId },
      update: {
        plan: input.plan,
        status: input.status ?? "ACTIVE",
        provider: input.provider ?? "MANUAL",
        customerId: input.customerId,
        providerSubscriptionId: input.subscriptionId,
        currentPeriodStart: input.currentPeriodStart,
        currentPeriodEnd: input.currentPeriodEnd
      },
      create: {
        workspaceId: input.workspaceId,
        plan: input.plan,
        status: input.status ?? "ACTIVE",
        provider: input.provider ?? "MANUAL",
        customerId: input.customerId,
        providerSubscriptionId: input.subscriptionId,
        currentPeriodStart: input.currentPeriodStart,
        currentPeriodEnd: input.currentPeriodEnd
      }
    });
  });
}
