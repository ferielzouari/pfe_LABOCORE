import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
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

export default function App() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/*"
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
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </AppShell>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}
