import { useState } from 'react'
import './App.css'

function App() {
  const [page, setPage] = useState('login')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  function changePage(nextPage) {
    setPage(nextPage)
    setMessage('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setMessage('')

    if (page === 'register' && !name.trim()) {
      setError('Please enter your name.')
      return
    }

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address.')
      return
    }

    if (page !== 'forgot' && password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    if (page === 'register' && password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      // Connect this form to the real backend API here.
      await new Promise((resolve) => setTimeout(resolve, 600))

      setMessage(
        'Form validation succeeded. Backend API is not connected yet.',
      )
    } finally {
      setLoading(false)
    }
  }

  const title =
    page === 'login'
      ? 'Welcome back'
      : page === 'register'
        ? 'Create account'
        : 'Reset password'

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="brand-mark">N</div>

        <p className="eyebrow">NANACODE ACCOUNT</p>
        <h1>{title}</h1>
        <p className="subtitle">
          {page === 'login'
            ? 'Sign in to continue to your account.'
            : page === 'register'
              ? 'Create your account to get started.'
              : 'Enter your email to reset your password.'}
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {page === 'register' && (
            <label>
              Full name
              <input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your full name"
                autoComplete="name"
              />
            </label>
          )}

          <label>
            Email address
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          {page !== 'forgot' && (
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                autoComplete={
                  page === 'login' ? 'current-password' : 'new-password'
                }
              />
            </label>
          )}

          {page === 'register' && (
            <label>
              Confirm password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) =>
                  setConfirmPassword(event.target.value)
                }
                placeholder="Repeat your password"
                autoComplete="new-password"
              />
            </label>
          )}

          {page === 'login' && (
            <button
              className="text-button forgot-link"
              type="button"
              onClick={() => changePage('forgot')}
            >
              Forgot password?
            </button>
          )}

          {error && <p className="feedback error">{error}</p>}
          {message && <p className="feedback success">{message}</p>}
          <button className="submit-button" type="submit" disabled={loading}>
            {loading
              ? 'Please wait...'
              : page === 'login'
                ? 'Sign in'
                : page === 'register'
                  ? 'Create account'
                  : 'Send reset link'}
          </button>
        </form>

        <div className="switch-page">
          {page === 'login' ? (
            <>
              Don’t have an account?{' '}
              <button
                className="text-button"
                onClick={() => changePage('register')}
              >
                Sign up
              </button>
            </>
          ) : page === 'register' ? (
            <>
              Already have an account?{' '}
              <button
                className="text-button"
                onClick={() => changePage('login')}
              >
                Sign in
              </button>
            </>
          ) : (
            <button
              className="text-button"
              onClick={() => changePage('login')}
            >
              Back to sign in
            </button>
          )}
        </div>
      </section>
    </main>
  )
}

export default App