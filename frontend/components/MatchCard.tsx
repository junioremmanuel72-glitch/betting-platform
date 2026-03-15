'use client'

import { useBetSlipStore } from '@/store/betSlipStore'

interface MatchCardProps {
  match: {
    id: string
    homeTeam: string
    awayTeam: string
    league: string
    startTime: string
    homeOdds: number
    drawOdds: number
    awayOdds: number
    status: string
  }
}

export default function MatchCard({ match }: MatchCardProps) {
  const addBet = useBetSlipStore((state) => state.addBet)

  const handleAddBet = (selection: 'HOME' | 'DRAW' | 'AWAY', odds: number) => {
    const bet = {
      id: `${match.id}-${selection}`,
      matchId: match.id,
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      selection: selection,
      odds: odds
    }
    
    console.log('Adding bet:', bet) // Debug log
    addBet(bet)
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <span>{new Date(match.startTime).toLocaleString()}</span>
        <span className="text-xs">{match.league}</span>
      </div>

      <div className="mb-3">
        <div className="font-medium">{match.homeTeam}</div>
        <div className="font-medium">{match.awayTeam}</div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => handleAddBet('HOME', match.homeOdds)}
          className="bg-gray-50 hover:bg-purple-50 border rounded p-2 text-center transition"
        >
          <div className="text-sm font-bold text-[#6B46C1]">{match.homeOdds}</div>
          <div className="text-xs text-gray-500">1</div>
        </button>
        <button
          onClick={() => handleAddBet('DRAW', match.drawOdds)}
          className="bg-gray-50 hover:bg-purple-50 border rounded p-2 text-center transition"
        >
          <div className="text-sm font-bold text-[#6B46C1]">{match.drawOdds}</div>
          <div className="text-xs text-gray-500">X</div>
        </button>
        <button
          onClick={() => handleAddBet('AWAY', match.awayOdds)}
          className="bg-gray-50 hover:bg-purple-50 border rounded p-2 text-center transition"
        >
          <div className="text-sm font-bold text-[#6B46C1]">{match.awayOdds}</div>
          <div className="text-xs text-gray-500">2</div>
        </button>
      </div>
    </div>
  )
}