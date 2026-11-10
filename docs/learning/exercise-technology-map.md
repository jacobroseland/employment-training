# Exercise technology map

This is the quick answer to: “What did this exercise teach me?” Each lab builds on the shared repository foundations without trying to make every exercise cover every technology.

| Exercise                               | Main concepts practiced                                                                                                                                                                                    | Supporting engineering habits                                                                                                                                      |
| -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Hello World**                        | JSX and component structure, scoped CSS, custom properties, CSS keyframes, animation timing, and responsive sizing                                                                                         | A small component test and an isolated Storybook story                                                                                                             |
| **Country Explorer**                   | `useState`, `useEffect`, async `fetch`, API response mapping, loading/error/empty/success UI states, search, region filtering, incremental “Load more,” expandable details, and semantic description lists | TypeScript data models, accessible form feedback, component extraction with `CountryCard`, Jest/React Testing Library, Playwright, and MSW-backed Storybook states |
| **Job Search Pipeline**                | Controlled forms, validation, create/edit/delete workflows, derived filtering and sorting, local draft state, `localStorage`, confirmation feedback, and scrolling/focus-oriented editing UX               | Feature-local components and utilities, Jest/RTL, Playwright, Storybook feature stories, and reusable form patterns                                                |
| **Job Search Pipeline: AI draft flow** | Express API design, request and response validation with Zod, async request states, provider isolation, Ollama structured outputs, and editable AI suggestions                                             | Supertest API-route coverage and a deliberate local-only boundary for job-listing text                                                                             |
| **Job Search Pipeline: personal data** | Supabase Auth, Postgres persistence, per-user Row Level Security, repository functions, React context, protected routes, return-to navigation, and user-installed app preferences                          | SQL migrations, local Supabase development through OrbStack, hosted environment configuration, and keeping browser-safe keys separate from server secrets          |

## Foundations shared across the catalog

- **React Router:** route layouts, catalog/detail pages, params, protected routes, and refresh-safe URLs.
- **Quality:** Prettier, ESLint, simple-import-sort, Jest, React Testing Library, user-event, Playwright, Supertest, and MSW.
- **Component workbench:** Storybook Docs, accessibility checks, component states, and selected full-exercise stories.
- **Delivery:** GitHub Actions checks on changes and Vercel production deployments from `main`.
- **Documentation:** concise learning notes, a reusable project-bootstrap guide, and the architecture overview.

## Not implemented yet

- A **hosted AI endpoint**. The Ollama draft service intentionally runs only on the local machine today; the deployed Vercel frontend does not expose that API.
- **GraphQL.** Supabase currently uses its browser client and generated data API. A future GraphQL layer should have a concrete need—such as combining multiple backend services, enforcing workflow-specific API contracts, or reducing complex frontend orchestration—rather than being added only as a technology exercise.
