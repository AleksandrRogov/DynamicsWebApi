# AGENTS.md — DynamicsWebApi

## What is DynamicsWebApi?
A TypeScript helper library for Microsoft Dataverse / Dynamics 365 Web API. Supports CRUD operations, Fetch XML, batch requests, Dataverse Search API (query/suggest/autocomplete), entity metadata, file fields, background operations, and actions/functions. Works in both Node.js and browser environments.

## Project
- **Type:** TypeScript library (`dynamics-web-api` v2.x) targeting Node.js and Browser
- **Entry:** `src/dynamics-web-api.ts` — exports `DynamicsWebApi` class with all types
- **Build output:** `dist/` (CJS, ESM, browser bundles + `.d.ts`), `lib/` (transpiled source for tests)

## Commands
| Script | What |
|---|---|
| `npm test` | Build (`tsc`) → run Mocha tests. **This is the full verification.** |
| `npm run tsc` | Typecheck only (`tsc --noEmit`) |
| `npm run build` | Clean → transpile lib → bundle dist (CJS/ESM/browser) → generate types → copy `.d.ts` → add banner |
| `npm run coverage` | Clean coverage dir → build → run `nyc mocha` → LCOV report |
| `npm run format` | Prettier: `src/**/*.ts` + `tests/**/*.js` |

## Test setup
- Tests live in `tests/` as `.spec.ts` files, run via Mocha + `ts-node/register`
- **Every test file sets `global.DWA_BROWSER = false`** before running — this controls the runtime branch between XHR (browser) and Node `http` client
- HTTP mocking: **nock** for Dataverse API endpoints
- Fixtures in `tests/stubs.ts` — includes entity data, mock responses, URLs for all API versions (v8.0–v9.2 + search v1.0/v2.0)
- Tests run in `lib/` (transpiled from `src/`), not raw `.ts`

## Architecture
- `DynamicsWebApi` class wraps an internal `DataverseClient` (private field)
- `DataverseClient` holds config + `isBatch` state and delegates to `makeRequest` in `src/client/RequestClient.ts`
- Request execution splits on `global.DWA_BROWSER`:
  - **Browser:** `src/client/xhr.ts` (XMLHttpRequest)
  - **Node:** `src/client/http.ts` (Node `http`/`https` agents, proxy support)
- `src/requests/` — one file per API operation (create, retrieve, update, delete, batch, search, metadata, etc.)
- `src/requests/index.ts` — barrel re-exports everything consumed by the main class
- Build: `tsc` compiles `src/` → `lib/`; `esbuild` bundles `src/dynamics-web-api.ts` → `dist/` (multiple platforms)
- `global.DWA_BROWSER` is defined at build time by `utils/bundle.mjs` via esbuild `define`

## CI (GitHub Actions)
- `build-test-coverage.yml` — main CI: runs on `dev` push/PR. Tests across Node 18/20/22/24, coverage + Coveralls on Node 22 only
- `branch-build-test-coverage.yaml` — branch CI: runs on `feature/**`, `bugfix/**`, `hotfix/**` push/PR. Same matrix, coverage on Node 22 only

## Style conventions
- Prettier: 4-space indent (from `.prettierrc` / default)
- Tests: `.spec.ts` in `tests/`, `tests/requests/` subfolder mirrors `src/requests/` structure
- No lint step — only `tsc` typecheck + `prettier --write`
- `preversion` runs `npm test`; `version` runs `npm run build`

## Docs reference
- Full API reference and usage examples: `.github/README.md` (the root `README.md` is a minimal redirect)

## Gotchas
- **Never remove `global.DWA_BROWSER = false`** from test files — the library branches on this at runtime
- `src/types.ts` is not included in the build output — all exported types live in `src/dynamics-web-api.ts`
- `lib/` exists only for tests (Mocha reads from there, not from `src/` or `dist/`)
- Build order matters: `clean → build:* → postbuild (copyfiles + banner)`. Don't reorder
- Tests that call `executeBatch()` expect `startBatch()` to have been called first (stateful client)
