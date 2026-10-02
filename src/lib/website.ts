import { db } from "@/lib/db";

const MAX_BYTES = 1_000_000;
const MAX_TEXT = 30_000;

function isPrivateHostname(hostname: string) {
  const host = hostname.toLowerCase();
  return host === "localhost" || host.endsWith(".localhost") || host === "127.0.0.1" ||
    host === "::1" || host === "0.0.0.0" || host.startsWith("10.") ||
    host.startsWith("192.168.") || /^172\.(1[6-9]|2\d|3[0-1])\./.test(host);
}

function cleanText(value: string) {
  return value.replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"').replace(/&#39;/gi, "'").replace(/\s+/g, " ")
    .trim().slice(0, MAX_TEXT);
}

function meta(html: string, name: string) {
  const escaped = name.replace(/[.*+?^\$\{\}()|[\]\\]/g, "\\$&");
  const re = new RegExp("<meta[^>]+(?:name|property)=[\"']" + escaped +
    "[\"'][^>]+content=[\"']([^\"']*)[\"'][^>]*>", "i");
  return html.match(re)?.[1]?.trim() || null;
}

export async function fetchWebsite(url: string) {
  const parsed = new URL(url);
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("Only HTTP and HTTPS website URLs are supported");
  if (isPrivateHostname(parsed.hostname)) throw new Error("Private or local website addresses are not allowed");

  const response = await fetch(parsed.toString(), {
    headers: { "User-Agent": "ContentraBot/1.0" },
    redirect: "follow",
    signal: AbortSignal.timeout(10_000),
    cache: "no-store"
  });
  if (!response.ok) throw new Error("Website returned HTTP " + response.status);
  if (!(response.headers.get("content-type") || "").includes("text/html")) throw new Error("Website did not return HTML");

  const reader = response.body?.getReader();
  if (!reader) throw new Error("Website response had no readable body");
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    if (!value) continue;
    const chunk = value.byteLength > MAX_BYTES - total ? value.slice(0, MAX_BYTES - total) : value;
    chunks.push(chunk);
    total += chunk.byteLength;
  }
  await reader.cancel();

  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
  const html = new TextDecoder().decode(bytes);
  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() || null;
  return {
    url: parsed.toString(),
    title,
    description: meta(html, "description") || meta(html, "og:description"),
    ogTitle: meta(html, "og:title"),
    text: cleanText(html)
  };
}
