# Contentra Backend Architecture

This folder contains product-domain backend code. API route handlers should stay thin and call these services.

## Domain folders
- `access/` — plans, entitlements, workspace access and feature gates.
- `brand-brain/` — business identity, website intelligence and brand context.
- `content/` — content CRUD, generation orchestration and publishing state.
- `content-dna/` — performance learning and content pattern analysis.
- `ai/` — model abstraction and AI generation orchestration.
- `ugc/` — characters, UGC briefs and video generation.
- `integrations/` — external APIs, OAuth, social accounts and provider adapters.
- `billing/` — subscriptions, plans, checkout/webhook synchronization.
- `analytics/` — metrics ingestion, aggregation and performance signals.
- `campaigns/` — campaign planning and execution.
- `recommendations/` — Next Best Action intelligence.
- `usage/` — quotas, metering and plan limits.
- `security/` — audit logging, rate limiting and security helpers.
- `infrastructure/` — shared server-only primitives such as errors and transactions.

Authentication remains in `src/lib/auth.ts`; Prisma remains in `src/lib/db.ts`. Route handlers under `src/app/api` are the HTTP boundary.
