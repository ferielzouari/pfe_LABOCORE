import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

type User = {
  name: string
  role: string
}

type AuthContextType = {
  isAuthenticated: boolean
  user: User | null
  token: string | null
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'labocore_auth'
const API_URL = 'http://localhost:8080/api'

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const navigate = useNavigate()

  // Restore session from localStorage on mount
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      try {
        const parsed = JSON.parse(raw)
        if (parsed.token && parsed.user) {
          setIsAuthenticated(true)
          setUser(parsed.user)
          setToken(parsed.token)
        }
      } catch (e) {
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    if (!username || !password) return false

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      
      // Map backend response to our User type
      const authUser: User = { 
        name: data.name || username, 
        role: data.role || 'user' 
      }
      
      const authData = {
        token: data.token,
        user: authUser,
      }

      setUser(authData.user)
      setToken(authData.token)
      setIsAuthenticated(true)

      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData))
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
