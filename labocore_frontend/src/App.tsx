import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Samples from './pages/Samples'
import Results from './pages/Results'
import Inventory from './pages/Inventory'
import Suppliers from './pages/Suppliers'
import Technicians from './pages/Technicians'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import { useAuth } from './auth/AuthProvider'
import ProtectedRoute from './auth/ProtectedRoute'
import AppShell from './components/AppShell'
import { ThemeProvider } from './contexts/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          
          <Route
            path="/app/*"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/samples" element={<Samples />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/technicians" element={<Technicians />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/app/" replace />} />
                  </Routes>
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* Redirect old routes to new /app/* structure */}
          <Route path="/dashboard" element={<Navigate to="/app/" replace />} />
          <Route path="/samples" element={<Navigate to="/app/samples" replace />} />
          <Route path="/results" element={<Navigate to="/app/results" replace />} />
          <Route path="/inventory" element={<Navigate to="/app/inventory" replace />} />
          <Route path="/suppliers" element={<Navigate to="/app/suppliers" replace />} />
          <Route path="/technicians" element={<Navigate to="/app/technicians" replace />} />
          <Route path="/reports" element={<Navigate to="/app/reports" replace />} />
          <Route path="/settings" element={<Navigate to="/app/settings" replace />} />
        </Routes>
      </LanguageProvider>
    </ThemeProvider>
  )
}
