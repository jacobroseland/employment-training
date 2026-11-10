import type { ApplicationDraftGenerator } from './applicationDraftApp.ts'
import { createApplicationDraftApp } from './applicationDraftApp.ts'
import { createGraphQLServer } from './graphql/graphqlServer.ts'
import {
  createSupabaseGraphQLDataSource,
  type GraphQLDataSource,
} from './graphql/supabaseGraphQLDataSource.ts'
import express from 'express'

type ServerAppOptions = {
  dataSource?: GraphQLDataSource
  generateDraft?: ApplicationDraftGenerator
}

export function createServerApp(options: ServerAppOptions = {}) {
  const app = express()
  const applicationDraftApp = createApplicationDraftApp(options.generateDraft)
  const dataSource = options.dataSource ?? createSupabaseGraphQLDataSource()
  const graphQLServer = createGraphQLServer(dataSource)

  app.use(applicationDraftApp)
  app.use(graphQLServer.graphqlEndpoint, (request, response) => {
    void graphQLServer(request, response)
  })

  return app
}
