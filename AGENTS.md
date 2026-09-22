# Employment Training

## Purpose

This repository is a hands-on React, TypeScript, and frontend-engineering sandbox. Prioritize learning, clear explanations, and code review over speed.

## Collaboration

- Do not modify application code unless Jacob explicitly asks for the change.
- Explain non-trivial recommendations before implementing them.
- Keep examples project-specific, readable, and concise.
- Update the relevant learning note in `docs/learning/` when a convention becomes established.
- Update `docs/project-bootstrap/` when a reusable starter decision becomes established.

## Structure

- `src/exercises/` contains self-contained exercise labs.
- `src/components/` contains intentionally shared components.
- Exercise-specific components stay colocated within their exercise.
- `docs/learning/` contains concise reference notes from completed learning.
- `docs/project-bootstrap/` records decisions for a reusable future-project starter.
- `scripts/` is reserved for future deterministic automation scripts.

## Styling and accessibility

- Prefer semantic HTML and scoped component class names.
- Keep instructional CSS comments directly above the declaration they explain.
- Preserve visible keyboard focus states and use native elements before adding ARIA.

## Validation

Run the relevant commands after application changes:

    npm run format
    npm run lint
    npm run build
    npm test

## Current tooling

Vite, React, TypeScript, React Router, ESLint, Prettier, simple-import-sort, Jest, React Testing Library, and user-event are installed. Storybook, MSW, Playwright, CI, and a backend are planned learning foundations; they are not installed yet.
