# Contentra Frontend Architecture

The frontend is organized around the Next.js App Router, with the workspace UI treated as its own application shell.

Structure:
src/app/app - authenticated workspace routes and shared route boundary
src/app/api - backend route handlers
src/components/app - application shell and workspace chrome
src/components/ui - reusable UI primitives
src/lib - shared utilities

The workspace shell provides desktop navigation, responsive mobile navigation, consistent top-level chrome, and route-level loading/error/not-found states.

UI rules:
- One authenticated workspace shell across /app/*
- Desktop navigation is fixed and responsive
- Mobile navigation uses a bottom navigation surface
- Workspace pages are not indexed by search engines
- Shared buttons and cards live in src/components/ui
- Product pages should use consistent spacing, radius, typography, focus and interaction conventions
- Backend entitlements remain authoritative; UI gating is only the UX layer

Production checklist:
1. npm run typecheck
2. npm test
3. npm run build
4. npx prisma validate
5. npm run db:migrate:deploy against the deployment database
6. Verify authenticated route protection
7. Verify plan-gated actions against backend entitlements
8. Replace placeholder page data with real API state
9. Add explicit loading, error and empty states for integrations, billing, uploads and generation
