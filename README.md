# Contentra

Contentra is being built as the operating system for creators, businesses and agencies.

## Backend foundation

This repository currently contains a Next.js App Router backend foundation with PostgreSQL + Prisma, cookie-based sessions, multi-workspace roles, Brand Brain, Content DNA, content, Creatos opportunities, campaigns, analytics, social connection records, recommendations, dashboard aggregation, and Gemini-backed AI generation.

## Local setup

1. Create a PostgreSQL database.
2. Copy .env.example to .env.local.
3. Set DATABASE_URL and SESSION_SECRET.
4. Optionally set GEMINI_API_KEY and AI_MODEL.
5. Install dependencies.
6. Run npm run db:generate.
7. Run npm run db:push for local development.
8. Start with npm run dev.

## API contract

Authentication:
- GET /api/health
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/logout
- GET /api/auth/me

Workspaces:
- GET|POST /api/workspaces
- GET /api/workspaces/:workspaceId

Core product:
- GET|PUT /api/workspaces/:workspaceId/brand-brain
- GET|PUT /api/workspaces/:workspaceId/content-dna
- GET|POST /api/workspaces/:workspaceId/content
- GET|PATCH|DELETE /api/workspaces/:workspaceId/content/:contentId
- GET /api/workspaces/:workspaceId/opportunities
- PATCH /api/workspaces/:workspaceId/opportunities/:opportunityId
- GET|POST /api/workspaces/:workspaceId/campaigns
- GET|POST /api/workspaces/:workspaceId/analytics
- GET|POST /api/workspaces/:workspaceId/connections
- GET /api/workspaces/:workspaceId/recommendations
- GET /api/workspaces/:workspaceId/dashboard
- POST /api/workspaces/:workspaceId/ai/generate
- POST /api/workspaces/:workspaceId/ai/next-action

The UI can be built against these contracts without redesigning the database layer.


## Deployment

Production deployment verification marker.
