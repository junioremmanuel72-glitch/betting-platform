'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function BetsPage() {
  const router = useRouter()
  const [selectedFilter, setSelectedFilter] = useState('all')
  
  const [bets] = useState([
    { id: 'BET001', user: 'john123', amount: 5000, odds: 2.45, match: 'Bayer Leverkusen vs Arsenal', selection: 'Home Win', status: 'pending', date: '2026-03-14' },
    { id: 'BET002', user: 'sarah456', amount: 10000, odds: 3.78, match: 'Real Madrid vs Man City', selection: 'Draw', status: 'won', date: '2026-03-14' },
    { id: 'BET003', user: 'mike789', amount: 25000, odds: 1.57, match: 'PSG vs Chelsea', selection: 'Away Win', status: 'lost', date: '2026-03-14' },
    { id: 'BET004', user: 'emma234', amount: 15000, odds: 6.38, match: 'Bayer Leverkusen vs Arsenal', selection: 'Home Win', status: 'cashed', date: '2026-03-14' },
    { id: 'BET005', user: 'peter567', amount: 8000, odds: 2.04, match: 'Real Madrid vs Man City', selection: 'Away Win', status: 'pending', date: '2026-03-14' },
  ])

  const handleLogout = () => {
    localStorage.removeItem('adminAuth')
    router.push('/admin/login') // FIXED: changed from /admin/login
  }

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'won': return 'bg-green-100 text-green-800'
      case 'lost': return 'bg-red-100 text-red-800'
      case 'cashed': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const filteredBets = selectedFilter === 'all' ? bets : bets.filter(bet => bet.status === selectedFilter)

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
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

      {/* Admin Navigation - UPDATED with correct /admin/ links */}
      <div className="bg-white shadow">
        <div className="container mx-auto">
          <div className="flex gap-6 p-4">
            <a href="/admin/dashboard" className="text-gray-600 hover:text-[#F59E0B] transition">Dashboard</a>
            <a href="/admin/matches" className="text-gray-600 hover:text-[#F59E0B] transition">Matches</a>
            <a href="/admin/bets" className="text-[#F59E0B] font-semibold border-b-2 border-[#F59E0B]">Bets</a>
            <a href="/admin/users" className="text-gray-600 hover:text-[#F59E0B] transition">Users</a>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Bets</h1>
            <p className="text-gray-600 mt-1">View and manage all bets placed on the platform</p>
          </div>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
            Export Report
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Bets</p>
            <p className="text-2xl font-bold">{bets.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Pending</p>
            <p className="text-2xl font-bold">{bets.filter(b => b.status === 'pending').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Won</p>
            <p className="text-2xl font-bold">{bets.filter(b => b.status === 'won').length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Lost</p>
            <p className="text-2xl font-bold">{bets.filter(b => b.status === 'lost').length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex gap-2">
            <button 
              onClick={() => setSelectedFilter('all')}
              className={`px-4 py-2 rounded-lg ${selectedFilter === 'all' ? 'bg-[#F59E0B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              All
            </button>
            <button 
              onClick={() => setSelectedFilter('pending')}
              className={`px-4 py-2 rounded-lg ${selectedFilter === 'pending' ? 'bg-[#F59E0B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Pending
            </button>
            <button 
              onClick={() => setSelectedFilter('won')}
              className={`px-4 py-2 rounded-lg ${selectedFilter === 'won' ? 'bg-[#F59E0B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Won
            </button>
            <button 
              onClick={() => setSelectedFilter('lost')}
              className={`px-4 py-2 rounded-lg ${selectedFilter === 'lost' ? 'bg-[#F59E0B] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Lost
            </button>
          </div>
        </div>

        {/* Bets Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Bet ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Match</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Selection</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Odds</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredBets.map(bet => (
                <tr key={bet.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 font-mono text-sm">{bet.id}</td>
                  <td className="px-6 py-4">{bet.user}</td>
                  <td className="px-6 py-4">{bet.match}</td>
                  <td className="px-6 py-4">{bet.selection}</td>
                  <td className="px-6 py-4">UGX {bet.amount.toLocaleString()}</td>
                  <td className="px-6 py-4 font-mono">{bet.odds}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusColor(bet.status)}`}>
                      {bet.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-blue-500 hover:text-blue-700 text-sm mr-3">View</button>
                    {bet.status === 'pending' && (
                      <button className="text-green-500 hover:text-green-700 text-sm">Settle</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <p className="text-gray-600">Showing 1-5 of {bets.length} bets</p>
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