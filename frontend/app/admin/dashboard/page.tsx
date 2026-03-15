'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function DashboardPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    users: 1247,
    bets: 3456,
    matches: 89,
    revenue: 12500000,
    liveMatches: 12,
    todayBets: 234,
    pendingWithdrawals: 8,
    newUsers: 45
  })

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (!auth) {
      router.push('/admin/login')
    } else {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F59E0B] mx-auto"></div>
          <p className="text-gray-600 mt-4">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#1A1A2E] text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold">
                <span className="text-[#F59E0B]">bet</span>Pawa Admin
              </h1>
              <span className="bg-green-500 text-xs px-2 py-1 rounded-full">Live</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-sm text-gray-300">Online</span>
              </div>
              <span className="text-sm text-gray-300">Welcome, Admin</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition flex items-center gap-2"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - UPDATED with correct /admin/ links */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <Link 
              href="/admin/dashboard" 
              className="py-4 px-2 text-[#F59E0B] border-b-2 border-[#F59E0B] font-medium flex items-center gap-2"
            >
              <span>📊</span> Dashboard
            </Link>
            <Link 
              href="/admin/matches" 
              className="py-4 px-2 text-gray-600 hover:text-[#F59E0B] transition flex items-center gap-2"
            >
              <span>⚽</span> Matches
            </Link>
            <Link 
              href="/admin/bets" 
              className="py-4 px-2 text-gray-600 hover:text-[#F59E0B] transition flex items-center gap-2"
            >
              <span>🎲</span> Bets
            </Link>
            <Link 
              href="/admin/users" 
              className="py-4 px-2 text-gray-600 hover:text-[#F59E0B] transition flex items-center gap-2"
            >
              <span>👥</span> Users
            </Link>
            <Link 
              href="/" 
              className="py-4 px-2 text-gray-600 hover:text-[#F59E0B] transition flex items-center gap-2"
              target="_blank"
            >
              <span>🌐</span> View Site
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-amber-100 to-amber-200 p-6 rounded-lg shadow-lg mb-8 border border-amber-300">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">Welcome back, Admin! 👋</h2>
          <p className="text-gray-700">Here's what's happening with your platform today.</p>
        </div>

        {/* Stats Grid - Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <span className="text-2xl">👥</span>
              </div>
              <span className="text-green-500 text-sm bg-green-100 px-2 py-1 rounded">↑ 12%</span>
            </div>
            <h3 className="text-gray-500 text-sm mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.users.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-2">{stats.newUsers} new this week</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-2xl">🎲</span>
              </div>
              <span className="text-green-500 text-sm bg-green-100 px-2 py-1 rounded">↑ 8%</span>
            </div>
            <h3 className="text-gray-500 text-sm mb-1">Total Bets</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.bets.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-2">{stats.todayBets} placed today</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <span className="text-2xl">⚽</span>
              </div>
              <span className="text-yellow-500 text-sm bg-yellow-100 px-2 py-1 rounded">Live</span>
            </div>
            <h3 className="text-gray-500 text-sm mb-1">Active Matches</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.matches}</p>
            <p className="text-gray-400 text-sm mt-2">{stats.liveMatches} in play now</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-100 p-3 rounded-full">
                <span className="text-2xl">💰</span>
              </div>
              <span className="text-green-500 text-sm bg-green-100 px-2 py-1 rounded">↑ 15%</span>
            </div>
            <h3 className="text-gray-500 text-sm mb-1">Revenue (UGX)</h3>
            <p className="text-3xl font-bold text-gray-800">{stats.revenue.toLocaleString()}</p>
            <p className="text-gray-400 text-sm mt-2">This month</p>
          </div>
        </div>

        {/* Stats Grid - Bottom Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <span className="text-xl">⏳</span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Pending Withdrawals</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.pendingWithdrawals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="bg-yellow-100 p-3 rounded-full">
                <span className="text-xl">⚡</span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Live Matches</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.liveMatches}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm">Conversion Rate</h3>
                <p className="text-2xl font-bold text-gray-800">68%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <div>
                  <p className="font-medium">New user registered</p>
                  <p className="text-sm text-gray-500">john.doe@example.com</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">2 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <div>
                  <p className="font-medium">Bet placed: UGX 50,000</p>
                  <p className="text-sm text-gray-500">Real Madrid vs Man City</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">5 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                <div>
                  <p className="font-medium">Odds updated</p>
                  <p className="text-sm text-gray-500">Leverkusen vs Arsenal</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">12 min ago</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                <div>
                  <p className="font-medium">Withdrawal request</p>
                  <p className="text-sm text-gray-500">UGX 200,000 - Pending</p>
                </div>
              </div>
              <span className="text-xs text-gray-400">15 min ago</span>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 bg-green-50 rounded-lg flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <div>
                <p className="font-medium text-green-700">Server</p>
                <p className="text-sm text-gray-600">Operational</p>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <div>
                <p className="font-medium text-green-700">Database</p>
                <p className="text-sm text-gray-600">Connected</p>
              </div>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg flex items-center gap-3">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              <div>
                <p className="font-medium text-yellow-700">API</p>
                <p className="text-sm text-gray-600">95% uptime</p>
              </div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg flex items-center gap-3">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              <div>
                <p className="font-medium text-green-700">Cache</p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}