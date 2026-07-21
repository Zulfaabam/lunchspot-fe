import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Home } from './pages/Home'

export default function App() {
  console.log('api url', import.meta.env.VITE_API_URL)
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Homepage & Canteen Floor Twin Routes */}
          <Route path='/' element={<Home />} />
          <Route path='/canteen/:id' element={<Home />} />

          {/* Public Admin Login Route */}
          <Route path='/login' element={<Login />} />

          {/* Protected Admin Dashboard Route */}
          <Route
            path='/dashboard'
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
