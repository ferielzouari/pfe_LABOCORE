import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import { useAuth } from '../auth/AuthProvider'

const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@lab.com')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email || !password) {
      setError('Please enter both email and password.')
      return
    }

    const success = await login(email, password)
    if (success) {
      navigate('/')
    } else {
      setError('Invalid credentials.')
    }
  }

  return (
    <div className="login-page">
      <Card className="login-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: 'var(--primary-color)', letterSpacing: '2px', fontSize: '1.5rem', margin: 0 }}>LABOCORE</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>Sign in to your dashboard</p>
        </div>
        
        {error && (
          <div style={{ backgroundColor: 'var(--danger-bg)', color: 'var(--danger)', padding: '0.75rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.875rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="user@labocore.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" /> Remember me
            </label>
            <a href="#" style={{ color: 'var(--primary-color)' }}>Forgot password?</a>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '1rem' }}>
            Sign In
          </button>
        </form>
      </Card>
    </div>
  )
}

export default Login
