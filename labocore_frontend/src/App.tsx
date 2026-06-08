import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Samples from './pages/Samples'
import Results from './pages/Results'
import Inventory from './pages/Inventory'
import StockMovements from './pages/StockMovements'
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
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppShell>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/samples" element={<Samples />} />
                    <Route path="/results" element={<Results />} />
                    <Route path="/inventory" element={<Inventory />} />
                    <Route path="/stock-movements" element={<StockMovements />} />
                    <Route path="/suppliers" element={<Suppliers />} />
                    <Route path="/technicians" element={<Technicians />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </AppShell>
              </ProtectedRoute>
            }
          />
        </Routes>
      </LanguageProvider>
    </ThemeProvider>
  )
}
