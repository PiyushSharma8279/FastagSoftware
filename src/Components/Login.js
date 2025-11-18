import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
    const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('auth_user')) || null
    } catch {
      return null
    }
  })

  useEffect(() => {
    if (user) localStorage.setItem('auth_user', JSON.stringify(user))
    else localStorage.removeItem('auth_user')
  }, [user])

  function handleSubmit(e) {
    e.preventDefault()
    setError('')

   
    if (!username.trim() || !password) {
      setError('Please enter both username and password.')
      return
    }

    setIsLoggingIn(true)

    setTimeout(() => {
      if (username.trim().length >= 3 && password.length >= 6) {
        const loggedUser = { name: username.trim(), loggedAt: new Date().toISOString() }
        setUser(loggedUser)
        setUsername('')
        setPassword('')
        setError('')
      } else {
        setError('Invalid credentials. Username must be ≥3 chars and password ≥6 chars.')
      }
      setIsLoggingIn(false)
    }, 700)
  }

  function handleLogout() {
    setUser(null)
    setError('')
  }

  const Greeting = ({ user }) => (
    <div className="flex items-center gap-4">
      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
        {user.name[0].toUpperCase()}
      </div>
      <div>
        <p className="text-sm text-slate-600">Welcome back,</p>
        <p className="text-lg font-semibold text-slate-900">{user.name}</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-white to-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-sm shadow-2xl rounded-3xl p-8 border border-white/40">
          {!user ? (
            <>
              <header className="mb-6 text-center">
                <h1 className="text-2xl font-bold text-slate-900">Sign in to your account</h1>
                <p className="text-sm text-slate-500 mt-1">Enter your username and password to continue</p>
              </header>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-slate-700">
                    Username
                  </label>
                  <div className="mt-1">
                    <input
                      id="username"
                      name="username"
                      type="text"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="your.username"
                      aria-invalid={!!error}
                      aria-describedby={error ? 'form-error' : undefined}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                    Password
                  </label>
                  <div className="relative mt-1">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-lg border border-slate-200 px-3 py-2 shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-sm text-slate-500 px-2 py-1 rounded"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? 'Hide' : 'Show'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-slate-300" />
                    <span className="text-slate-600">Remember me</span>
                  </label>

                  <a href="#" className="text-indigo-600 hover:underline">
                    Forgot?
                  </a>
                </div>

                {error && (
                  <div id="form-error" className="text-sm text-red-600">
                    {error}
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-white font-medium shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {isLoggingIn ? 'Signing in...' : 'Sign in'}
                  </button>
                </div>

                <p className="text-xs text-center text-slate-400">By signing in you agree to our terms of service.</p>
              </form>
            </>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <Greeting user={user} />
                <div className="text-right text-sm text-slate-500">
                  <p>Signed in</p>
                  <p className="mt-1 text-xs">{new Date(user.loggedAt).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/')}
                  className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
                >
                  Go to Dashboard
                </button>

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-rose-500 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-600"
                >
                  Log out
                </button>
              </div>

              <div className="text-xs text-slate-500">Not {user.name}? <button onClick={handleLogout} className="text-indigo-600 hover:underline">Sign in with another account</button></div>
            </div>
          )}
        </div>

      
      </div>
    </div>
  )
}
