import { createHash, randomBytes } from "node:crypto";

export function createOAuthState(input: { userId: string; workspaceId: string; provider: string }) {
  const nonce = randomBytes(24).toString("hex");
  const payload = `${input.userId}:${input.workspaceId}:${input.provider}:${nonce}`;
  const signature = createHash("sha256")
    .update(`${payload}:${process.env.SESSION_SECRET ?? ""}`)
    .digest("hex");

  return Buffer.from(JSON.stringify({ ...input, nonce, signature })).toString("base64url");
}

export function verifyOAuthState(state: string) {
  const decoded = JSON.parse(Buffer.from(state, "base64url").toString("utf8")) as {
    userId: string; workspaceId: string; provider: string; nonce: string; signature: string;
  };
  const payload = `${decoded.userId}:${decoded.workspaceId}:${decoded.provider}:${decoded.nonce}`;
  const expected = createHash("sha256")
    .update(`${payload}:${process.env.SESSION_SECRET ?? ""}`)
    .digest("hex");

  if (decoded.signature !== expected) throw new Error("Invalid OAuth state");
  return decoded;
}
