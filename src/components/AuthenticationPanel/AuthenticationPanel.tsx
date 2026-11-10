import './AuthenticationPanel.css'
import { getSupabaseClient } from '../../lib/supabaseClient'
import type { FormEvent } from 'react'
import { useState } from 'react'

type AuthenticationMode = 'sign-in' | 'sign-up'

function AuthenticationPanel() {
  const [mode, setMode] = useState<AuthenticationMode>('sign-in')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isSignUp = mode === 'sign-up'

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setErrorMessage(null)
    setStatusMessage(null)
    setIsSubmitting(true)

    const credentials = { email: email.trim(), password }
    const result = isSignUp
      ? await getSupabaseClient().auth.signUp({
          ...credentials,
          options: { emailRedirectTo: window.location.origin },
        })
      : await getSupabaseClient().auth.signInWithPassword(credentials)

    setIsSubmitting(false)

    if (result.error) {
      setErrorMessage(result.error.message)
      return
    }

    if (!result.data.session) {
      setStatusMessage(
        'Check your email to confirm your account, then sign in.',
      )
    }
  }

  function handleModeChange(nextMode: AuthenticationMode) {
    setMode(nextMode)
    setErrorMessage(null)
    setStatusMessage(null)
  }

  return (
    <section className="authentication-panel" aria-labelledby="sign-in-heading">
      <h2 id="sign-in-heading">
        {isSignUp ? 'Create your account' : 'Sign in'}
      </h2>

      <p>Sign in to use personal tools and keep their data private.</p>

      <form className="authentication-form" onSubmit={handleSubmit}>
        <label>
          <span>Email address</span>

          <input
            autoComplete="email"
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        <label>
          <span>Password</span>

          <input
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            minLength={6}
            required
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>

        {errorMessage ? (
          <p className="authentication-message" role="alert">
            {errorMessage}
          </p>
        ) : null}

        {statusMessage ? (
          <p className="authentication-message" role="status">
            {statusMessage}
          </p>
        ) : null}

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Working…' : isSignUp ? 'Create account' : 'Sign in'}
        </button>
      </form>

      <button
        className="authentication-mode-toggle"
        type="button"
        onClick={() => handleModeChange(isSignUp ? 'sign-in' : 'sign-up')}
      >
        {isSignUp
          ? 'Already have an account? Sign in'
          : 'New here? Create an account'}
      </button>
    </section>
  )
}

export default AuthenticationPanel
