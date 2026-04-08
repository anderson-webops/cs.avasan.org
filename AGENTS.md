# Repository Guidelines

## Project Structure & Module Organization
- `front-end/` hosts the Vite-powered Vue 3 client. Routing views live in `src/pages`, shared UI in `src/components`, state in `src/stores`, and feature logic in `src/modules`. Static assets belong in `public/` and `src/assets/`, while i18n copy sits under `locales/`.
- Front-end unit specs reside in `front-end/test/*.spec.test.ts` (snapshots in `__snapshots__/`). End-to-end workflows live in `front-end/cypress/`.
- `back-end/` contains the Express + Mongoose API. Keep request handling in `src/controllers/`, validation in `src/middleware/`, schemas in `src/models/`, and route wiring under `src/routes/`.
- Monorepo-wide configuration (ESLint, TypeScript base config, workspace scripts) is defined at the repository root; update these when adjusting tooling for either project.

## Build, Test, and Development Commands
- `npm install` (root) installs all workspace dependencies using the pinned `npm@11` toolchain. Avoid mixing package managers.
- `npm run dev` starts the front-end dev server on port 3333; `npm run serve` runs the same build with `--host` enabled for LAN previews.
- `npm run server` launches the API with live reload via `tsx watch -r dotenv/config` on port 3008.
- `npm run build` produces optimized client + server bundles (`front-end/dist/`, `back-end/dist/`).
- `npm run -w front-end test` / `test:unit` run Vitest suites; `npm run -w front-end test:e2e` opens Cypress.
- `npm run lint` (or `lint-fix`) runs the shared ESLint configuration across both workspaces; pre-commit hooks run `lint-staged` automatically.

## Coding Style & Naming Conventions
- ESLint extends `@antfu/eslint-config` and enforces Prettier with tab indentation, double quotes, semicolons, 120-character lines, and LF endings. Run `npm run lint-fix` before pushing.
- Vue single-file components use PascalCase filenames (`TheHeader.vue`), composables use the `useFeature` pattern, and Pinia stores live in `src/stores/`.
- TypeScript modules should export camelCase functions and PascalCase classes/types. Keep front-end route files lowercase to match the generated router.
- Prefer descriptive directory names (`controllers/common/`, `controllers/users/`) and colocate feature-specific assets alongside their modules.

## Testing Guidelines
- Write unit tests with Vitest and follow the `*.spec.test.ts` naming used in `front-end/test/`. Snapshot updates belong in `__snapshots__/` and should be reviewed line-by-line.
- Cypress specs should stub network calls against the Express test server; store fixtures under `front-end/cypress/fixtures/`.
- Back-end tests are not yet wired up—when adding them, place suites under a new `back-end/test/` tree and update `npm run -w back-end test` to execute them (prefer Vitest + Supertest for HTTP coverage).
- Aim to cover new endpoints, Pinia stores, and critical user flows before requesting review; document any intentionally skipped scenarios in the PR.

## Commit & Pull Request Guidelines
- Follow the existing history: present-tense, concise subjects (`Add tutor availability routes`). Keep summaries under 72 characters and expand details in the body when needed.
- Reference GitHub issues with `Fixes #123` or `Refs #123` in the description.
- Before opening a PR, ensure `npm run lint` and relevant tests pass, and include screenshots or screen recordings for UI-facing changes.
- PR descriptions should outline scope, testing evidence, migration steps (if any), and rollout considerations.

## Security & Configuration Tips
- The API expects secrets via environment variables: `SESSION_SECRET`, Mongo credentials (`MONGODB_URI` or Vault via `VAULT_ROLE_ID`/`VAULT_SECRET_ID`), and optional `CROSS_SITE` to adjust cookie policy. Load them through `.env` files excluded from version control.
- `npm run server` already loads `dotenv/config` and will attempt Vault retrieval via `src/vaultClient.ts`; validate both code paths when changing auth or persistence.
- Never commit real credentials or production endpoints. Scrub logs before sharing, and verify rate limiting when exposing new routes under `/admin-mail` or other sensitive prefixes.

## Downstream Sync Workflow
- This repository is a curated downstream of `anderson-webops/classes.jacobdanderson.net`. Treat the downstream tree as authoritative for public student-facing content and design separation.
- Keep `origin` pointed at `instruction-material/classes.jacobdanderson.net` and keep an `upstream` remote pointed at `anderson-webops/classes.jacobdanderson.net` for selective sync work.
- Prefer selective imports of reusable material only: course catalog files under `front-end/src/stores/courses/`, generalized course-library UI, neutral docs, and other content that students or instructors can use directly.
- Do not wholesale merge upstream backend, auth, payment, admin, personal contact, scheduling, or other implementation-specific operational content unless it is intentionally generalized first.
- For a course-content-only sync, use this sequence: `git fetch upstream`, inspect candidate changes, port only the generalized material, validate the downstream site, then commit and push the content change.
- If GitHub fork comparison still shows the downstream branch as behind after a selective sync, record upstream ancestry with `git merge -s ours --no-ff upstream/main -m "Record upstream main as merged"` so the downstream tree stays unchanged while upstream history becomes reachable.
- Use the `-s ours` merge only as bookkeeping after the desired content has already been imported. It is not a substitute for reviewing and selectively syncing the actual material.
