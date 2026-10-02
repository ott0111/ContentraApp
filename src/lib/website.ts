import dns from "node:dns/promises";
import net from "node:net";

const MAX_BYTES = 1_000_000;
const MAX_TEXT = 30_000;
const MAX_REDIRECTS = 5;

function isPrivateIp(address: string) {
  const normalized = address.toLowerCase();
  if (net.isIPv4(address)) {
    const [a, b] = address.split(".").map(Number);
    return a === 10 ||
      a === 127 ||
      a === 0 ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168);
  }

  if (net.isIPv6(address)) {
    return normalized === "::1" ||
      normalized === "::" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe8") ||
      normalized.startsWith("fe9") ||
      normalized.startsWith("fea") ||
      normalized.startsWith("feb");
  }

  return true;
}

function isPrivateHostname(hostname: string) {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  return host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "0.0.0.0" ||
    isPrivateIp(host);
}

async function assertPublicHost(hostname: string) {
  if (isPrivateHostname(hostname)) throw new Error("Private or local website addresses are not allowed");

  const addresses = await dns.lookup(hostname, { all: true, verbatim: true });
  if (!addresses.length || addresses.some(({ address }) => isPrivateIp(address))) {
    throw new Error("Website hostname resolves to a private or local address");
  }
}

function cleanText(value: string) {
  return value
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<svg[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, MAX_TEXT);
}

function meta(html: string, name: string) {
  const escaped = name.replace(/[.*+?^\$\\{}()|[\]\\]/g, "\\\$&");
  const re = new RegExp("<meta[^>]+(?:name|property)=[\"']" + escaped +
    "[\"'][^>]+content=[\"']([^\"']*)[\"'][^>]*>", "i");
  return html.match(re)?.[1]?.trim() || null;
}

export async function fetchWebsite(inputUrl: string) {
  let current = new URL(inputUrl);
  if (!["http:", "https:"].includes(current.protocol)) {
    throw new Error("Only HTTP and HTTPS website URLs are supported");
  }

  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
    await assertPublicHost(current.hostname);

    const response = await fetch(current.toString(), {
      headers: { "User-Agent": "ContentraBot/1.0" },
      redirect: "manual",
      signal: AbortSignal.timeout(10_000),
      cache: "no-store"
    });

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("Website returned a redirect without a location");
      if (redirects === MAX_REDIRECTS) throw new Error("Website redirected too many times");
      current = new URL(location, current);
      if (!["http:", "https:"].includes(current.protocol)) {
        throw new Error("Website redirected to an unsupported protocol");
      }
      continue;
    }

    if (!response.ok) throw new Error("Website returned HTTP " + response.status);
    if (!(response.headers.get("content-type") || "").toLowerCase().includes("text/html")) {
      throw new Error("Website did not return HTML");
    }

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
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.length;
    }

    const html = new TextDecoder().decode(bytes);
    const title = html.match(/<title[^>]*>([\\s\\S]*?)<\\/title>/i)?.[1]
      ?.replace(/<[^>]+>/g, "")
      .trim() || null;

    return {
      url: current.toString(),
      title,
      description: meta(html, "description") || meta(html, "og:description"),
      ogTitle: meta(html, "og:title"),
      text: cleanText(html)
    };
  }

  throw new Error("Unable to fetch website");
}
