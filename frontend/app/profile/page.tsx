'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  User, Mail, Calendar, Trophy, TrendingUp,
  Clock, CheckCircle, XCircle, Wallet,
  Settings, LogOut, Award, Target,
  Activity, DollarSign, ArrowUp, ArrowDown
} from 'lucide-react'

export default function ProfilePage() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const [userBets, setUserBets] = useState([])

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    // Load user's bet history
    const bets = JSON.parse(localStorage.getItem('bet-history-storage') || '{"state":{"bets":[]}}')
    const userBetsFiltered = bets.state?.bets?.filter((bet: any) => bet.userId === user.id) || []
    setUserBets(userBetsFiltered)
  }, [user, router])

  if (!user) return null

  // Calculate stats
  const totalBets = userBets.length
  const wonBets = userBets.filter((b: any) => b.status === 'won').length
  const lostBets = userBets.filter((b: any) => b.status === 'lost').length
  const pendingBets = userBets.filter((b: any) => b.status === 'pending').length
  const winRate = totalBets > 0 ? Math.round((wonBets / totalBets) * 100) : 0
  const totalStaked = userBets.reduce((acc: number, b: any) => acc + (b.stake || 0), 0)
  const totalWon = userBets
    .filter((b: any) => b.status === 'won')
    .reduce((acc: number, b: any) => acc + (b.actualWin || 0), 0)
  const profit = totalWon - totalStaked

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold">
              {user.name[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Mail size={14} />
                {user.email}
              </p>
              <p className="text-gray-500 flex items-center gap-2 mt-1">
                <Calendar size={14} />
                Member since {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Balance</p>
              <p className="text-3xl font-bold text-gray-900">UGX {user.balance.toLocaleString()}</p>
              <button className="mt-2 text-sm text-purple-600 hover:text-purple-700 font-medium">
                + Deposit
              </button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Trophy className="text-blue-600" size={20} />
              </div>
              <span className="text-sm text-gray-500">Total Bets</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{totalBets}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={20} />
              </div>
              <span className="text-sm text-gray-500">Won</span>
            </div>
            <p className="text-2xl font-bold text-green-600">{wonBets}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="text-red-600" size={20} />
              </div>
              <span className="text-sm text-gray-500">Lost</span>
            </div>
            <p className="text-2xl font-bold text-red-600">{lostBets}</p>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="text-purple-600" size={20} />
              </div>
              <span className="text-sm text-gray-500">Win Rate</span>
            </div>
            <p className="text-2xl font-bold text-purple-600">{winRate}%</p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Staked</span>
                <span className="font-semibold text-gray-900">UGX {totalStaked.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Won</span>
                <span className="font-semibold text-green-600">UGX {totalWon.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-600">Net Profit/Loss</span>
                <span className={`font-bold text-lg ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {profit >= 0 ? '+' : ''}{profit.toLocaleString()} UGX
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-4">Performance</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Win Rate</span>
                  <span className="font-medium">{winRate}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: `${winRate}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Pending Bets</span>
                  <span className="font-medium">{pendingBets}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-500" style={{ width: `${(pendingBets / totalBets) * 100 || 0}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bets */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b">
            <h3 className="font-semibold text-gray-900">Recent Betting Activity</h3>
          </div>
          <div className="overflow-x-auto">
            {userBets.length === 0 ? (
              <div className="text-center py-12">
                <Activity size={48} className="mx-auto text-gray-300 mb-3" />
                <p className="text-gray-500">No bets placed yet</p>
                <button 
                  onClick={() => router.push('/')}
                  className="mt-4 text-purple-600 hover:text-purple-700 font-medium"
                >
                  Start Betting →
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Match</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stake</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Odds</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Potential</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {userBets.slice(0, 5).map((bet: any) => (
                    <tr key={bet.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{bet.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{bet.matches}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">UGX {bet.stake.toLocaleString()}</td>
                      <td className="px-6 py-4 text-sm text-purple-600 font-medium">{bet.odds.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-green-600">UGX {bet.potentialWin.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          bet.status === 'won' ? 'bg-green-100 text-green-700' :
                          bet.status === 'lost' ? 'bg-red-100 text-red-700' :
                          'bg-yellow-100 text-yellow-700'
                        }`}>
                          {bet.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
          {userBets.length > 5 && (
            <div className="p-4 border-t text-center">
              <button className="text-purple-600 hover:text-purple-700 text-sm font-medium">
                View All Bets →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}