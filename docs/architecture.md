# Architecture overview

The companion editable FigJam diagram is created from the same source of truth as this document. It separates the deployed application from local-only development services so the current boundaries stay clear.

## Production runtime

1. A user loads the Vite-built React application from Vercel.
2. The browser application uses Supabase Auth for the account session and the Supabase data API for private application data.
3. Supabase Row Level Security enforces that each user can access only their own job applications and app-installation rows.

## Local development additions

1. Vite serves the client and proxies relative `/api` calls.
2. The local Express API validates an AI-draft request with Zod.
3. Express calls a locally running Ollama model and validates the structured response before returning editable form suggestions.

That AI path is intentionally **local-only** today. It is not included in the Vercel production deployment.

## Delivery path

1. Changes are pushed to GitHub.
2. GitHub Actions runs repository quality checks.
3. Vercel deploys the `main` branch as production.

## Source and diagram

- [Exercise technology map](learning/exercise-technology-map.md)
- [Supabase local development and migrations](learning/supabase-local-development.md)
- [Interactive FigJam architecture diagram](https://www.figma.com/board/PmKdPYG1GdMwNMyuQsBss5?utm_source=chatgpt&utm_content=edit_in_figjam&oai_id=v1%2FBMCaYYrzKSHMIobpzni1KaehWkKXmpS30gLfclebN9l2vL8QHZutUZ&request_id=7f49f1ea-f515-455b-a649-f97f49567fbc&architecture=true)
