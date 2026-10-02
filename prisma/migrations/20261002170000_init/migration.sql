-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('OWNER','ADMIN','MEMBER','VIEWER');
CREATE TYPE "ContentType" AS ENUM ('POST','VIDEO','SCRIPT','CAPTION','HOOK','IDEA','IMAGE','UGC');
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT','SCHEDULED','PUBLISHED','ARCHIVED');
CREATE TYPE "OpportunityStatus" AS ENUM ('NEW','SAVED','DISMISSED','ACTIONED');
CREATE TYPE "Platform" AS ENUM ('INSTAGRAM','TIKTOK','YOUTUBE','X','LINKEDIN','OTHER');
CREATE TYPE "ConnectionStatus" AS ENUM ('ACTIVE','EXPIRED','REVOKED','ERROR');
CREATE TYPE "Plan" AS ENUM ('FREE','PRO','BUSINESS','AGENCY');
CREATE TYPE "SubscriptionStatus" AS ENUM ('TRIALING','ACTIVE','PAST_DUE','CANCELED','EXPIRED');
CREATE TYPE "BillingProvider" AS ENUM ('PADDLE','STRIPE','MANUAL');
CREATE TYPE "GenerationStatus" AS ENUM ('QUEUED','PROCESSING','COMPLETED','FAILED');
CREATE TYPE "BackgroundJobStatus" AS ENUM ('QUEUED','PROCESSING','COMPLETED','FAILED');
CREATE TYPE "WebhookStatus" AS ENUM ('RECEIVED','PROCESSED','FAILED');

CREATE TABLE "User" (
  "id" TEXT NOT NULL,"email" TEXT NOT NULL,"passwordHash" TEXT NOT NULL,"name" TEXT,"image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Session" (
  "id" TEXT NOT NULL,"tokenHash" TEXT NOT NULL,"userId" TEXT NOT NULL,"expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Workspace" (
  "id" TEXT NOT NULL,"name" TEXT NOT NULL,"slug" TEXT NOT NULL,"plan" "Plan" NOT NULL DEFAULT 'FREE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "UGCCharacter" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"name" TEXT NOT NULL,"description" TEXT,"visualPrompt" TEXT,
  "imageUrl" TEXT,"metadata" JSONB,"active" BOOLEAN NOT NULL DEFAULT true,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "UGCCharacter_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "GenerationJob" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"createdById" TEXT NOT NULL,"characterId" TEXT,"contentId" TEXT,
  "kind" TEXT NOT NULL,"status" "GenerationStatus" NOT NULL DEFAULT 'QUEUED',"provider" TEXT NOT NULL,"model" TEXT NOT NULL,
  "prompt" TEXT NOT NULL,"operationName" TEXT,"outputUrl" TEXT,"outputMimeType" TEXT,"error" TEXT,"metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "GenerationJob_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "BackgroundJob" (
  "id" TEXT NOT NULL,"workspaceId" TEXT,"kind" TEXT NOT NULL,"payload" JSONB NOT NULL,
  "status" "BackgroundJobStatus" NOT NULL DEFAULT 'QUEUED',"attempts" INTEGER NOT NULL DEFAULT 0,"runAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "lockedAt" TIMESTAMP(3),"lastError" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "BackgroundJob_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "IdempotencyKey" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"userId" TEXT NOT NULL,"key" TEXT NOT NULL,"requestHash" TEXT NOT NULL,
  "status" INTEGER NOT NULL DEFAULT 202,"response" JSONB,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"expiresAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "IdempotencyKey_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "WebhookEvent" (
  "id" TEXT NOT NULL,"provider" "BillingProvider" NOT NULL,"providerEventId" TEXT NOT NULL,"eventType" TEXT NOT NULL,
  "workspaceId" TEXT,"status" "WebhookStatus" NOT NULL DEFAULT 'RECEIVED',"payload" JSONB NOT NULL,"error" TEXT,
  "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"processedAt" TIMESTAMP(3),
  CONSTRAINT "WebhookEvent_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Subscription" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"plan" "Plan" NOT NULL DEFAULT 'FREE',"status" "SubscriptionStatus" NOT NULL DEFAULT 'TRIALING',
  "provider" "BillingProvider" NOT NULL DEFAULT 'MANUAL',"customerId" TEXT,"providerSubscriptionId" TEXT,
  "currentPeriodStart" TIMESTAMP(3),"currentPeriodEnd" TIMESTAMP(3),"cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "UsageCounter" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"metric" TEXT NOT NULL,"periodStart" TIMESTAMP(3) NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "UsageCounter_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "RateLimitBucket" (
  "id" TEXT NOT NULL,"key" TEXT NOT NULL,"windowStart" TIMESTAMP(3) NOT NULL,"count" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "RateLimitBucket_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AuditLog" (
  "id" TEXT NOT NULL,"workspaceId" TEXT,"userId" TEXT,"action" TEXT NOT NULL,"resource" TEXT,"resourceId" TEXT,"metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Membership" (
  "id" TEXT NOT NULL,"userId" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"role" "MembershipRole" NOT NULL DEFAULT 'MEMBER',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "BrandBrain" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"businessName" TEXT,"niche" TEXT,"audience" TEXT,"positioning" TEXT,"voice" TEXT,
  "goals" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],"offers" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],"competitors" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "contentPillars" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],"websiteUrl" TEXT,"context" JSONB,"completeness" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "BrandBrain_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ContentDNA" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"winningFormats" JSONB,"winningTopics" JSONB,"winningHooks" JSONB,
  "winningStructures" JSONB,"audienceSignals" JSONB,"platformPatterns" JSONB,"learnings" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,"analyzedItems" INTEGER NOT NULL DEFAULT 0,"updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ContentDNA_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "ContentItem" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"createdById" TEXT NOT NULL,"title" TEXT NOT NULL,"type" "ContentType" NOT NULL,
  "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',"platform" "Platform","body" TEXT,"hook" TEXT,"caption" TEXT,"mediaUrl" TEXT,
  "metadata" JSONB,"scheduledAt" TIMESTAMP(3),"publishedAt" TIMESTAMP(3),"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "ContentItem_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Opportunity" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"title" TEXT NOT NULL,"description" TEXT,"source" TEXT,"platform" "Platform",
  "score" DOUBLE PRECISION NOT NULL DEFAULT 0,"status" "OpportunityStatus" NOT NULL DEFAULT 'NEW',"trendData" JSONB,
  "suggestedHook" TEXT,"suggestedAngle" TEXT,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Opportunity_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Campaign" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"name" TEXT NOT NULL,"description" TEXT,"goal" TEXT,"status" TEXT NOT NULL DEFAULT 'DRAFT',
  "startsAt" TIMESTAMP(3),"endsAt" TIMESTAMP(3),"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "SocialConnection" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"platform" "Platform" NOT NULL,"accountId" TEXT NOT NULL,"username" TEXT,
  "accessToken" TEXT,"refreshToken" TEXT,"expiresAt" TIMESTAMP(3),"scopes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "status" "ConnectionStatus" NOT NULL DEFAULT 'ACTIVE',"metadata" JSONB,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "SocialConnection_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "AnalyticsSnapshot" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"contentId" TEXT,"userId" TEXT,"platform" "Platform" NOT NULL,"date" TIMESTAMP(3) NOT NULL,
  "views" INTEGER NOT NULL DEFAULT 0,"likes" INTEGER NOT NULL DEFAULT 0,"comments" INTEGER NOT NULL DEFAULT 0,"shares" INTEGER NOT NULL DEFAULT 0,
  "saves" INTEGER NOT NULL DEFAULT 0,"followers" INTEGER NOT NULL DEFAULT 0,"reach" INTEGER NOT NULL DEFAULT 0,"engagementRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "metadata" JSONB,"createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,CONSTRAINT "AnalyticsSnapshot_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "Recommendation" (
  "id" TEXT NOT NULL,"workspaceId" TEXT NOT NULL,"title" TEXT NOT NULL,"description" TEXT NOT NULL,"actionType" TEXT NOT NULL,
  "priority" INTEGER NOT NULL DEFAULT 0,"confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,"status" TEXT NOT NULL DEFAULT 'OPEN',"metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,"updatedAt" TIMESTAMP(3) NOT NULL,CONSTRAINT "Recommendation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE UNIQUE INDEX "Workspace_slug_key" ON "Workspace"("slug");
CREATE UNIQUE INDEX "IdempotencyKey_workspaceId_key_key" ON "IdempotencyKey"("workspaceId","key");
CREATE UNIQUE INDEX "WebhookEvent_providerEventId_key" ON "WebhookEvent"("providerEventId");
CREATE UNIQUE INDEX "Subscription_workspaceId_key" ON "Subscription"("workspaceId");
CREATE UNIQUE INDEX "Subscription_providerSubscriptionId_key" ON "Subscription"("providerSubscriptionId");
CREATE UNIQUE INDEX "UsageCounter_workspaceId_metric_periodStart_key" ON "UsageCounter"("workspaceId","metric","periodStart");
CREATE UNIQUE INDEX "RateLimitBucket_key_windowStart_key" ON "RateLimitBucket"("key","windowStart");
CREATE UNIQUE INDEX "Membership_userId_workspaceId_key" ON "Membership"("userId","workspaceId");
CREATE UNIQUE INDEX "BrandBrain_workspaceId_key" ON "BrandBrain"("workspaceId");
CREATE UNIQUE INDEX "ContentDNA_workspaceId_key" ON "ContentDNA"("workspaceId");
CREATE UNIQUE INDEX "SocialConnection_workspaceId_platform_accountId_key" ON "SocialConnection"("workspaceId","platform","accountId");

CREATE INDEX "Session_userId_idx" ON "Session"("userId");
CREATE INDEX "Session_expiresAt_idx" ON "Session"("expiresAt");
CREATE INDEX "UGCCharacter_workspaceId_active_idx" ON "UGCCharacter"("workspaceId","active");
CREATE INDEX "GenerationJob_workspaceId_status_createdAt_idx" ON "GenerationJob"("workspaceId","status","createdAt");
CREATE INDEX "GenerationJob_createdById_createdAt_idx" ON "GenerationJob"("createdById","createdAt");
CREATE INDEX "BackgroundJob_status_runAt_idx" ON "BackgroundJob"("status","runAt");
CREATE INDEX "BackgroundJob_workspaceId_status_idx" ON "BackgroundJob"("workspaceId","status");
CREATE INDEX "IdempotencyKey_expiresAt_idx" ON "IdempotencyKey"("expiresAt");
CREATE INDEX "WebhookEvent_provider_eventType_receivedAt_idx" ON "WebhookEvent"("provider","eventType","receivedAt");
CREATE INDEX "WebhookEvent_workspaceId_receivedAt_idx" ON "WebhookEvent"("workspaceId","receivedAt");
CREATE INDEX "Subscription_provider_customerId_idx" ON "Subscription"("provider","customerId");
CREATE INDEX "Subscription_status_currentPeriodEnd_idx" ON "Subscription"("status","currentPeriodEnd");
CREATE INDEX "UsageCounter_workspaceId_periodStart_idx" ON "UsageCounter"("workspaceId","periodStart");
CREATE INDEX "RateLimitBucket_windowStart_idx" ON "RateLimitBucket"("windowStart");
CREATE INDEX "AuditLog_workspaceId_createdAt_idx" ON "AuditLog"("workspaceId","createdAt");
CREATE INDEX "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId","createdAt");
CREATE INDEX "AuditLog_action_createdAt_idx" ON "AuditLog"("action","createdAt");
CREATE INDEX "Membership_workspaceId_idx" ON "Membership"("workspaceId");
CREATE INDEX "ContentItem_workspaceId_status_idx" ON "ContentItem"("workspaceId","status");
CREATE INDEX "ContentItem_workspaceId_createdAt_idx" ON "ContentItem"("workspaceId","createdAt");
CREATE INDEX "Opportunity_workspaceId_status_idx" ON "Opportunity"("workspaceId","status");
CREATE INDEX "Campaign_workspaceId_createdAt_idx" ON "Campaign"("workspaceId","createdAt");
CREATE INDEX "SocialConnection_workspaceId_platform_idx" ON "SocialConnection"("workspaceId","platform");
CREATE INDEX "AnalyticsSnapshot_workspaceId_platform_date_idx" ON "AnalyticsSnapshot"("workspaceId","platform","date");
CREATE INDEX "AnalyticsSnapshot_workspaceId_date_idx" ON "AnalyticsSnapshot"("workspaceId","date");
CREATE INDEX "AnalyticsSnapshot_contentId_date_idx" ON "AnalyticsSnapshot"("contentId","date");
CREATE INDEX "Recommendation_workspaceId_status_priority_idx" ON "Recommendation"("workspaceId","status","priority");

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UGCCharacter" ADD CONSTRAINT "UGCCharacter_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "UGCCharacter"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "GenerationJob" ADD CONSTRAINT "GenerationJob_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ContentItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "BackgroundJob" ADD CONSTRAINT "BackgroundJob_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IdempotencyKey" ADD CONSTRAINT "IdempotencyKey_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IdempotencyKey" ADD CONSTRAINT "IdempotencyKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "WebhookEvent" ADD CONSTRAINT "WebhookEvent_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "UsageCounter" ADD CONSTRAINT "UsageCounter_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "BrandBrain" ADD CONSTRAINT "BrandBrain_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentDNA" ADD CONSTRAINT "ContentDNA_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ContentItem" ADD CONSTRAINT "ContentItem_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Opportunity" ADD CONSTRAINT "Opportunity_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Campaign" ADD CONSTRAINT "Campaign_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SocialConnection" ADD CONSTRAINT "SocialConnection_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnalyticsSnapshot" ADD CONSTRAINT "AnalyticsSnapshot_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnalyticsSnapshot" ADD CONSTRAINT "AnalyticsSnapshot_contentId_fkey" FOREIGN KEY ("contentId") REFERENCES "ContentItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "AnalyticsSnapshot" ADD CONSTRAINT "AnalyticsSnapshot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Recommendation" ADD CONSTRAINT "Recommendation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
