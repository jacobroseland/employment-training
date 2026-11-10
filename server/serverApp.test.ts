/** @jest-environment node */

import type { GraphQLDataSource } from './graphql/supabaseGraphQLDataSource.ts'
import { createServerApp } from './serverApp.ts'
import { describe, expect, test } from '@jest/globals'
import request from 'supertest'

const dataSource: GraphQLDataSource = {
  async createJobApplication(accessToken, input) {
    if (accessToken !== 'valid-access-token') {
      throw new Error('Sign in before creating a job application.')
    }

    return {
      companyName: input.companyName,
      createdAt: '2026-11-10T00:00:00.000Z',
      dateApplied: input.dateApplied ?? null,
      id: 'application-created',
      jobUrl: input.jobUrl ?? null,
      location: input.location ?? null,
      nextFollowUpDate: input.nextFollowUpDate ?? null,
      notes: input.notes ?? null,
      roleTitle: input.roleTitle,
      salaryRange: input.salaryRange ?? null,
      status: input.status,
      workArrangement: input.workArrangement,
    }
  },
  async getViewer(accessToken) {
    return accessToken === 'valid-access-token'
      ? { email: 'jacob@example.com', id: 'user-123' }
      : null
  },
  async listJobApplications(accessToken) {
    if (accessToken !== 'valid-access-token') {
      return []
    }

    return [
      {
        companyName: 'Example Labs',
        createdAt: '2026-11-10T00:00:00.000Z',
        dateApplied: null,
        id: 'application-123',
        jobUrl: null,
        location: 'Remote',
        nextFollowUpDate: null,
        notes: null,
        roleTitle: 'Frontend Engineer',
        salaryRange: null,
        status: 'saved',
        workArrangement: 'remote',
      },
    ]
  },
}

describe('GraphQL API', () => {
  test('returns public API information without authentication', async () => {
    const app = createServerApp({ dataSource })

    const response = await request(app).post('/graphql').send({
      query: '{ apiInfo { name purpose } }',
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      data: {
        apiInfo: {
          name: 'Employment Training GraphQL Lab',
          purpose:
            'A small authenticated API boundary for learning GraphQL with existing Supabase data.',
        },
      },
    })
  })

  test('returns the authenticated viewer and only that viewer’s applications', async () => {
    const app = createServerApp({ dataSource })

    const response = await request(app)
      .post('/graphql')
      .set('Authorization', 'Bearer valid-access-token')
      .send({
        query: `
          {
            viewer {
              id
              email
              applications {
                id
                companyName
                roleTitle
                workArrangement
              }
            }
          }
        `,
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      data: {
        viewer: {
          applications: [
            {
              companyName: 'Example Labs',
              id: 'application-123',
              roleTitle: 'Frontend Engineer',
              workArrangement: 'remote',
            },
          ],
          email: 'jacob@example.com',
          id: 'user-123',
        },
      },
    })
  })

  test('returns a null viewer when no bearer token is provided', async () => {
    const app = createServerApp({ dataSource })

    const response = await request(app).post('/graphql').send({
      query: '{ viewer { id } }',
    })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ data: { viewer: null } })
  })

  test('creates an application for the authenticated caller', async () => {
    const app = createServerApp({ dataSource })

    const response = await request(app)
      .post('/graphql')
      .set('Authorization', 'Bearer valid-access-token')
      .send({
        query: `
          mutation CreateApplication($input: CreateJobApplicationInput!) {
            createJobApplication(input: $input) {
              id
              companyName
              roleTitle
              status
              workArrangement
            }
          }
        `,
        variables: {
          input: {
            companyName: 'GraphQL Labs',
            roleTitle: 'API Engineer',
            status: 'APPLIED',
            workArrangement: 'ON_SITE',
          },
        },
      })

    expect(response.status).toBe(200)
    expect(response.body).toEqual({
      data: {
        createJobApplication: {
          companyName: 'GraphQL Labs',
          id: 'application-created',
          roleTitle: 'API Engineer',
          status: 'applied',
          workArrangement: 'on-site',
        },
      },
    })
  })

  test('returns a GraphQL error when an unauthenticated caller creates an application', async () => {
    const app = createServerApp({ dataSource })

    const response = await request(app)
      .post('/graphql')
      .send({
        query: `
        mutation {
          createJobApplication(
            input: { companyName: "GraphQL Labs", roleTitle: "API Engineer" }
          ) {
            id
          }
        }
      `,
      })

    expect(response.status).toBe(200)
    expect(response.body.data).toEqual(null)
    expect(response.body.errors[0].message).toBe(
      'Sign in before creating a job application.',
    )
    expect(response.body.errors[0].extensions.code).toBe('UNAUTHENTICATED')
  })
})
