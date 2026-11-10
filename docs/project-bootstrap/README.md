# Project bootstrap

## Goal

As this sandbox matures, capture repeatable decisions in a small project bootstrap: a reliable starter kit for new frontend projects without repeating setup research. It should provide the architecture, quality tooling, and a minimal working example needed to begin a new product—not recreate this training sandbox.

## Scope

The bootstrap should include:

- A Vite + React + TypeScript application foundation.
- A minimal app shell and base styling conventions.
- A source structure that favors colocation before abstraction.
- One simple shared component and one example test that demonstrate the project conventions.
- Formatting, linting, building, testing, documentation, and environment-variable foundations.
- Optional add-on layers for routing, Storybook, mocking, browser testing, CI, deployment, and backend experiments.

The bootstrap should exclude sandbox-specific material: the exercise catalog, Hello World, Country Explorer, personal learning notes, API data, and the sandbox's visual theme.

## Current baseline

- Vite + React + TypeScript
- Prettier for formatting
- ESLint with simple-import-sort
- Jest, React Testing Library, user-event, and Jest DOM
- Playwright with a Vite `webServer`, Chromium project, HTML reports, and deterministic browser-request interception
- Storybook with Docs and accessibility addons, colocated component stories, and an ignored static-build output
- MSW with a generated public service worker and deterministic Storybook API states
- GitHub Actions quality workflow that uses Node 24 and runs formatting/linting, builds, Jest API/unit tests, Chromium Playwright tests, and the Storybook build
- React Router with a shared app layout, nested routes, and URL parameters
- `format`, `format:check`, `lint`, `build`, `test`, `test:watch`, `test:coverage`, `test:e2e`, `test:e2e:headed`, `test:e2e:ui`, `storybook`, and `build-storybook` scripts
- A root `jest.config.cjs` with jsdom, SWC TypeScript/TSX transformation, deterministic asset/Markdown mocks, and an explicit production-coverage scope
- Clear test-runner boundaries: colocated Jest tests under `src/**/*.test.tsx` and Playwright browser tests under `e2e/**/*.spec.ts`
- A minimal app shell, one example shared component, and one example test
- A source structure that favors colocation before abstraction
- An optional local backend pattern: Express, Zod runtime contracts, a Vite `/api` proxy, and concurrent client/server development scripts
- A Supabase foundation: project-scoped CLI, committed configuration and migrations, a Docker-compatible runtime such as OrbStack, a browser-safe environment template, and per-user RLS conventions
- An optional auth boundary: one application-level session provider, a reusable sign-in component, protected routes, and feature pages that remain focused on their own data
- Optional user-preference tables, such as per-user installed-app records, that remain separate from static application metadata and authorization policies

## Test foundation recipe

The reusable test baseline installs Jest, its jsdom environment, SWC transformation, and the Testing Library packages:

    npm install --save-dev jest jest-environment-jsdom @jest/globals @swc/jest @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event

Configure `jest.config.cjs` because the starter uses an ES module package. When the starter includes ESM-only dependencies such as React Router v8, configure SWC to emit ESM, treat TypeScript files as ESM, and run Jest through Node's `--experimental-vm-modules` flag. Include a shared Jest DOM setup file, browser-API polyfills required by dependencies, mocks for non-JavaScript assets, and `collectCoverageFrom` exclusions for tests, mocks, entry points, and type-only files. Seed the project with one component test and one app-level behavior test.

## Candidate layers

1. **Scaffold:** create the Vite project and apply baseline configuration.
2. **Quality:** formatting, linting, type-checking, tests, and CI.
3. **UI development:** Storybook and MSW-backed API states.
4. **API development:** environment variables and a backend/client choice.
5. **Deployment:** a hosting configuration and a preview/production workflow.

## Proposed rollout

Build and validate one layer at a time:

1. **Complete:** establish Jest, React Testing Library, component and feature tests, intentional production coverage scope, and a 100%-coverage learning milestone.
2. **Complete:** add React Router, a shared app layout, nested catalog and learning routes, URL parameters, and corrective redirects.
3. **Complete:** add Playwright end-to-end tests for catalog navigation and key Country Explorer behaviors, including deterministic API interception.
4. Run a focused Figma MCP design-to-code experiment.
5. **Complete:** add Storybook with Docs and accessibility addons, a root configuration directory, colocated component stories, and full-exercise stories where useful.
6. **Complete:** add MSW-backed stories for API loading, success, and error states.
7. **Complete:** add a GitHub Actions quality workflow that runs formatting/linting, builds, Jest API/unit tests, Chromium Playwright tests, and the Storybook build on pull requests and changes pushed to `main`.
8. **Complete:** deploy the Vite single-page app to Vercel through its GitHub integration. Commit a root `vercel.json` catch-all rewrite to `index.html` so direct React Router URLs work in production. Vercel auto-detects Vite and uses its `npm run build` / `dist` defaults.
9. **Complete (local-only):** add a small Node/Express backend experiment for the Ollama-powered application draft endpoint.
10. **In progress:** add persistent data with a local Supabase/Postgres stack. Keep schema migrations in version control, apply them locally first, and enable Row Level Security before browser access.
11. **In progress:** create a hosted Supabase project, apply the same migrations, and add per-user table ownership through `auth.users`, explicit `authenticated` role grants, and RLS policies. Configure local and deployment environment variables before connecting the browser client. Keep auth session ownership in the app shell and route guards rather than feature components. Introduce GraphQL only when the exercise benefits from it.

## Deployment foundation

For a Vite React single-page app, use Vercel's Git integration and keep deployment settings close to their framework defaults. A static host does not run Vite's development proxy or a local Ollama process, so local-only AI controls need an explicit hosted-demo boundary until a hosted backend and model provider are added. Set up the Vercel GitHub App with access only to the repository being deployed. This produces production deployments from `main` and preview deployments from future pull requests.

Set practical CI coverage thresholds only after the project has more than the initial learning exercises. The current 100% result is a useful baseline and teaching tool, not a mandate that every future project must enforce 100%.

## Browser and integration testing

Playwright belongs in the browser-testing layer after routing; it does not require a database. Use a Vite `webServer` and `baseURL` so local and CI runs are self-contained. Start with Chromium and a focused set of observable journeys: catalog navigation plus Country Explorer search/filtering, details toggles, validation, and loading more results. Keep source line and branch coverage in Jest rather than adding bundled-browser coverage to the initial baseline.

The default CI suite should mock external API traffic so it is fast and deterministic. Once a backend exists, add a smaller integration suite that uses isolated, controlled test data in a dedicated test database. Never run integration tests against production data.

## Figma MCP experiment

Use one small exercise to practice design handoff: create a Figma frame, define a few variables and reusable components, then use Figma MCP to provide the selected frame's context for an implementation review. The goal is to learn component boundaries, responsive layout, design tokens, and accessibility from a design source—not to blindly generate the finished UI.

Figma's remote MCP server is currently available on the free Starter plan, with a limit of six tool calls per month. Treat that as a small proof-of-concept budget: a single chat request may use more than one tool call when it needs to read a frame, variables, components, or assets. Code Connect, the durable mapping between Figma components and repository components, is a later paid-plan topic.

## Eventual artifacts

Potential future project-bootstrap artifacts include:

    scripts/bootstrap-project.mjs
    .github/workflows/quality.yml
    .env.example
    docs/project-bootstrap/checklist.md

The bootstrap should automate local files and repeatable configuration. Account creation, billing choices, production databases, deployment permissions, and secrets should remain explicit manual steps. A generated project should always be tested with `format:check`, tests, and `build` before it is treated as a reusable baseline.
