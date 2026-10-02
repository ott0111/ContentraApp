import { createHmac, timingSafeEqual } from "node:crypto";
import { db } from "@/lib/db";
import type { Plan, SubscriptionStatus } from "@prisma/client";

function verifySignature(rawBody: string, header: string, secret: string) {
  const parts = Object.fromEntries(header.split(";").map((part) => part.split("=", 2))) as { ts?: string; h1?: string };
  if (!parts.ts || !parts.h1) return false;
  const age = Math.abs(Date.now() / 1000 - Number(parts.ts));
  if (!Number.isFinite(age) || age > 5) return false;
  const expected = createHmac("sha256", secret).update(`${parts.ts}:${rawBody}`).digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(parts.h1);
  return a.length === b.length && timingSafeEqual(a, b);
}

function mapPlan(priceId: string | undefined): Plan {
  if (priceId && priceId === process.env.PADDLE_PRICE_AGENCY) return "AGENCY";
  if (priceId && priceId === process.env.PADDLE_PRICE_BUSINESS) return "BUSINESS";
  if (priceId && priceId === process.env.PADDLE_PRICE_PRO) return "PRO";
  return "FREE";
}

function mapStatus(status: string): SubscriptionStatus {
  if (status === "active") return "ACTIVE";
  if (status === "trialing") return "TRIALING";
  if (status === "past_due") return "PAST_DUE";
  if (status === "canceled") return "CANCELED";
  return "EXPIRED";
}

export async function handlePaddleWebhook(rawBody: string, signature: string) {
  const secret = process.env.PADDLE_WEBHOOK_SECRET;
  if (!secret) throw new Error("PADDLE_WEBHOOK_SECRET is not configured");
  if (!verifySignature(rawBody, signature, secret)) throw new Error("Invalid Paddle webhook signature");

  const event = JSON.parse(rawBody) as {
    event_id?: string;
    event_type?: string;
    data?: Record<string, any>;
  };
  if (!event.event_id || !event.event_type || !event.data) throw new Error("Invalid Paddle event");

  const existing = await db.webhookEvent.findUnique({ where: { providerEventId: event.event_id } });
  if (existing?.status === "PROCESSED") return { duplicate: true };

  const webhook = existing ?? await db.webhookEvent.create({
    data: {
      provider: "PADDLE",
      providerEventId: event.event_id,
      eventType: event.event_type,
      payload: event.data
    }
  });

  try {
    const data = event.data;
    const customData = data.custom_data as Record<string, unknown> | null | undefined;
    const workspaceId = typeof customData?.workspaceId === "string"
      ? customData.workspaceId
      : (await db.subscription.findUnique({ where: { providerSubscriptionId: String(data.id ?? "") } }))?.workspaceId;

    if (workspaceId && event.event_type.startsWith("subscription.")) {
      const item = Array.isArray(data.items) ? data.items[0] : null;
      const priceId = item?.price?.id as string | undefined;
      const period = data.current_billing_period as { starts_at?: string; ends_at?: string } | null;
      const status = mapStatus(String(data.status ?? "canceled"));
      const plan = mapPlan(priceId);

      await db.$transaction(async (tx) => {
        await tx.subscription.upsert({
          where: { workspaceId },
          update: {
            plan,
            status,
            provider: "PADDLE",
            customerId: String(data.customer_id ?? ""),
            providerSubscriptionId: String(data.id ?? ""),
            currentPeriodStart: period?.starts_at ? new Date(period.starts_at) : null,
            currentPeriodEnd: period?.ends_at ? new Date(period.ends_at) : null,
            cancelAtPeriodEnd: Boolean(data.scheduled_change?.action === "cancel")
          },
          create: {
            workspaceId,
            plan,
            status,
            provider: "PADDLE",
            customerId: String(data.customer_id ?? ""),
            providerSubscriptionId: String(data.id ?? ""),
            currentPeriodStart: period?.starts_at ? new Date(period.starts_at) : null,
            currentPeriodEnd: period?.ends_at ? new Date(period.ends_at) : null
          }
        });
        await tx.workspace.update({ where: { id: workspaceId }, data: { plan } });
        await tx.webhookEvent.update({
          where: { id: webhook.id },
          data: { workspaceId, status: "PROCESSED", processedAt: new Date() }
        });
      });
    } else {
      await db.webhookEvent.update({
        where: { id: webhook.id },
        data: { status: "PROCESSED", processedAt: new Date() }
      });
    }

    return { duplicate: false };
  } catch (error) {
    await db.webhookEvent.update({
      where: { id: webhook.id },
      data: { status: "FAILED", error: error instanceof Error ? error.message : "Webhook processing failed" }
    });
    throw error;
  }
}
