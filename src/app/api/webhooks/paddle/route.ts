import { handlePaddleWebhook } from "@/server/billing/paddle";

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("paddle-signature") ?? "";
    await handlePaddleWebhook(rawBody, signature);
    return Response.json({ received: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Webhook failed";
    const status = message.includes("signature") || message.includes("PADDLE_WEBHOOK_SECRET") ? 401 : 500;
    return Response.json({ error: message }, { status });
  }
}
