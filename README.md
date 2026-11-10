# Employment Training

A hands-on React, TypeScript, and frontend-engineering sandbox for rebuilding practical coding fluency and practicing production-oriented patterns.

The app is a catalog of small, self-contained exercises. Each exercise introduces a focused set of concepts while the repository also practices shared tooling, testing, documentation, and accessibility conventions.

## Exercises

- **Hello World** — React component basics, scoped CSS, and animation.
- **Country Explorer** — data fetching, loading/error/empty states, search, filtering, expandable details, responsive cards, and accessible form feedback.
- **Job Search Pipeline** — controlled forms, validation, create/edit/delete workflows, sorting/filtering, local persistence, AI-assisted drafting, Supabase authentication, per-user cloud data, and personal app installation state.
- **GraphQL API Lab** — an authenticated GraphQL query and mutation path, with schema design, resolvers, request context, and Supabase Row Level Security.

The Job Search Pipeline's draft feature uses a small local Express API and Ollama. The browser calls a relative `/api` route through Vite's development proxy; Express validates requests and model output with Zod before returning editable suggestions to the form. The draft flow remains separated behind `generateApplicationDraft()`, so the UI is not coupled to the model provider.

## Tech stack

- Vite, React, and TypeScript
- React Router
- Plain scoped CSS with instructional comments
- ESLint, Prettier, and simple-import-sort
- Jest, React Testing Library, and user-event
- Playwright for end-to-end coverage
- Storybook with Docs and accessibility addons for isolated component and feature development
- Mock Service Worker for deterministic API-backed Storybook states
- GitHub Actions quality checks on pull requests and changes pushed to `main`
- Supabase Auth, Postgres, and Row Level Security for account-scoped data
- Express and Zod for the local AI-draft API
- GraphQL and GraphQL Yoga for a local schema-first API lab
- Ollama structured outputs for local AI experimentation
- Vercel for static production deployment

## Run locally

```bash
npm install
npm run dev
```

`npm run dev` starts Vite and the local Express API together. Open the local URL printed by Vite, normally `http://localhost:5173`.

To use Supabase-backed account data, copy `.env.example` to `.env.local` and supply the project URL and publishable key. Those `VITE_` values are intentionally browser-safe; never put a database password or `service_role` key in that file.

### Local AI draft setup

The Job Search Pipeline draft feature requires [Ollama](https://ollama.com/) and a compatible local model. The current default is `gemma4:e2b`:

```bash
ollama pull gemma4:e2b
ollama serve
```

Start the app in a separate terminal with `npm run dev`. You can override the local model or API URL before starting the server:

```bash
OLLAMA_MODEL=your-model npm run dev:server
OLLAMA_API_URL=http://127.0.0.1:11434/api/chat npm run dev:server
```

## Quality checks

```bash
npm run format
npm run lint
npm run build
npm test
npm run test:coverage
npm run test:e2e
npm run storybook
npm run build-storybook
```

## Component workbench

Run `npm run storybook` to inspect shared components, exercise-specific components, and selected full exercises in isolation. Stories are colocated with the components they document as `ComponentName.stories.tsx`; API-backed states use MSW so success, loading, empty, and error states remain repeatable without calling a real service. `npm run build-storybook` validates that the static Storybook site can be built. Its generated `storybook-static/` folder is intentionally ignored by Git.

## Documentation

Concise learning notes live in [docs/learning](docs/learning/). Start with the [exercise technology map](docs/learning/exercise-technology-map.md) for a summary of what each lab teaches. The [architecture overview](docs/architecture.md) explains how the deployed app, local AI service, Supabase, GitHub Actions, and Vercel fit together, while the [repository guide](docs/repository-guide.md) shows where those files live. Reusable starter-project decisions and future automation ideas live in [docs/project-bootstrap](docs/project-bootstrap/).

## Current boundaries

- Signed-in application data and personal app-installation choices persist in hosted Supabase Postgres. The Job Search Pipeline retains localStorage only as an unauthenticated/local fallback where appropriate.
- The AI draft API and Ollama model run only on the local machine; no job-listing text is sent to a hosted AI provider.
- The static frontend is deployed at [employment-training.vercel.app](https://employment-training.vercel.app/). GitHub pushes to `main` trigger Vercel production deployments.
- The AI draft endpoint and GraphQL server run only in local development today. Hosting either backend boundary remains a future deployment milestone.
