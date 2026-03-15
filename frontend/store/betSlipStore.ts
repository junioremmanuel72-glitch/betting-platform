import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { betsAPI } from '@/lib/api'

interface Bet {
  id: string
  matchId: string
  homeTeam: string
  awayTeam: string
  selection: 'HOME' | 'DRAW' | 'AWAY'
  odds: number
  stake?: number
}

interface BetSlipStore {
  bets: Bet[]
  addBet: (bet: Bet) => void
  removeBet: (matchId: string) => void
  clearBets: () => void
  placeBets: (stake: number) => Promise<any>
}

export const useBetSlipStore = create<BetSlipStore>()(
  persist(
    (set, get) => ({
      bets: [],
      
      addBet: (bet) => set((state) => {
        // Check if bet already exists for this match
        const exists = state.bets.find(b => b.matchId === bet.matchId)
        if (exists) {
          // Replace existing bet
          return {
            bets: state.bets.map(b => 
              b.matchId === bet.matchId ? bet : b
            )
          }
        }
        // Add new bet
        return { bets: [...state.bets, bet] }
      }),
      
      removeBet: (matchId) => set((state) => ({
        bets: state.bets.filter(b => b.matchId !== matchId)
      })),
      
      clearBets: () => set({ bets: [] }),
      
      placeBets: async (stake: number) => {
        const { bets } = get()
        
        if (bets.length === 0) {
          return { 
            success: false, 
            message: 'No bets in slip' 
          }
        }

        try {
          // For now, place the first bet
          const bet = bets[0]
          
          const result = await betsAPI.placeBet(
            bet.matchId, 
            bet.selection, 
            stake
          )
          
          if (result.success) {
            // Clear bet slip on successful bet
            set({ bets: [] })
            
            return {
              success: true,
              message: 'Bet placed successfully',
              newBalance: result.newBalance,
              bet: result.bet
            }
          } else {
            return {
              success: false,
              message: result.message || 'Failed to place bet'
            }
          }
        } catch (error: any) {
          console.error('Error placing bet:', error)
          return {
            success: false,
            message: error.message || 'Network error'
          }
        }
      }
    }),
    {
      name: 'bet-slip-storage',
    }
  )
)