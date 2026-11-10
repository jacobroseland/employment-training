import { getSupabaseClient } from './supabaseClient'
import { z } from 'zod'

type GraphQLOperation = {
  query: string
  variables?: Record<string, unknown>
}

type GraphQLClientDependencies = {
  fetchImplementation: typeof fetch
  getAccessToken: () => Promise<string | null>
}

const graphQLResponseSchema = z.object({
  data: z.unknown().optional(),
  errors: z
    .array(
      z.object({
        message: z.string(),
      }),
    )
    .optional(),
})

export class GraphQLRequestError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'GraphQLRequestError'
  }
}

export function createGraphQLClient({
  fetchImplementation,
  getAccessToken,
}: GraphQLClientDependencies) {
  return {
    async execute<ResponseData>({ query, variables }: GraphQLOperation) {
      const accessToken = await getAccessToken()

      if (!accessToken) {
        throw new GraphQLRequestError(
          'Sign in before requesting private GraphQL data.',
        )
      }

      const response = await fetchImplementation('/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, variables }),
      })

      if (!response.ok) {
        throw new GraphQLRequestError(
          `The GraphQL API returned ${response.status}.`,
        )
      }

      const graphQLResponse = graphQLResponseSchema.parse(await response.json())

      if (graphQLResponse.errors?.length) {
        throw new GraphQLRequestError(
          graphQLResponse.errors.map((error) => error.message).join(' '),
        )
      }

      if (graphQLResponse.data === undefined) {
        throw new GraphQLRequestError(
          'The GraphQL API returned neither data nor errors.',
        )
      }

      return graphQLResponse.data as ResponseData
    },
  }
}

export const graphQLClient = createGraphQLClient({
  fetchImplementation: (...arguments_) => globalThis.fetch(...arguments_),
  async getAccessToken() {
    const { data, error } = await getSupabaseClient().auth.getSession()

    if (error) {
      throw error
    }

    return data.session?.access_token ?? null
  },
})
