# Employment Training

A hands-on React, TypeScript, and frontend-engineering sandbox for rebuilding practical coding fluency and practicing production-oriented patterns.

The app is a catalog of small, self-contained exercises. Each exercise introduces a focused set of concepts while the repository also practices shared tooling, testing, documentation, and accessibility conventions.

## Exercises

- **Hello World** — React component basics and CSS animation.
- **Country Explorer** — data fetching, loading/error/empty states, search, filtering, expandable details, and responsive cards.
- **Job Search Pipeline** — controlled forms, validation, create/edit/delete workflows, sorting/filtering, localStorage persistence, inline confirmation, and a local AI draft workflow.

The Job Search Pipeline's draft feature uses a small local Express API and Ollama. The browser calls a relative `/api` route through Vite's development proxy; Express validates requests and model output with Zod before returning editable suggestions to the form. The draft flow remains separated behind `generateApplicationDraft()`, so the UI is not coupled to the model provider.

## Tech stack

- Vite, React, and TypeScript
- React Router
- Plain scoped CSS with instructional comments
- ESLint, Prettier, and simple-import-sort
- Jest, React Testing Library, and user-event
- Playwright for end-to-end coverage

## Run locally

```bash
npm install
npm run dev
```

`npm run dev` starts Vite and the local Express API together. Open the local URL printed by Vite, normally `http://localhost:5173`.

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
```

## Documentation

Concise learning notes live in [docs/learning](docs/learning/). Reusable starter-project decisions and future automation ideas live in [docs/project-bootstrap](docs/project-bootstrap/).

## Current boundaries

- Application data persists locally in the browser with `localStorage`.
- The AI draft API and Ollama model run only on the local machine; no job-listing text is sent to a hosted AI provider.
- A database, authentication, Storybook, MSW, CI, and deployment remain future learning milestones.
