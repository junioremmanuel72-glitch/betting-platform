import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface PlacedBet {
  id: string
  userId: string
  date: string
  matches: string
  selections: number
  stake: number
  odds: number
  potentialWin: number
  status: 'pending' | 'won' | 'lost'
  actualWin?: number
  betDetails: {
    matchId: number
    homeTeam: string
    awayTeam: string
    selection: '1' | 'X' | '2'
    odds: number
  }[]
}

interface BetHistoryStore {
  bets: PlacedBet[]
  addBet: (bet: Omit<PlacedBet, 'id' | 'date' | 'status'>) => void
  getUserBets: (userId: string) => PlacedBet[]
}

export const useBetHistoryStore = create<BetHistoryStore>()(
  persist(
    (set, get) => ({
      bets: [],
      
      addBet: (betData) => {
        console.log('addBet called with:', betData)
        
        if (!betData.userId) {
          console.error('Cannot add bet: missing userId')
          return
        }

        const newBet: PlacedBet = {
          id: Date.now().toString(),
          date: new Date().toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          status: 'pending',
          ...betData
        }
        
        console.log('Creating new bet:', newBet)
        
        set((state) => {
          console.log('Previous bets:', state.bets)
          const newBets = [newBet, ...state.bets]
          console.log('New bets array:', newBets)
          return { bets: newBets }
        })
      },
      
      getUserBets: (userId) => {
        const userBets = get().bets.filter(bet => bet.userId === userId)
        console.log(`getUserBets for ${userId}:`, userBets)
        return userBets
      }
    }),
    {
      name: 'bet-history-storage',
    }
  )
)