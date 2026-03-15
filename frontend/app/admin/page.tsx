'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    users: 1247,
    bets: 3456,
    matches: 89,
    revenue: 12500000,
    liveMatches: 12,
    todayBets: 234
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading admin panel...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Header */}
      <div className="bg-[#1A1A2E] text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold">
              <span className="text-[#F59E0B]">bet</span>Pawa Admin
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-300">Welcome, Admin</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex space-x-8">
            <a 
              href="/admin-new" 
              className="py-4 px-2 text-[#F59E0B] border-b-2 border-[#F59E0B] font-medium"
            >
              Dashboard
            </a>
            <a 
              href="/admin/matches" 
              className="py-4 px-2 text-gray-600 hover:text-[#F59E0B] transition"
            >
              Matches
            </a>
            <a 
              href="/admin/bets" 
              className="py-4 px-2 text-gray-600 hover:text-[#F59E0B] transition"
            >
              Bets
            </a>
            <a 
              href="/admin/users" 
              className="py-4 px-2 text-gray-600 hover:text-[#F59E0B] transition"
            >
              Users
            </a>
            <a 
              href="/" 
              className="py-4 px-2 text-gray-600 hover:text-[#F59E0B] transition"
              target="_blank"
            >
              View Site
            </a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm">Total Users</h3>
              <span className="bg-blue-100 text-blue-600 p-2 rounded-full">👥</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.users.toLocaleString()}</p>
            <p className="text-green-500 text-sm mt-2">↑ 12% this week</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm">Total Bets</h3>
              <span className="bg-green-100 text-green-600 p-2 rounded-full">🎲</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.bets.toLocaleString()}</p>
            <p className="text-green-500 text-sm mt-2">↑ 8% this week</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm">Active Matches</h3>
              <span className="bg-purple-100 text-purple-600 p-2 rounded-full">⚽</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.matches}</p>
            <p className="text-yellow-500 text-sm mt-2">{stats.liveMatches} live now</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-gray-500 text-sm">Revenue (UGX)</h3>
              <span className="bg-orange-100 text-orange-600 p-2 rounded-full">💰</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{stats.revenue.toLocaleString()}</p>
            <p className="text-green-500 text-sm mt-2">↑ 15% this month</p>
          </div>
        </div>

        {/* Quick Access Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full bg-[#F59E0B] hover:bg-[#d48806] text-white py-2 px-4 rounded transition">
                + Add New Match
              </button>
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
                📊 Update Odds
              </button>
              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition">
                📋 View All Bets
              </button>
              <button className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition">
                👥 Manage Users
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="font-medium">New user registered</p>
                  <p className="text-sm text-gray-500">johndoe@example.com</p>
                </div>
                <span className="text-xs text-gray-400">2 min ago</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="font-medium">Bet placed: UGX 50,000</p>
                  <p className="text-sm text-gray-500">Real Madrid vs Man City</p>
                </div>
                <span className="text-xs text-gray-400">5 min ago</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b">
                <div>
                  <p className="font-medium">Match updated: Leverkusen vs Arsenal</p>
                  <p className="text-sm text-gray-500">Odds changed</p>
                </div>
                <span className="text-xs text-gray-400">12 min ago</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Withdrawal request: UGX 200,000</p>
                  <p className="text-sm text-gray-500">Pending approval</p>
                </div>
                <span className="text-xs text-gray-400">15 min ago</span>
              </div>
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">System Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-green-600 font-medium">✅ Server Status</p>
              <p className="text-sm text-gray-600">All systems operational</p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-600 font-medium">📊 Today's Bets</p>
              <p className="text-sm text-gray-600">{stats.todayBets} bets placed</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-600 font-medium">⚡ Live Now</p>
              <p className="text-sm text-gray-600">{stats.liveMatches} active matches</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}