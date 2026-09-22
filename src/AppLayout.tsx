import { Link, Outlet, useLocation } from 'react-router'

function AppLayout() {
  const location = useLocation()

  const isCatalogRoute = location.pathname === '/'
  const isLearningDocumentRoute = location.pathname.startsWith('/learning/')

  const backDestination = isLearningDocumentRoute ? '/learning' : '/'
  const backLabel = isLearningDocumentRoute
    ? 'Back to learning docs'
    : 'Back to catalog'

  return (
    <>
      <header className="training-app-header">
        <h1>
          <Link to="/">2026 Training Exercises</Link>
        </h1>

        {!isCatalogRoute && (
          <Link className="back" to={backDestination}>
            <span aria-hidden="true">←</span>
            {backLabel}
          </Link>
        )}

        <Link className="learning-docs" to="/learning">
          Learning docs
        </Link>
      </header>

      <main>
        <Outlet />
      </main>
    </>
  )
}

export default AppLayout
