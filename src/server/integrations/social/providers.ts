export type SocialProvider = "INSTAGRAM" | "TIKTOK" | "YOUTUBE" | "X";

export interface SocialProviderAdapter {
  provider: SocialProvider;
  getAuthorizationUrl(state: string, redirectUri: string): string;
  exchangeCode(code: string, redirectUri: string): Promise<{
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

export function getSocialProvider(provider: SocialProvider): SocialProviderAdapter {
  throw new Error(`Social provider ${provider} is not configured yet.`);
}
