# Testing and API mocking

> Current foundation: Jest, React Testing Library, user-event, Jest DOM, jsdom, SWC transformation, and Playwright are installed. Jest runs in ESM mode so it can test React Router v8, which is ESM-only. MSW is a planned next-stage tool.

## Current Jest setup

The test runner is Jest. React Testing Library renders components in a browser-like jsdom environment and encourages queries based on user-visible roles, labels, and text.

Install the current test foundation with:

    npm install --save-dev jest jest-environment-jsdom @jest/globals @swc/jest @testing-library/react @testing-library/dom @testing-library/jest-dom @testing-library/user-event

These are development dependencies: CI installs them before it runs tests, but a production deployment does not need to ship test tooling.

    npm test
    npm run test:watch
    npm run test:coverage

`jest.config.cjs` lives at the repository root. The `.cjs` extension makes the configuration explicitly CommonJS, which avoids ambiguity because `package.json` declares the project as an ES module package.

- `testEnvironment: 'jsdom'` provides `document`, buttons, inputs, and other browser-like APIs.
- `@swc/jest` transforms TypeScript and TSX for Jest. It emits ESM and Jest treats `.ts` and `.tsx` files as ESM.
- The `test`, `test:watch`, and `test:coverage` scripts run Jest through Node's `--experimental-vm-modules` flag. Jest's ESM support remains experimental, but this configuration lets Jest load React Router v8's ESM-only dependency graph without mocking the router.
- `src/test/setup.ts` imports `@testing-library/jest-dom/jest-globals`, adding matchers such as `toBeInTheDocument()` to the `expect` imported from `@jest/globals`.
- `src/test/setup.ts` also exposes Node's `TextEncoder` and `TextDecoder` on `globalThis`, because React Router expects those web APIs and jsdom does not provide them in this test environment.
- `moduleNameMapper` replaces CSS, Vite `?raw` Markdown imports, and the ESM-only `react-markdown` package with small test mocks.
- `testMatch: ['<rootDir>/src/**/*.test.{ts,tsx}']` limits Jest to colocated unit and feature tests under `src/`. This prevents Jest from attempting to run Playwright's `e2e/*.spec.ts` browser tests in jsdom.

## Test structure

Place a focused component test beside the component it verifies. The current examples are `ExerciseCard.test.tsx`, `CountryCard.test.tsx`, and `HelloWorld.test.tsx`. Use `App.test.tsx` for app-level navigation behavior that intentionally composes real catalog entries and exercise components.

Country Explorer has a feature-level test file because its behavior spans fetching, form state, filtering, pagination, and child-card state. It replaces `globalThis.fetch` in `beforeEach`, resets the mock between tests, and restores the original fetch implementation in `afterEach`.

    const fetchMock = jest.fn<typeof fetch>()
    const originalFetch = globalThis.fetch

Use `globalThis`, not Node's `global`, because the app TypeScript configuration models browser APIs.

Browser tests use the separate `e2e/` directory and the `.spec.ts` suffix. Keeping the locations and suffixes distinct makes the responsible runner clear:

    src/**/*.test.tsx  -> Jest + React Testing Library
    e2e/**/*.spec.ts   -> Playwright

## Writing tests

Import Jest APIs explicitly because the app TypeScript config intentionally exposes only Vite global types:

    import { describe, expect, test } from '@jest/globals'

Use `userEvent.setup()` to create a realistic interaction session. Its interactions are asynchronous because they model browser behavior such as focus and event sequences:

    const user = userEvent.setup()
    await user.click(screen.getByRole('link', { name: 'Learning docs' }))

Prefer accessible queries such as `getByRole` over CSS selectors or component internals. Repeated visual labels should have meaningful accessible names; the exercise-card open button now includes its exercise title in its `aria-label`.

When testing the router, render `App` inside `MemoryRouter`. Route-changing controls implemented with `Link` have a `link` role, while the existing exercise and learning-card controls remain buttons.

## Current suite and coverage

`src/App.test.tsx` currently covers these user journeys:

- Exercise catalog to learning-material list.
- Learning-material list back to exercise catalog.
- Learning-material list to a document, then back to the list.
- Exercise catalog to Hello, World!, then back to the catalog.
- Unknown and unavailable exercise URLs redirect to the catalog.
- Unknown learning-document URLs redirect to learning materials.

The Country Explorer suite covers successful loading, unsuccessful HTTP responses, non-Error request rejection, form validation, search trimming, region filtering, detail expansion, pagination, and incomplete API data. Its mocked API responses intentionally test the mapper's fallbacks for missing capital, languages, currencies, time zones, and currency symbols.

Coverage is a diagnostic, not the goal. It measures statements, branches, functions, and lines that ran. A module can show line coverage when it is imported even though its component function was never rendered, so read function and branch coverage alongside line coverage.

`collectCoverageFrom` defines coverage as production TypeScript/TSX source. It excludes tests, test setup and mocks, `main.tsx`, and type-only files so test infrastructure does not distort the app coverage result.

    collectCoverageFrom: [
      'src/**/*.{ts,tsx}',
      '!src/**/*.test.{ts,tsx}',
      '!src/test/**',
      '!src/main.tsx',
      '!src/**/*.types.ts',
    ]

Run `npm run test:coverage` after production-code changes to review statement, branch, function, and line coverage together. Do not add a permanent 100% threshold merely because an early learning milestone reached it; choose practical CI thresholds after the application grows.

## Test focus

Prefer tests that cover observable behavior over implementation details:

- Catalog renders available and coming-soon exercises in the intended order.
- Selecting a card renders its exercise; the back control returns to the catalog.
- Hello World renders its title and animated message.
- Country Explorer renders loading, success, error, empty, filtering, details, and load-more states.
- Form validation exposes an accessible error and prevents an empty search.

## Playwright browser tests

Playwright runs essential journeys in a real Chromium browser. Its configuration uses Vite's local server as `baseURL`, starts Vite when needed, and reuses an already-running local server outside CI. Run the suite with:

    npm run test:e2e
    npm run test:e2e:headed
    npm run test:e2e:ui

The initial suite runs Chromium only to keep feedback quick while learning. Firefox and WebKit are installed locally and can be added later as cross-browser projects.

The existing browser tests cover catalog-to-exercise navigation, Country Explorer's search/details, empty-form validation, region filter, and load-more boundary, plus Job Search Pipeline's draft-to-form journey. They use role-based locators and assert actual URLs and visible browser state.

The Job Search Pipeline test demonstrates a useful browser-test shape: follow one complete user journey through a native disclosure, a loading state, an asynchronous result, and its effect on a separate form. Use role- and label-based locators that identify the intended control precisely; a text label can also appear elsewhere in the page, such as in a sort option.

Mock external API requests with `page.route()` before `page.goto()`. The component still calls `fetch`, but Playwright fulfills the matching browser request with stable fixture data:

    component fetch -> Playwright page.route -> mocked response

This keeps the default browser suite fast and deterministic. When the project later has a backend, add a smaller integration suite that uses isolated test data rather than production data.

Playwright reports behavior and browser-test results, not source line/branch coverage by default. Keep Jest as the source-coverage tool. Playwright has lower-level Chromium-only coverage APIs, but mapping bundled browser execution back to TypeScript source requires additional tooling and is not part of this baseline.

## Test wrappers

Providers usually belong in a shared test utility, not production component code. For example, a future `src/test/render.tsx` could wrap components with a router, theme, or other providers required by many tests.

## MSW

Mock Service Worker (MSW) intercepts requests made by the application and responds through handlers. The component still calls `fetch`; MSW supplies controlled responses during tests, Storybook, or local development.

    component fetch -> MSW interceptor -> matching handler -> mock response

Handlers make loading, HTTP-error, network-error, and successful responses deterministic without modifying the component.

## Mock placement

Shared API handlers can live in `src/mocks/handlers/`. Exercise-specific fixtures or handlers can stay colocated, for example `src/exercises/CountryExplorer/mocks/`, when they are meaningful only to that exercise. Keep simple static fixture data close to the test or story that uses it.
