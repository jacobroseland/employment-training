# Employment Training

A hands-on React, TypeScript, and frontend-engineering sandbox for rebuilding practical coding fluency and practicing production-oriented patterns.

The app is a catalog of small, self-contained exercises. Each exercise introduces a focused set of concepts while the repository also practices shared tooling, testing, documentation, and accessibility conventions.

## Exercises

- **Hello World** — React component basics and CSS animation.
- **Country Explorer** — data fetching, loading/error/empty states, search, filtering, expandable details, and responsive cards.
- **Job Search Pipeline** — controlled forms, validation, create/edit/delete workflows, sorting/filtering, localStorage persistence, inline confirmation, and a practice-mode AI draft workflow.

The Job Search Pipeline's draft feature currently uses a deterministic local mock. It is intentionally separated behind `generateApplicationDraft()` so a future Node/Ollama implementation can replace the mock without changing the form workflow.

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

Open the local URL printed by Vite, normally `http://localhost:5173`.

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
- The AI draft flow is a local practice mock, not an LLM integration.
- A Node API, Ollama, SQLite, authentication, Storybook, MSW, and CI remain future learning milestones.
