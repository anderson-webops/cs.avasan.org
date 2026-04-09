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

## Local Course Material Paths
- Place local starter/solution packs and source course working folders under `/Users/jacobanderson/Documents/Work/Juni`, not under `/Users/jacobanderson/Work/Juni`.
- Use the top-level course folder layout already present in that directory (for example `Low Level Security`, `Intro to Swift App Development`, `Linux Systems`, and `Web Development Foundations`) unless the user explicitly requests a different local structure.


## Agent Delivery Workflow
- Do not leave completed work uncommitted. After each coherent, validated change set, create a commit and push it in the same session.
- Use multiple commits and pushes when that keeps unrelated changes, partial validations, or follow-up fixes clearly separated. Prefer small, logically grouped commits over one mixed commit.
- Keep both `package-lock.json` and `back-end/package-lock.json` synchronized before every commit or push.
- Use lowercase annotated semver tags only. Do not invent ad-hoc labels such as `V1`, `torca-r07`, `pre-lfs-migration-*`, or similar one-off names.
- This repo follows the stable `v2.x` line. Stay on `v2` for routine work; only cut `v3` for an intentional breaking application or API change.
- Create an annotated tag when a deployable course-catalog, front-end UX, back-end API, health/deploy, performance, or security change is ready to ship.
- Create a GitHub release when that tag represents a real site milestone for users, admins, or operators. Release notes should summarize scope, validation, rollout notes, and any migration or recovery steps.
- If the existing tag or release history contains stale drafts, redundant entries, or ad-hoc labels, clean that history up instead of preserving clutter.
- Skip tags and releases for trivial doc-only edits, formatting-only changes, or routine housekeeping unless they change deployment, operations, or a consumer-facing contract.
