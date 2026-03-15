'use client'

import { createContext, useContext, useState, useEffect } from 'react'

interface AdminUser {
  id: string
  username: string
  isAdmin: boolean
}

interface AdminContextType {
  admin: AdminUser | null
  adminLogin: (username: string, password: string) => Promise<boolean>
  adminLogout: () => void
  isAdminLoading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

// Mock admin credentials
const ADMIN_USERNAME = 'admin'
const ADMIN_PASSWORD = 'admin123'

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null)
  const [isAdminLoading, setIsAdminLoading] = useState(true)

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin')
    if (savedAdmin) {
      setAdmin(JSON.parse(savedAdmin))
    }
    setIsAdminLoading(false)
  }, [])

  const adminLogin = async (username: string, password: string) => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const adminUser = {
        id: 'admin1',
        username,
        isAdmin: true
      }
      setAdmin(adminUser)
      localStorage.setItem('admin', JSON.stringify(adminUser))
      return true
    }
    return false
  }

  const adminLogout = () => {
    setAdmin(null)
    localStorage.removeItem('admin')
  }

  return (
    <AdminContext.Provider value={{ admin, adminLogin, adminLogout, isAdminLoading }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}