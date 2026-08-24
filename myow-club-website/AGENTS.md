# AGENTS.md

Instructions for AI coding agents working in this repository.

## Scope
- Keep changes focused and minimal.
- Preserve existing UI patterns and route behavior unless the task explicitly asks for redesign/refactor.
- Prefer updating existing files in `src/pages`, `src/components`, and `src/utils` over adding new abstractions.

## Fast Start
- Install: `npm install`
- Dev server: `npm run dev`
- Lint: `npm run lint`
- Build: `npm run build`
- Preview build: `npm run preview`
- There is currently no test script configured.

## Architecture Snapshot
- Entry: `index.html` -> `src/main.tsx` -> `src/App.tsx`
- Routing is centralized in `src/App.tsx` using `react-router-dom`.
- Route pages live in `src/pages`.
- Shared UI and guards live in `src/components`.
- Local data helpers and utilities live in `src/utils`.

## Project-Specific Conventions
- `src/main.tsx` must import `./i18n` before rendering app.
- i18n resources are JSON files in `src/locales`.
- `/admin` is protected by `src/components/ProtectedRoute.tsx` and localStorage auth keys.
- Header and footer are intentionally hidden on `/admin` and `/login` via route entries in `src/App.tsx`.
- Data can run in mock mode (localStorage-backed) or Firebase mode. See `src/firebase.ts` and `src/utils/mockDb.ts`.

## Common Pitfalls
- Firebase config in `src/firebase.ts` uses placeholders by default; do not assume production credentials exist.
- Admin allowlist is hardcoded in `src/components/ProtectedRoute.tsx`; avoid silent behavior changes.
- Google Calendar embed URL is managed in home page markup; update intentionally.
- TypeScript is strict; avoid leaving unused vars/params.

## Preferred Workflow For Agents
1. Read `package.json` scripts and `src/App.tsx` before editing.
2. If touching auth/admin behavior, inspect `src/components/ProtectedRoute.tsx` and `src/pages/Login.tsx` together.
3. If touching event/announcement data, inspect both `src/firebase.ts` and `src/utils/mockDb.ts`.
4. Run `npm run lint` after code changes.
5. Run `npm run build` for changes that may affect typing or bundling.

## Reference Docs (Link, Do Not Duplicate)
- Project setup: [README Getting Started](README.md#getting-started)
- Feature overview: [README Features](README.md#features)
- Firebase setup details: [README Firebase Setup](README.md#firebase-setup-optional-for-backend)
- Calendar customization: [README Google Calendar](README.md#google-calendar)
- Deployment: [README Deployment](README.md#deployment)
