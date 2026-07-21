import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react'
import type { User, AuthContextType } from '../types/auth'
import { loginApi, logoutApi } from '../services/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const STORAGE_KEY = 'lunchspot_auth_user'
const TOKEN_KEY = 'lunchspot_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [user])

  const login = async (email: string, pass: string): Promise<boolean> => {
    setIsLoading(true)

    // Basic validation
    if (!email || !pass || pass.length < 4) {
      setIsLoading(false)
      return false
    }

    try {
      if (import.meta.env.VITE_USE_MOCK !== 'false') {
        // Simulate network delay for authentication
        await new Promise((res) => setTimeout(res, 600))
        localStorage.setItem(TOKEN_KEY, 'mock-token-12345')
      } else {
        const response = await loginApi(email, pass)
        if (response.success && response.data?.accessToken) {
          localStorage.setItem(TOKEN_KEY, response.data.accessToken)
        } else {
          setIsLoading(false)
          return false
        }
      }

      // Generate mock user from email (since API doesn't return user details yet)
      const nameFromEmail = email.split('@')[0]
      const formattedName = nameFromEmail
        .split('.')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ')

      const authenticatedUser: User = {
        id: 'usr_' + Math.random().toString(36).substring(2, 9),
        email: email.trim().toLowerCase(),
        name: formattedName || 'Operations Manager',
        role: 'Cafeteria Admin',
      }

      setUser(authenticatedUser)
      setIsLoading(false)
      return true
    } catch (error) {
      console.error('Login failed', error)
      setIsLoading(false)
      return false
    }
  }

  const logout = async () => {
    try {
      if (import.meta.env.VITE_USE_MOCK === 'false') {
        await logoutApi()
      }
    } catch (error) {
      console.error('Logout API failed', error)
    } finally {
      setUser(null)
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(TOKEN_KEY)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
