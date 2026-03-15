'use client'

import { useState, useEffect } from 'react'
import MatchCard from './MatchCard'
import { useBetHistoryStore } from '@/store/betHistoryStore'
import { useAuth } from '@/context/AuthContext'
import { History, CheckCircle, XCircle, Clock, ChevronDown } from 'lucide-react'

interface Match {
  id: number
  time: string
  homeTeam: string
  awayTeam: string
  league: string
  odds: {
    home: number
    draw: number
    away: number
  }
}

export default function MatchesList() {
  const [showHistory, setShowHistory] = useState(false)
  const { user } = useAuth()
  const { bets, getUserBets } = useBetHistoryStore()
  const [userBets, setUserBets] = useState<any[]>([])

  // Update user bets when user changes or bets are added
  useEffect(() => {
    if (user) {
      console.log('Current user:', user)
      const userBetsFiltered = bets.filter((bet: any) => bet.userId === user.id)
      console.log('Filtered bets:', userBetsFiltered)
      setUserBets(userBetsFiltered)
    } else {
      setUserBets([])
    }
  }, [user, bets])

  const matches: Match[] = [
    {
      id: 1,
      time: '8:45pm Wed 11/03',
      homeTeam: 'Bayer Leverkusen',
      awayTeam: 'Arsenal FC',
      league: 'UEFA Champions League',
      odds: {
        home: 6.38,
        draw: 4.64,
        away: 1.57
      }
    },
    {
      id: 2,
      time: '11:00 pm Wed 11/03',
      homeTeam: 'Real Madrid',
      awayTeam: 'Manchester City',
      league: 'UEFA Champions League',
      odds: {
        home: 3.78,
        draw: 3.92,
        away: 2.04
      }
    },
    {
      id: 3,
      time: '11:00 pm Wed 11/03',
      homeTeam: 'Paris Saint-Germain',
      awayTeam: 'Chelsea FC',
      league: 'UEFA Champions League',
      odds: {
        home: 2.10,
        draw: 3.40,
        away: 3.20
      }
    }
  ]

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'won':
        return (
          <div className="flex items-center gap-1 text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-medium">
            <CheckCircle size={12} />
            <span>WON</span>
          </div>
        )
      case 'lost':
        return (
          <div className="flex items-center gap-1 text-red-600 bg-red-100 px-2 py-1 rounded-full text-xs font-medium">
            <XCircle size={12} />
            <span>LOST</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-1 text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs font-medium">
            <Clock size={12} />
            <span>PENDING</span>
          </div>
        )
    }
  }

  // Calculate stats
  const totalBets = userBets.length
  const wonBets = userBets.filter(b => b.status === 'won').length
  const lostBets = userBets.filter(b => b.status === 'lost').length
  const pendingBets = userBets.filter(b => b.status === 'pending').length

  return (
    <div className="space-y-4">
      {/* Bet History Header - Only show if user is logged in */}
      {user && (
        <div className="bg-white rounded-lg shadow">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-2">
              <History size={18} className="text-[#6B46C1]" />
              <h3 className="font-bold text-lg">My Bet History</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {totalBets} {totalBets === 1 ? 'bet' : 'bets'}
              </span>
              <ChevronDown 
                size={18} 
                className={`text-gray-400 transition-transform ${showHistory ? 'rotate-180' : ''}`}
              />
            </div>
          </button>

          {/* Bet History Content - Only shows when showHistory is true */}
          {showHistory && (
            <div className="p-4 border-t">
              {userBets.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No bets placed yet</p>
                  <p className="text-sm mt-2">Click on odds to place your first bet!</p>
                </div>
              ) : (
                <>
                  {/* History List */}
                  <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                    {userBets.map((bet) => (
                      <div key={bet.id} className="border rounded-lg p-3 hover:shadow-sm transition">
                        {/* Top row: Date and Status */}
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-xs text-gray-500">{bet.date}</span>
                          {getStatusBadge(bet.status)}
                        </div>

                        {/* Match info */}
                        <p className="text-sm font-medium mb-2">{bet.matches}</p>

                        {/* Bet details */}
                        <div className="grid grid-cols-4 gap-2 text-xs mb-2">
                          <div>
                            <span className="text-gray-500">Selections:</span>
                            <span className="ml-1 font-medium">{bet.selections}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Odds:</span>
                            <span className="ml-1 font-bold text-[#6B46C1]">{bet.odds?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Stake:</span>
                            <span className="ml-1 font-medium">UGX {bet.stake?.toLocaleString() || '0'}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">Potential:</span>
                            <span className="ml-1 font-medium text-green-600">
                              UGX {bet.potentialWin?.toLocaleString() || '0'}
                            </span>
                          </div>
                        </div>

                        {/* Win amount if won */}
                        {bet.status === 'won' && bet.actualWin && (
                          <div className="bg-green-50 p-2 rounded text-sm flex justify-between items-center">
                            <span className="text-green-700 font-medium">You won:</span>
                            <span className="text-green-700 font-bold">UGX {bet.actualWin.toLocaleString()}</span>
                          </div>
                        )}

                        {/* Lost message if lost */}
                        {bet.status === 'lost' && (
                          <div className="bg-red-50 p-2 rounded text-sm text-red-600">
                            Better luck next time!
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Summary Stats */}
                  <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t">
                    <div className="text-center">
                      <div className="text-lg font-bold text-[#6B46C1]">{totalBets}</div>
                      <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{wonBets}</div>
                      <div className="text-xs text-gray-500">Won</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">{lostBets}</div>
                      <div className="text-xs text-gray-500">Lost</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">{pendingBets}</div>
                      <div className="text-xs text-gray-500">Pending</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      )}

      {/* Match Cards */}
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}

      {/* Learn More Button */}
      <button className="w-full bg-gray-100 text-gray-600 py-3 rounded-lg text-sm font-medium hover:bg-gray-200">
        LEARN HOW TO BET
      </button>

      {/* Discover More */}
      <div className="bg-white rounded-lg shadow p-4 text-center">
        <p className="text-gray-600 mb-2">Looking for more?</p>
        <button className="text-[#6B46C1] font-medium hover:underline">
          DISCOVER MORE SPORTS
        </button>
      </div>
    </div>
  )
}