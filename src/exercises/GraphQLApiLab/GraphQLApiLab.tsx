import './GraphQLApiLab.css'
import { graphQLClient, GraphQLRequestError } from '../../lib/graphqlClient'
import { useState } from 'react'

type ViewerQueryData = {
  viewer: {
    applications: {
      companyName: string
      id: string
      roleTitle: string
      status: string
    }[]
    email: string | null
    id: string
  } | null
}

const viewerQuery = /* GraphQL */ `
  query Viewer {
    viewer {
      id
      email
      applications {
        id
        companyName
        roleTitle
        status
      }
    }
  }
`

function GraphQLApiLab() {
  const [viewer, setViewer] = useState<ViewerQueryData['viewer']>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleViewerRequest() {
    setError(null)
    setIsLoading(true)

    try {
      const data = await graphQLClient.execute<ViewerQueryData>({
        query: viewerQuery,
      })

      setViewer(data.viewer)

      if (!data.viewer) {
        setError('The GraphQL API could not identify the current user.')
      }
    } catch (requestError) {
      setViewer(null)
      setError(
        requestError instanceof GraphQLRequestError
          ? requestError.message
          : 'The GraphQL request could not be completed.',
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="graphql-api-lab" aria-labelledby="graphql-api-heading">
      <h2 id="graphql-api-heading" className="exercise-title">
        GraphQL API Lab
      </h2>

      <p>
        Run a real authenticated GraphQL query from the browser. The helper uses
        your Supabase session token, and the server forwards it to Supabase so
        Row Level Security still limits the response to your data.
      </p>

      <pre aria-label="Viewer GraphQL query">
        <code>{viewerQuery.trim()}</code>
      </pre>

      <button type="button" onClick={handleViewerRequest} disabled={isLoading}>
        {isLoading ? 'Requesting viewer…' : 'Run viewer query'}
      </button>

      {isLoading && <p role="status">Requesting your GraphQL viewer…</p>}

      {error && <p role="alert">{error}</p>}

      {viewer && (
        <section
          className="graphql-api-lab__result"
          aria-labelledby="viewer-heading"
        >
          <h3 id="viewer-heading">GraphQL response</h3>
          <dl>
            <div>
              <dt>Viewer ID</dt>
              <dd>{viewer.id}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{viewer.email ?? 'No email returned'}</dd>
            </div>
            <div>
              <dt>Applications returned</dt>
              <dd>{viewer.applications.length}</dd>
            </div>
          </dl>

          <ul>
            {viewer.applications.map((application) => (
              <li key={application.id}>
                {application.companyName} — {application.roleTitle} ({' '}
                {application.status})
              </li>
            ))}
          </ul>
        </section>
      )}
    </section>
  )
}

export default GraphQLApiLab
