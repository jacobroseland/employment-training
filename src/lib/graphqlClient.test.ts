import { createGraphQLClient, GraphQLRequestError } from './graphqlClient'
import { describe, expect, jest, test } from '@jest/globals'

const viewerQuery = '{ viewer { id } }'

function createResponse(body: unknown, status = 200) {
  return {
    json: async () => body,
    ok: status >= 200 && status < 300,
    status,
  } as Response
}

describe('GraphQL client', () => {
  test('sends the Supabase access token and returns GraphQL data', async () => {
    const fetchImplementation = jest.fn<typeof fetch>()
    fetchImplementation.mockResolvedValue(
      createResponse({ data: { viewer: { id: 'user-123' } } }),
    )
    const client = createGraphQLClient({
      fetchImplementation,
      getAccessToken: async () => 'access-token',
    })

    await expect(client.execute({ query: viewerQuery })).resolves.toEqual({
      viewer: { id: 'user-123' },
    })
    expect(fetchImplementation).toHaveBeenCalledWith('/graphql', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer access-token',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: viewerQuery, variables: undefined }),
    })
  })

  test('requires a signed-in user before sending a private query', async () => {
    const fetchImplementation = jest.fn<typeof fetch>()
    const client = createGraphQLClient({
      fetchImplementation,
      getAccessToken: async () => null,
    })

    await expect(client.execute({ query: viewerQuery })).rejects.toEqual(
      new GraphQLRequestError(
        'Sign in before requesting private GraphQL data.',
      ),
    )
    expect(fetchImplementation).not.toHaveBeenCalled()
  })

  test('turns GraphQL field errors into a client error', async () => {
    const fetchImplementation = jest.fn<typeof fetch>()
    fetchImplementation.mockResolvedValue(
      createResponse({
        data: { viewer: null },
        errors: [{ message: 'The session is no longer valid.' }],
      }),
    )
    const client = createGraphQLClient({
      fetchImplementation,
      getAccessToken: async () => 'access-token',
    })

    await expect(client.execute({ query: viewerQuery })).rejects.toEqual(
      new GraphQLRequestError('The session is no longer valid.'),
    )
  })
})
