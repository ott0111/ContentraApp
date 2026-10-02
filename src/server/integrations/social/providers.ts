import { createHash, randomBytes } from "node:crypto";

export type SocialProvider = "INSTAGRAM" | "TIKTOK" | "YOUTUBE" | "X";

export interface SocialProviderAdapter {
  provider: SocialProvider;
  getAuthorizationUrl(state: string, redirectUri: string): string;
  exchangeCode(code: string, redirectUri: string, codeVerifier?: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
    accountId: string;
    username?: string;
    scopes: string[];
  }>;
  refreshAccessToken(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken?: string;
    expiresAt?: Date;
  }>;
}

const configs = {
  INSTAGRAM: {
    auth: "https://www.facebook.com/v24.0/dialog/oauth",
    token: "https://graph.facebook.com/v24.0/oauth/access_token",
    scopes: ["instagram_basic"]
  },
  TIKTOK: {
    auth: "https://www.tiktok.com/v2/auth/authorize/",
    token: "https://open.tiktokapis.com/v2/oauth/token/",
    scopes: ["user.info.basic"]
  },
  YOUTUBE: {
    auth: "https://accounts.google.com/o/oauth2/v2/auth",
    token: "https://oauth2.googleapis.com/token",
    scopes: ["https://www.googleapis.com/auth/youtube.readonly"]
  },
  X: {
    auth: "https://twitter.com/i/oauth2/authorize",
    token: "https://api.x.com/2/oauth2/token",
    scopes: ["tweet.read", "users.read", "offline.access"]
  }
} as const;

function env(provider: SocialProvider, suffix: "CLIENT_ID" | "CLIENT_SECRET") {
  const value = process.env[`${provider}_${suffix}`];
  if (!value) throw new Error(`${provider}_${suffix} is not configured`);
  return value;
}

function pkce() {
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");
  return { verifier, challenge };
}

export function createSocialProvider(provider: SocialProvider): SocialProviderAdapter {
  const config = configs[provider];

  return {
    provider,
    getAuthorizationUrl(state, redirectUri) {
      const url = new URL(config.auth);
      url.searchParams.set("client_id", env(provider, "CLIENT_ID"));
      url.searchParams.set("redirect_uri", redirectUri);
      url.searchParams.set("response_type", "code");
      url.searchParams.set("scope", config.scopes.join(" "));
      url.searchParams.set("state", state);
      return url.toString();
    },

    async exchangeCode(code, redirectUri, codeVerifier) {
      const body = new URLSearchParams({
        client_id: env(provider, "CLIENT_ID"),
        client_secret: env(provider, "CLIENT_SECRET"),
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code"
      });
      if (codeVerifier) body.set("code_verifier", codeVerifier);

      const response = await fetch(config.token, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store"
      });
      if (!response.ok) throw new Error(`${provider} token exchange failed: ${response.status}`);

      const data = await response.json() as Record<string, unknown>;
      const accessToken = typeof data.access_token === "string" ? data.access_token : "";
      if (!accessToken) throw new Error(`${provider} did not return an access token`);

      const expiresIn = Number(data.expires_in);
      return {
        accessToken,
        refreshToken: typeof data.refresh_token === "string" ? data.refresh_token : undefined,
        expiresAt: Number.isFinite(expiresIn) ? new Date(Date.now() + expiresIn * 1000) : undefined,
        accountId: String(data.user_id ?? data.open_id ?? data.id ?? data.sub ?? "unknown"),
        scopes: Array.isArray(data.scope)
          ? data.scope.map(String)
          : String(data.scope ?? "").split(" ").filter(Boolean)
      };
    },

    async refreshAccessToken(refreshToken) {
      const body = new URLSearchParams({
        client_id: env(provider, "CLIENT_ID"),
        client_secret: env(provider, "CLIENT_SECRET"),
        refresh_token: refreshToken,
        grant_type: "refresh_token"
      });
      const response = await fetch(config.token, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
        cache: "no-store"
      });
      if (!response.ok) throw new Error(`${provider} token refresh failed: ${response.status}`);

      const data = await response.json() as Record<string, unknown>;
      const expiresIn = Number(data.expires_in);
      return {
        accessToken: String(data.access_token),
        refreshToken: typeof data.refresh_token === "string" ? data.refresh_token : undefined,
        expiresAt: Number.isFinite(expiresIn) ? new Date(Date.now() + expiresIn * 1000) : undefined
      };
    }
  };
}

export function getSocialProvider(provider: SocialProvider) {
  return createSocialProvider(provider);
}
