import {
  createGraphQLServer,
  graphQLEndpoint,
} from '../server/graphql/graphqlServer.js'
import { createSupabaseGraphQLDataSource } from '../server/graphql/supabaseGraphQLDataSource.js'
import type { IncomingMessage, ServerResponse } from 'node:http'

const graphQLServer = createGraphQLServer(createSupabaseGraphQLDataSource())

export default async function graphQLHandler(
  request: IncomingMessage,
  response: ServerResponse,
) {
  await graphQLServer(request, response)
}

export { graphQLEndpoint }
