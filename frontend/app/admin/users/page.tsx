'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function UsersPage() {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const [users] = useState([
    { 
      id: 'USR001', 
      name: 'John Doe', 
      email: 'john.doe@example.com',
      phone: '+256 701 234 567',
      balance: 125000,
      bets: 45,
      won: 23,
      status: 'active',
      joined: '2026-01-15',
      role: 'user',
      lastActive: '2026-03-14 10:30'
    },
    { 
      id: 'USR002', 
      name: 'Sarah Smith', 
      email: 'sarah.smith@example.com',
      phone: '+256 702 345 678',
      balance: 50000,
      bets: 28,
      won: 12,
      status: 'active',
      joined: '2026-02-01',
      role: 'user',
      lastActive: '2026-03-14 09:15'
    },
    { 
      id: 'USR003', 
      name: 'Mike Johnson', 
      email: 'mike.j@example.com',
      phone: '+256 703 456 789',
      balance: 7500,
      bets: 12,
      won: 4,
      status: 'suspended',
      joined: '2026-02-15',
      role: 'user',
      lastActive: '2026-03-10 15:20'
    },
    { 
      id: 'USR004', 
      name: 'Emma Wilson', 
      email: 'emma.w@example.com',
      phone: '+256 704 567 890',
      balance: 250000,
      bets: 89,
      won: 45,
      status: 'active',
      joined: '2026-01-05',
      role: 'vip',
      lastActive: '2026-03-14 11:45'
    },
    { 
      id: 'USR005', 
      name: 'Admin User', 
      email: 'admin@betpawa.com',
      phone: '+256 705 678 901',
      balance: 0,
      bets: 0,
      won: 0,
      status: 'active',
      joined: '2026-01-01',
      role: 'admin',
      lastActive: '2026-03-14 12:00'
    },
  ])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/admin/login') // FIXED: changed from /admin/login
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      case 'banned': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'admin': return 'bg-purple-100 text-purple-800'
      case 'vip': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-blue-100 text-blue-800'
    }
  }

  const filteredUsers = users
    .filter(user => selectedRole === 'all' || user.role === selectedRole)
    .filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    )

  const activeUsers = users.filter(u => u.status === 'active').length
  const totalBalance = users.reduce((sum, user) => sum + user.balance, 0)
  const totalBets = users.reduce((sum, user) => sum + user.bets, 0)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#1A1A2E] text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-[#F59E0B]">bet</span>Pawa Admin
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation - UPDATED with correct /admin/ links */}
      <div className="bg-white shadow">
        <div className="container mx-auto">
          <div className="flex gap-6 p-4">
            <a href="/admin/dashboard" className="text-gray-600 hover:text-[#F59E0B] transition">Dashboard</a>
            <a href="/admin/matches" className="text-gray-600 hover:text-[#F59E0B] transition">Matches</a>
            <a href="/admin/bets" className="text-gray-600 hover:text-[#F59E0B] transition">Bets</a>
            <a href="/admin/users" className="text-[#F59E0B] font-semibold border-b-2 border-[#F59E0B]">Users</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Users Management</h1>
            <p className="text-gray-600 mt-1">View and manage all users on the platform</p>
          </div>
          <button className="bg-[#F59E0B] hover:bg-[#d48806] text-white px-4 py-2 rounded transition">
            + Add New User
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-bold">{users.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Active Users</p>
            <p className="text-2xl font-bold">{activeUsers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Balance</p>
            <p className="text-2xl font-bold">UGX {totalBalance.toLocaleString()}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Bets</p>
            <p className="text-2xl font-bold">{totalBets}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-4 flex-wrap items-center">
            <input
              type="text"
              placeholder="Search by name, email or ID..."
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F59E0B]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className="border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F59E0B]"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="all">All Roles</option>
              <option value="user">Regular Users</option>
              <option value="vip">VIP Users</option>
              <option value="admin">Admins</option>
            </select>
            <button className="bg-gray-100 px-4 py-2 rounded hover:bg-gray-200">
              Export CSV
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Balance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Stats</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.id}</div>
                    <div className="text-xs text-gray-400">Joined: {user.joined}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">{user.email}</div>
                    <div className="text-sm text-gray-500">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-green-600">UGX {user.balance.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">Bets: {user.bets}</div>
                    <div className="text-sm">Won: {user.won}</div>
                    <div className="text-xs text-gray-500">Win rate: {Math.round((user.won / user.bets) * 100) || 0}%</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${getRoleBadge(user.role)}`}>
                      {user.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                    <div className="text-xs text-gray-400 mt-1">
                      Last: {user.lastActive}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700 text-sm">View</button>
                      <button className="text-green-500 hover:text-green-700 text-sm">Edit</button>
                      {user.status === 'active' ? (
                        <button className="text-red-500 hover:text-red-700 text-sm">Suspend</button>
                      ) : (
                        <button className="text-green-500 hover:text-green-700 text-sm">Activate</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600">Showing 1-5 of 45 users</p>
          <div className="flex gap-2">
            <button className="bg-white border rounded-lg px-4 py-2 hover:bg-gray-50">Previous</button>
            <button className="bg-[#F59E0B] text-white px-4 py-2 rounded-lg">1</button>
            <button className="bg-white border rounded-lg px-4 py-2 hover:bg-gray-50">2</button>
            <button className="bg-white border rounded-lg px-4 py-2 hover:bg-gray-50">3</button>
            <button className="bg-white border rounded-lg px-4 py-2 hover:bg-gray-50">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}