# GraphQL API lab

## Why GraphQL is here

The application already has a working Supabase browser client. GraphQL is not replacing it yet. This small server-side lab exists to practice the pieces that make GraphQL useful in a larger application: a schema, resolvers, request context, authentication, authorization-aware data access, and API tests.

The endpoint is local for now:

    http://127.0.0.1:8787/graphql

Open that address in a browser to use GraphiQL, the built-in query workspace from GraphQL Yoga.

## What was installed

    npm install graphql graphql-yoga dotenv

- **`graphql`:** the core language implementation. It validates operations and executes the schema.
- **`graphql-yoga`:** the HTTP server that exposes the schema at `/graphql` and provides GraphiQL during development.
- **`dotenv`:** loads `.env.local` for the local Node server. It does not put any values into the browser bundle.

GraphQL Yoga mounts on the existing Express server, so REST-style `/api/application-draft` and GraphQL `/graphql` can coexist while we learn their different strengths.

## Initial schema and mutation

The schema starts with two queries:

    query {
      apiInfo {
        name
        purpose
      }
    }

`apiInfo` is public and makes it easy to confirm that the server is working. `viewer` is authenticated and returns the signed-in user plus their job applications:

    query {
      viewer {
        id
        email
        applications {
          companyName
          roleTitle
          status
          workArrangement
        }
      }
    }

The client chooses exactly which fields it needs. There is one HTTP endpoint, `/graphql`, rather than a separate URL for each resource.

It also has one focused mutation. This creates one application for the authenticated caller:

    mutation CreateApplication($input: CreateJobApplicationInput!) {
      createJobApplication(input: $input) {
        id
        companyName
        roleTitle
        status
        workArrangement
      }
    }

    variables:
    {
      "input": {
        "companyName": "Example Labs",
        "roleTitle": "Frontend Engineer",
        "status": "APPLIED",
        "workArrangement": "REMOTE"
      }
    }

GraphQL enums make the allowed status and work-arrangement values part of the API contract. The resolver translates enum values such as `ON_SITE` to the existing database value `on-site`.

An unauthenticated mutation returns a GraphQL error with the public `UNAUTHENTICATED` code. Expected user-facing errors can be deliberately exposed this way; unexpected implementation or database errors remain masked by GraphQL Yoga rather than leaking server details.

## Request lifecycle

For the public query you just ran, the request moves through these layers:

    GraphiQL or client
        -> POST /graphql
        -> GraphQL Yoga parses and validates the operation against the schema
        -> Query.apiInfo resolver returns a TypeScript object
        -> GraphQL selects only the requested fields
        -> JSON response

For an authenticated `viewer` query, the path is longer:

    Browser with Supabase session
        -> Authorization: Bearer <access token>
        -> GraphQL context reads the header
        -> Query.viewer validates the token with Supabase Auth
        -> Viewer.applications queries Supabase using that same token
        -> Postgres RLS permits only the current user's rows
        -> GraphQL shapes the selected fields into the response

The distinction matters: GraphQL controls the **shape** of the API response, but Supabase and Postgres still control **who may access the data**.

The authenticated mutation follows the same trust boundary:

    browser variables
        -> GraphQL validates input shape and enum values
        -> Mutation.createJobApplication reads the bearer token
        -> data source validates the token with Supabase Auth
        -> data source derives user_id from that validated user
        -> Postgres RLS verifies the insert belongs to that user
        -> GraphQL returns only the requested fields

The browser never sends a `userId`. The server derives it from the validated token, and RLS verifies it again at the database boundary.

## Schema, resolver, context, and data source

These names are easy to blur together at first. In this project each has one job:

- **Schema:** `server/graphql/graphqlServer.ts` declares the public contract. `type Query` says clients may request `apiInfo` and `viewer`; `type Viewer` says an authenticated user can expose `id`, `email`, and `applications`.
- **Resolver:** the same file contains functions that fulfill those schema fields. For example, the `Query.viewer` resolver extracts a bearer token and asks the data source who that token represents.
- **Context:** Yoga creates a fresh context for every request. Ours contains the request’s Authorization header and the data source. It is dependency plumbing, not a permission grant.
- **Data source:** `server/graphql/supabaseGraphQLDataSource.ts` knows how to validate a token and read Supabase rows. It maps database-style names such as `company_name` into GraphQL-style names such as `companyName`.

That separation keeps the schema readable, makes data access replaceable, and lets the API tests use a fake data source instead of a real database.

## Why the bearer token is forwarded

It might seem simpler for the server to use a Supabase service-role key and fetch every row itself. We intentionally do not do that here.

The server creates a Supabase client with the incoming user token:

    Authorization: Bearer <the signed-in user's access token>

Supabase can then identify the caller, and Postgres evaluates existing Row Level Security policies for that caller. The GraphQL server cannot accidentally turn into an unrestricted database backdoor merely because it runs on the server.

A service-role key is appropriate only for carefully limited trusted operations that RLS cannot perform. It is never a browser value and is not needed for this first lab.

## Why tests inject a data source

`createServerApp()` accepts a `GraphQLDataSource`. The production app uses `createSupabaseGraphQLDataSource()`, while `server/serverApp.test.ts` provides a small fake implementation.

    test -> fake data source -> GraphQL resolver -> response assertion

This test shape isolates GraphQL behavior: schema fields, authentication branching, and response shape. It does not need a running Supabase project, a real user, or network access. The separate local GraphiQL check proves that the actual Express/Yoga server also starts and accepts operations.

## Browser client helper

`src/lib/graphqlClient.ts` is the browser transport boundary. It performs four jobs:

1. Asks the existing Supabase browser client for the current session access token.
2. Sends a JSON `POST` request to `/graphql` with `Authorization: Bearer <token>`.
3. Separates HTTP failures from GraphQL `errors` returned in an otherwise valid response body.
4. Returns the selected `data` payload to the caller.

The helper is created with `getAccessToken` and `fetchImplementation` dependencies. Production supplies the real Supabase session and browser fetch. Tests inject controlled versions of both:

    production -> Supabase session + browser fetch -> /graphql
    test       -> fake access token + mocked fetch -> response assertion

This is dependency injection in a small, practical form. It avoids requiring a real sign-in or real HTTP server to test headers, response handling, and error behavior.

Vite proxies both `/api` and `/graphql` to the local Express process during development. In the browser, the request therefore stays relative to the application origin:

    browser fetch('/graphql') -> Vite proxy -> Express + GraphQL Yoga

That keeps the frontend free of hard-coded local ports. A later deployed server route can preserve the same `/graphql` client contract.

## GraphQL API Lab exercise

The **GraphQL API Lab** is an account-required exercise, separate from Job Search Pipeline product work. It displays the exact `viewer` operation, sends it through the browser helper after a button click, and renders only the returned viewer/application fields.

It exists to make the complete path observable:

    signed-in React exercise
        -> GraphQL client helper
        -> Vite proxy
        -> Express + Yoga resolver
        -> Supabase Auth + RLS-protected Postgres read
        -> selected GraphQL response

The lab has loading, signed-out, API-error, and success states. It intentionally does not add GraphQL-backed CRUD to the Job Search Pipeline yet.

## Reading GraphQL responses

A successful GraphQL response is wrapped in `data`:

    {
      "data": {
        "apiInfo": {
          "name": "Employment Training GraphQL Lab"
        }
      }
    }

GraphQL can return field-level `errors` alongside partial `data`. That differs from a simple REST convention where one failed operation usually produces one HTTP error response. The `createJobApplication` mutation demonstrates an expected `UNAUTHENTICATED` error; unexpected implementation errors stay masked.

## Authentication and RLS

The GraphQL server reads a bearer token from the `Authorization` header. It uses the browser-safe Supabase URL and publishable key to validate that token with Supabase Auth.

For application reads, the server creates a Supabase client with that same bearer token. That means Postgres Row Level Security remains the source of truth: the GraphQL resolver cannot read another user’s applications merely because it runs on the server.

This is intentional. A later privileged server workflow may need a service-role key, but it must be isolated, justified, and never sent to the browser.

## File responsibilities

- `server/serverApp.ts` composes the REST draft app and GraphQL endpoint into one Express application.
- `server/graphql/graphqlServer.ts` defines schema, resolvers, GraphQL context, and GraphiQL configuration.
- `server/graphql/supabaseGraphQLDataSource.ts` translates Supabase rows into GraphQL-shaped data and performs token-scoped reads.
- `server/serverApp.test.ts` uses Supertest with a fake data source. It proves public, authenticated, and unauthenticated behavior without contacting a real Supabase project.
- `server/index.ts` is the port-listening entry point. It loads `.env.local` only for the local Node process.

## Important distinction: context versus authorization

The GraphQL context carries request-specific information, including the bearer token and data source. It is not permission by itself. Resolvers use that context to call Supabase, and RLS makes the final access decision when Postgres executes the query.

## What is deliberately not included yet

- No generic GraphQL hook/cache library. The lab deliberately uses the small browser client helper directly.
- No mutation wiring in the Job Search Pipeline. That would create a second CRUD path for the same screen before there is a product reason to replace the existing Supabase repository.
- No hosted GraphQL endpoint.
- No service-role key.
- No attempt to move all existing Supabase calls behind GraphQL.

Those are later steps once this small boundary is understood and has a real need.
