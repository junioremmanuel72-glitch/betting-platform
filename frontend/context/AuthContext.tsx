'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface User {
  id: string
  email: string
  name: string
  balance: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  updateUserBalance: (newBalance: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock database - in real app, this would be a real database
interface UsersDatabase {
  [key: string]: User
}

const users: UsersDatabase = {}

// Load users from localStorage on initial load (to persist between page refreshes)
const loadUsersFromStorage = () => {
  if (typeof window !== 'undefined') {
    const savedUsers = localStorage.getItem('users')
    if (savedUsers) {
      const parsedUsers = JSON.parse(savedUsers)
      Object.assign(users, parsedUsers)
    }
  }
}

// Save users to localStorage
const saveUsersToStorage = () => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('users', JSON.stringify(users))
  }
}

// Initialize by loading saved users
loadUsersFromStorage()

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check for saved user session on load
  useEffect(() => {
    const savedUserId = localStorage.getItem('userId')
    if (savedUserId && users[savedUserId]) {
      setUser(users[savedUserId])
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Find user by email (in real app, check password too)
    const foundUser = Object.values(users).find(u => u.email === email)
    
    if (foundUser) {
      setUser(foundUser)
      localStorage.setItem('userId', foundUser.id)
      return true
    }
    return false
  }

  const register = async (name: string, email: string, password: string) => {
    // Check if user already exists
    const existingUser = Object.values(users).find(u => u.email === email)
    if (existingUser) {
      return false
    }

    // Create new user
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      balance: 50000 // Welcome bonus UGX 50,000
    }
    
    // Save to mock database
    users[newUser.id] = newUser
    saveUsersToStorage()
    
    // Log the user in
    setUser(newUser)
    localStorage.setItem('userId', newUser.id)
    return true
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('userId')
  }

  const updateUserBalance = (newBalance: number) => {
    if (user) {
      const updatedUser = { ...user, balance: newBalance }
      setUser(updatedUser)
      users[user.id] = updatedUser
      saveUsersToStorage()
      localStorage.setItem('userId', updatedUser.id)
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUserBalance }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}