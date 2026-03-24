import React, { createContext, useEffect, useState, useCallback } from 'react'
import axios from 'axios'
import { User, UserRole } from '../types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  register: (name: string, email: string, password: string, role: UserRole) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000'
  const timeout = parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')

  // Configure axios instance with credentials
  const axiosInstance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
    timeout
  })

  // Rehydrate session on mount
  useEffect(() => {
    const rehydrateSession = async () => {
      try {
        const response = await axiosInstance.get<{ user: User }>('/auth/me')
        if (response.data.user) {
          setUser(response.data.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        // Session expired or user not authenticated
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    rehydrateSession()
  }, [])

  const login = useCallback(
    async (email: string, password: string, role: UserRole) => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.post<{ user: User }>(
          '/auth/login',
          { email, password, role }
        )

        if (response.data.user) {
          setUser(response.data.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        setUser(null)
        setIsAuthenticated(false)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [apiUrl, timeout]
  )

  const logout = useCallback(async () => {
    setIsLoading(true)
    try {
      await axiosInstance.post('/auth/logout')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear state regardless of API response
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
      // Navigate to login
      window.location.href = '/login'
    }
  }, [apiUrl, timeout])

  const register = useCallback(
    async (name: string, email: string, password: string, role: UserRole) => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.post<{ user: User }>(
          '/auth/register',
          { name, email, password, role }
        )

        if (response.data.user) {
          setUser(response.data.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        setUser(null)
        setIsAuthenticated(false)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [apiUrl, timeout]
  )

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    register
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
