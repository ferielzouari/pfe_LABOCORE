import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import FloatingInput from '../components/ui/FloatingInput'
import RippleButton from '../components/ui/RippleButton'
import gsap from 'gsap'

const Login: React.FC = () => {
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { login }               = useAuth()
  const navigate                = useNavigate()

  const cardRef  = useRef<HTMLDivElement>(null)
  const logoRef  = useRef<HTMLDivElement>(null)
  const formRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const tl = gsap.timeline()

    if (logoRef.current) {
      tl.from(logoRef.current, {
        opacity: 0, scale: 0.7, y: -20, duration: 0.55, ease: 'back.out(1.7)', clearProps: 'all',
      })
    }
    if (cardRef.current) {
      tl.from(cardRef.current, {
        opacity: 0, y: 36, scale: 0.96, duration: 0.6, ease: 'power3.out', clearProps: 'all',
      }, '-=0.3')
    }
    if (formRef.current) {
      const fields = formRef.current.querySelectorAll('.fi-wrapper, .login-footer-row, button')
      tl.from(fields, {
        opacity: 0, y: 14, duration: 0.35, stagger: 0.07, ease: 'power3.out', clearProps: 'all',
      }, '-=0.35')
    }

    return () => { tl.kill() }
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!username || !password) {
      setError('Please enter both username and password.')
      return
    }
    setLoading(true)
    const success = await login(username, password)
    setLoading(false)

    if (success) {
      navigate('/dashboard')
    } else {
      setError('Invalid credentials. Please try again.')
      if (cardRef.current) {
        gsap.fromTo(
          cardRef.current,
          { x: -10 },
          { x: 0, duration: 0.5, ease: 'elastic.out(1,0.3)', clearProps: 'all' }
        )
      }
    }
  }

  return (
    <div className="login-page">
      <div ref={cardRef} className="card login-card">

        {/* Logo */}
        <div className="login-logo" ref={logoRef}>
          <div className="login-logo-badge">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 18h8"/>
              <path d="M3 22h18"/>
              <path d="M14 22a7 7 0 1 0 0-14h-1"/>
              <path d="M9 14h2"/>
              <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z"/>
              <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3"/>
            </svg>
          </div>
          <h1 className="login-title">LABOCORE</h1>
          <p className="login-subtitle">Laboratory Management System</p>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div ref={formRef}>
            <FloatingInput
              label="Username"
              type="text"
              value={username}
              onChange={setUsername}
              autoComplete="username"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              }
            />

            <FloatingInput
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              icon={
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              }
            />

            <div className="login-footer-row">
              <label className="login-remember">
                <input type="checkbox" style={{ accentColor: '#a78bfa' }} />
                <span>Remember me</span>
              </label>
              <a href="#">Forgot password?</a>
            </div>

            <RippleButton
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              magnetic
              iconRight={
                !loading ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/>
                  </svg>
                ) : undefined
              }
              style={{ marginTop: '0.5rem' }}
            >
              Sign In
            </RippleButton>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
