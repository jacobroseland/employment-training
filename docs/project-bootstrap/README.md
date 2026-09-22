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
- React Router with a shared app layout, nested routes, and URL parameters
- `format`, `format:check`, `lint`, `build`, `test`, `test:watch`, and `test:coverage` scripts
- A root `jest.config.cjs` with jsdom, SWC TypeScript/TSX transformation, deterministic asset/Markdown mocks, and an explicit production-coverage scope
- A minimal app shell, one example shared component, and one example test
- A source structure that favors colocation before abstraction

## Test foundation recipe

The reusable test baseline installs Jest, its jsdom environment, SWC transformation, and the Testing Library packages:

    npm install --save-dev jest jest-environment-jsdom @jest/globals @swc/jest @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event

Configure `jest.config.cjs` because the starter uses an ES module package. When the starter includes ESM-only dependencies such as React Router v8, configure SWC to emit ESM, treat TypeScript files as ESM, and run Jest through Node's `--experimental-vm-modules` flag. Include a shared Jest DOM setup file, browser-API polyfills required by dependencies, mocks for non-JavaScript assets, and `collectCoverageFrom` exclusions for tests, mocks, entry points, and type-only files. Seed the project with one component test and one app-level behavior test.

## Candidate layers

1. **Scaffold:** create the Vite project and apply baseline configuration.
2. **Quality:** formatting, linting, type-checking, tests, and CI.
3. **UI development:** Storybook.
4. **API development:** MSW, environment variables, and a backend/client choice.
5. **Deployment:** a hosting configuration and a preview/production workflow.

## Proposed rollout

Build and validate one layer at a time:

1. **Complete:** establish Jest, React Testing Library, component and feature tests, intentional production coverage scope, and a 100%-coverage learning milestone.
2. **Complete:** add React Router, a shared app layout, nested catalog and learning routes, URL parameters, and corrective redirects.
3. Add Playwright end-to-end tests for essential user journeys.
4. Run a focused Figma MCP design-to-code experiment.
5. Add Storybook and MSW-backed stories.
6. Add a GitHub Actions quality workflow that runs formatting, linting, builds, unit tests, and Playwright tests.
7. Choose a deployment host.
8. Add a small backend experiment, such as Node/Express or a managed Postgres service such as Supabase; introduce GraphQL only when the exercise benefits from it.

Set practical CI coverage thresholds only after the project has more than the initial learning exercises. The current 100% result is a useful baseline and teaching tool, not a mandate that every future project must enforce 100%.

## Browser and integration testing

Playwright belongs in the browser-testing layer after routing; it does not require a database. Start with end-to-end tests for catalog navigation, exercise navigation, Country Explorer search/filtering, details toggles, validation, and loading more results.

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
