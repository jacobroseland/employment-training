import type { GraphQLDataSource } from './supabaseGraphQLDataSource.ts'
import { GraphQLError } from 'graphql'
import { createSchema, createYoga } from 'graphql-yoga'

type GraphQLContext = {
  authorization: string | null
  dataSource: GraphQLDataSource
}

type ViewerWithAccessToken = {
  accessToken: string
  email: string | null
  id: string
}

function getBearerToken(authorization: string | null) {
  if (!authorization?.startsWith('Bearer ')) {
    return null
  }

  return authorization.slice('Bearer '.length)
}

export function createGraphQLServer(dataSource: GraphQLDataSource) {
  const schema = createSchema({
    typeDefs: /* GraphQL */ `
      type ApiInfo {
        name: String!
        purpose: String!
      }

      type JobApplication {
        companyName: String!
        createdAt: String!
        dateApplied: String
        id: ID!
        jobUrl: String
        location: String
        nextFollowUpDate: String
        notes: String
        roleTitle: String!
        salaryRange: String
        status: String!
        workArrangement: String!
      }

      type Viewer {
        applications: [JobApplication!]!
        email: String
        id: ID!
      }

      enum JobApplicationStatus {
        SAVED
        APPLIED
        INTERVIEWING
        OFFER
        CLOSED
      }

      enum WorkArrangement {
        REMOTE
        HYBRID
        ON_SITE
      }

      input CreateJobApplicationInput {
        companyName: String!
        dateApplied: String
        jobUrl: String
        location: String
        nextFollowUpDate: String
        notes: String
        roleTitle: String!
        salaryRange: String
        status: JobApplicationStatus! = SAVED
        workArrangement: WorkArrangement! = REMOTE
      }

      type Query {
        apiInfo: ApiInfo!
        viewer: Viewer
      }

      type Mutation {
        createJobApplication(input: CreateJobApplicationInput!): JobApplication!
      }
    `,
    resolvers: {
      Query: {
        apiInfo: () => ({
          name: 'Employment Training GraphQL Lab',
          purpose:
            'A small authenticated API boundary for learning GraphQL with existing Supabase data.',
        }),
        viewer: async (
          _parent: unknown,
          _arguments: Record<string, never>,
          context: GraphQLContext,
        ): Promise<ViewerWithAccessToken | null> => {
          const accessToken = getBearerToken(context.authorization)

          if (!accessToken) {
            return null
          }

          const viewer = await context.dataSource.getViewer(accessToken)

          if (!viewer) {
            return null
          }

          return { ...viewer, accessToken }
        },
      },
      Viewer: {
        applications: (
          viewer: ViewerWithAccessToken,
          _arguments: Record<string, never>,
          context: GraphQLContext,
        ) => context.dataSource.listJobApplications(viewer.accessToken),
      },
      Mutation: {
        createJobApplication: async (
          _parent: unknown,
          {
            input,
          }: {
            input: {
              companyName: string
              dateApplied?: string | null
              jobUrl?: string | null
              location?: string | null
              nextFollowUpDate?: string | null
              notes?: string | null
              roleTitle: string
              salaryRange?: string | null
              status: string
              workArrangement: string
            }
          },
          context: GraphQLContext,
        ) => {
          const accessToken = getBearerToken(context.authorization)

          if (!accessToken) {
            throw new GraphQLError(
              'Sign in before creating a job application.',
              {
                extensions: { code: 'UNAUTHENTICATED' },
              },
            )
          }

          return context.dataSource.createJobApplication(accessToken, {
            ...input,
            status: input.status.toLowerCase(),
            workArrangement:
              input.workArrangement === 'ON_SITE'
                ? 'on-site'
                : input.workArrangement.toLowerCase(),
          })
        },
      },
    },
  })

  return createYoga<GraphQLContext>({
    context: ({ request }) => ({
      authorization: request.headers.get('authorization'),
      dataSource,
    }),
    graphqlEndpoint: '/graphql',
    graphiql: true,
    schema,
  })
}
