# Repository guide

This is the practical map of the codebase: where each layer lives and how a request moves through it. The [architecture overview](architecture.md) is the system view; this page is the file-and-folder view.

## At a glance

```text
employment-training/
├── src/                  React browser application
├── server/               Local Express API for AI drafting
├── supabase/             Database schema and local Supabase configuration
├── e2e/                  Playwright browser journeys
├── docs/                 Learning notes, architecture, and starter guidance
├── .github/workflows/    GitHub Actions CI
├── public/               Static public files, including MSW's worker
└── configuration files   Vite, Jest, Playwright, TypeScript, Vercel, ESLint
```

## React browser application: `src/`

### Startup, routing, and shared layout

| Location            | Responsibility                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `src/main.tsx`      | Browser entry point. Creates React's root and wraps the app with `StrictMode`, `BrowserRouter`, and `AuthProvider`. |
| `src/App.tsx`       | Route table. Maps URLs such as `/account` and `/exercises/:exerciseId` to pages.                                    |
| `src/AppLayout.tsx` | Shared header, navigation, and `Outlet` for the current route.                                                      |
| `src/App.css`       | CSS for the app shell and shared layout.                                                                            |
| `src/index.css`     | Global baseline CSS: element defaults, base typography, and page-level rules.                                       |

### Pages: `src/pages/`

Pages are route-level composition files. They decide _which feature or shared component belongs on a URL_; feature logic stays inside the feature when possible.

| Folder                  | URL responsibility                                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `AccountPage/`          | `/account`: sign in, create an account, and account state.                                                                  |
| `ExerciseCatalogPage/`  | `/`: public catalog, personal installed apps, and explore-able apps.                                                        |
| `ExercisePage/`         | `/exercises/:exerciseId`: finds an exercise from the catalog, handles protected access, and renders the exercise component. |
| `LearningCatalogPage/`  | `/learning`: list of available documentation.                                                                               |
| `LearningDocumentPage/` | `/learning/:documentId`: renders a selected Markdown learning document.                                                     |

### Shared components: `src/components/`

These are intentionally reusable across more than one feature or page.

| Folder                 | Component                                                                                    |
| ---------------------- | -------------------------------------------------------------------------------------------- |
| `AuthenticationPanel/` | Shared sign-in/sign-up form used by the account page. Its CSS is beside the component.       |
| `ExerciseCard/`        | Catalog card for an available or coming-soon exercise. Stories and unit tests sit beside it. |
| `MarkdownDocument/`    | Consistent Markdown renderer for the learning-document pages.                                |

### Auth and backend client: `src/auth/` and `src/lib/`

| Location                                 | Responsibility                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `src/auth/AuthProvider.tsx`              | Owns one Supabase session lookup/subscription for the whole browser app.                               |
| `src/auth/authContext.ts`                | Defines the context value consumed by pages and features.                                              |
| `src/lib/supabaseClient.ts`              | Creates the browser-safe Supabase client from `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`. |
| `src/lib/database.types.ts`              | TypeScript shapes that mirror relevant database rows and insert/update payloads.                       |
| `src/lib/appInstallations.repository.ts` | Focused Supabase queries for a user's installed-app preferences.                                       |

### Exercises: `src/exercises/`

Every exercise is self-contained. Its component, CSS, tests, stories, types, and exercise-only child components stay together.

| Folder               | Important files                                                                                                   | What belongs there                                                                             |
| -------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `HelloWorld/`        | `HelloWorld.tsx`, `HelloWorld.css`                                                                                | A compact React/CSS animation exercise.                                                        |
| `CountryExplorer/`   | `CountryExplorer.tsx`, `.types.ts`, `.css`, `components/CountryCard.*`                                            | Fetching country data, UI states, filtering, and expandable country details.                   |
| `JobSearchPipeline/` | `JobSearchPipeline.tsx`, `.types.ts`, `.css`, `.repository.ts`, `.storage.ts`, `ApplicationDraft*`, `components/` | Job application management, AI drafting, local persistence fallback, and Supabase persistence. |
| `exerciseCatalog.ts` | Static metadata: IDs, titles, descriptions, and whether an exercise is public or account-required.                |

Within an exercise, the file endings tell you the role:

| Pattern                     | Meaning                                                                                                      |
| --------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `Component.tsx`             | React UI component.                                                                                          |
| `Component.css`             | CSS scoped to the nearby component through its class names. Comments sit above the declarations they teach.  |
| `*.types.ts`                | TypeScript-only models, unions, and prop shapes for that feature.                                            |
| `*.repository.ts`           | Data-access functions that make Supabase queries; components call these rather than embedding query details. |
| `*.storage.ts`              | Browser `localStorage` reading/writing, isolated from UI.                                                    |
| `*.contract.ts`             | Shared request/response shape used by both the browser and local server.                                     |
| `*.test.tsx` or `*.test.ts` | Jest unit, component, or API tests.                                                                          |
| `*.stories.tsx`             | Storybook examples of meaningful visual and interaction states.                                              |

## Local AI backend: `server/`

Express is **not** inside `src/` because it runs in Node.js, not in the browser.

| File                                 | Responsibility                                                                                                                                              |
| ------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `server/index.ts`                    | Node entry point. Starts Express locally on port `8787`.                                                                                                    |
| `server/applicationDraftApp.ts`      | Defines `POST /api/application-draft`, validates input with Zod, handles errors, and applies explicit company/title hints from the first two labeled lines. |
| `server/applicationDraft.ts`         | Calls the local Ollama API and validates the model's structured result.                                                                                     |
| `server/applicationDraftApp.test.ts` | Supertest coverage for the Express endpoint without starting a real network server.                                                                         |

Local request flow:

```text
JobSearchPipeline UI
  → /api/application-draft
  → Vite development proxy
  → Express on port 8787
  → local Ollama model
  → validated editable draft returned to the UI
```

This server runs with `npm run dev:server`; `npm run dev` starts it together with Vite. Vercel hosts the static frontend but does **not** run this local Express/Ollama flow.

## Database and authentication: `supabase/`

| Location                                             | Responsibility                                                                               |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| `supabase/config.toml`                               | Committed local Supabase configuration.                                                      |
| `supabase/migrations/`                               | Ordered SQL history. These files create tables, grants, and Row Level Security policies.     |
| `20261109000000_create_job_applications.sql`         | `job_applications` table and its first RLS foundation.                                       |
| `20261109000001_add_job_application_user_access.sql` | Adds `user_id`, authenticated-role access, and owner-only policies.                          |
| `20261109000002_create_user_app_installations.sql`   | Per-user app installation preferences and owner-only policies.                               |
| `.env.example`                                       | Names of browser-safe configuration values. Copy it to ignored `.env.local` for real values. |

The local stack is started by `npx supabase start` through OrbStack. The hosted Supabase project receives the same migration history. There is no separate schema to keep in sync by hand.

## Tests and visual review

| Location                                   | Tool                         | Purpose                                                                               |
| ------------------------------------------ | ---------------------------- | ------------------------------------------------------------------------------------- |
| Colocated `*.test.tsx` / `*.test.ts` files | Jest + React Testing Library | Fast component, feature, and API-route behavior checks.                               |
| `e2e/*.spec.ts`                            | Playwright                   | Actual browser journeys such as catalog navigation and job-pipeline behavior.         |
| Colocated `*.stories.tsx` files            | Storybook                    | Isolated visual states, interaction checks, docs, and accessibility checks.           |
| `src/test/`                                | Jest support                 | Browser-like setup and deterministic mocks for styles, Markdown, and similar imports. |
| `public/mockServiceWorker.js`              | MSW                          | Service worker used by API-backed Storybook stories.                                  |

## Tooling, delivery, and configuration

| File/folder                               | Responsibility                                                                       |
| ----------------------------------------- | ------------------------------------------------------------------------------------ |
| `package.json`                            | Dependencies and scripts: development, formatting, tests, Storybook, and builds.     |
| `vite.config.ts`                          | React/Vite setup and the local `/api` proxy to Express.                              |
| `tsconfig.app.json`, `tsconfig.node.json` | TypeScript rules for browser code and Node/configuration code.                       |
| `jest.config.cjs`                         | Jest environment, transformations, mocks, and coverage scope.                        |
| `playwright.config.ts`                    | Browser-test projects, local server lifecycle, and report settings.                  |
| `eslint.config.js`, `.prettierrc.json`    | Lint and formatting rules.                                                           |
| `.github/workflows/quality.yml`           | GitHub Actions: format/lint, build, Jest/Supertest, Playwright, and Storybook build. |
| `vercel.json`                             | Single-page-app rewrite so direct React Router URLs work after deployment.           |

## What is local versus deployed?

| Layer                        | Local development                      | Deployed production                 |
| ---------------------------- | -------------------------------------- | ----------------------------------- |
| React application            | Vite dev server                        | Vercel static hosting               |
| Account and application data | Local or hosted Supabase configuration | Hosted Supabase                     |
| Auth                         | Local or hosted Supabase Auth          | Hosted Supabase Auth                |
| AI drafting                  | Express + Ollama on your machine       | Not deployed yet                    |
| CI quality checks            | Commands can be run manually           | GitHub Actions on GitHub pushes/PRs |
