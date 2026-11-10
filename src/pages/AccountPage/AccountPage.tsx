import { useAuth } from '../../auth/authContext'
import AuthenticationPanel from '../../components/AuthenticationPanel/AuthenticationPanel'
import { useNavigate, useSearchParams } from 'react-router'

function AccountPage() {
  const { isConfigured, isLoading, user } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get('returnTo')

  if (!isConfigured) {
    return (
      <section className="account-page" aria-labelledby="account-heading">
        <h2 id="account-heading" className="exercise-title">
          Account
        </h2>
        <p>Account features are available when Supabase is configured.</p>
      </section>
    )
  }

  if (isLoading) {
    return <p role="status">Checking your session…</p>
  }

  if (user) {
    return (
      <section className="account-page" aria-labelledby="account-heading">
        <h2 id="account-heading" className="exercise-title">
          Account
        </h2>
        <p>You are signed in as {user.email ?? 'this account'}.</p>
        {returnTo ? (
          <button
            type="button"
            onClick={() => navigate(returnTo, { replace: true })}
          >
            Continue to your app
          </button>
        ) : null}
      </section>
    )
  }

  return (
    <section className="account-page" aria-labelledby="account-heading">
      <h2 id="account-heading" className="exercise-title">
        Account
      </h2>
      <AuthenticationPanel />
    </section>
  )
}

export default AccountPage
