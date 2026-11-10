# Architecture overview

Use the system map above as the visual reference. This page adds the short version: what is deployed, what stays on the development machine, and how the pieces communicate.

## System at a glance

- **Browser application:** React, TypeScript, React Router, native CSS, React Markdown, and a small GraphQL client helper power the catalog, exercises, Learning Center, account pages, and protected routes.
- **Hosted data platform:** Supabase Auth identifies the signed-in user. Supabase Postgres stores their applications and installed-app preferences. Row Level Security (RLS) enforces ownership in the database.
- **Local API and AI experiment:** Express hosts both the REST draft route and a small GraphQL Yoga lab. Vite, Zod, and Ollama support the local job-listing draft flow.
- **Quality and delivery:** GitHub Actions verifies changes; Vercel builds and serves the deployed frontend from `main`.

## Production request flow

1. **Vercel** serves the Vite-built React application.
2. **React Router** selects a view from the URL, including catalog, exercise, learning, and account routes.
3. The browser uses **`@supabase/supabase-js`** to restore the user’s session and make data requests.
4. **Supabase Auth** confirms identity; the Supabase data API reads or changes Postgres rows.
5. **RLS** checks that every application or installed-app row belongs to that signed-in user.

The browser has a public Supabase URL and anonymous key because they are designed for browser use. It never receives a database password, service-role key, or AI-provider credential.

## Local AI draft flow

1. The Job Search Pipeline submits copied listing text to a relative `/api` endpoint.
2. **Vite** proxies that local request to the **Express** server.
3. **Zod** validates the request, then Express asks the local **Ollama** model for structured job details.
4. Zod validates the returned shape before the UI shows editable suggestions.
5. The user reviews the draft before saving it through Supabase.

This is deliberately a local-only service. The deployed Vercel site does not run Express or Ollama, and it does not offer AI drafting yet.

## Local GraphQL lab flow

1. The GraphQL API Lab gets the signed-in user's existing Supabase session token and sends a relative `/api/graphql` request.
2. **Vite** proxies the request to the local **Express + GraphQL Yoga** server during development.
3. The GraphQL resolver reads the bearer token from request context and calls a token-scoped Supabase data source.
4. **Supabase Auth** validates the caller, while **Postgres RLS** limits reads and inserts to that caller's rows.
5. GraphQL returns only the fields selected by the query or mutation.

This is a real authenticated API boundary. The local Express server mounts it at `/api/graphql`; `api/graphql.ts` prepares the same route for Vercel Functions. Its production rollout still requires Vercel environment configuration and a deployed verification pass. The Job Search Pipeline continues using the existing Supabase browser repository.

## Stack by responsibility

### Browser and UI

- **`react` and `react-dom`:** components, rendering, state, and interaction.
- **TypeScript:** data contracts and safer refactoring.
- **`react-router`:** URL-based, refresh-safe navigation and route protection.
- **Native CSS:** scoped component styling, responsive behavior, and visible keyboard focus.
- **`react-markdown`:** renders repository learning notes in the app.
- **GraphQL client helper:** gets the active Supabase token, sends authenticated `/api/graphql` requests, and handles HTTP/GraphQL response errors.

### Data and identity

- **`@supabase/supabase-js`:** browser-safe client for Auth and data access.
- **Supabase Auth, Postgres, and RLS:** sessions, durable personal data, and database-enforced ownership.
- **Supabase CLI, SQL migrations, and OrbStack:** local database development using the same schema history as the hosted project.

### Local API and AI

- **`express`:** local host for the AI-draft REST route and GraphQL endpoint.
- **`zod`:** request and LLM-response validation.
- **`tsx`:** runs the TypeScript Express server in development.
- **Ollama:** local model runtime; no external AI key is required for this learning workflow.
- **`graphql` and `graphql-yoga`:** a schema-first `/graphql` lab with GraphiQL, typed queries/mutations, request context, and token-scoped Supabase reads/inserts.

### Quality and delivery

- **Jest, Testing Library, user-event, and Supertest:** unit, component, interaction, and Express API tests.
- **Playwright:** end-to-end browser workflows.
- **MSW and Storybook:** reproducible service states and isolated component/exercise examples.
- **Prettier, ESLint, and simple-import-sort:** consistent formatting, static analysis, and import organization.
- **GitHub Actions and Vercel:** automated checks and production deployment.

## Related learning material

- [Exercise technology map](/learning/exercise-technology-map)
- [Supabase local development and migrations](/learning/supabase-local-development)
