'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import { useBetSlipStore } from '@/store/betSlipStore'
import { useAuthStore } from '@/store/authStore'
import { userAPI } from '@/lib/api'

// Stake limits
const MIN_STAKE = 1000;
const MAX_STAKE = 5000000;

export default function BetSlip() {
  const [stake, setStake] = useState('')
  const [placing, setPlacing] = useState(false)
  const [message, setMessage] = useState('')
  const { bets, removeBet, clearBets, placeBets } = useBetSlipStore()
  const { updateBalance, user } = useAuthStore()
  
  const totalOdds = bets.reduce((acc, bet) => acc * bet.odds, 1)
  const potentialWin = stake ? parseFloat(stake) * totalOdds : 0

  const handlePlaceBet = async () => {
    const stakeValue = parseFloat(stake);
    
    // Validation
    if (!stake || isNaN(stakeValue) || stakeValue <= 0) {
      setMessage('Please enter a valid stake')
      return
    }

    if (stakeValue < MIN_STAKE) {
      setMessage(`Minimum stake is UGX ${MIN_STAKE.toLocaleString()}`)
      return
    }

    if (stakeValue > MAX_STAKE) {
      setMessage(`Maximum stake is UGX ${MAX_STAKE.toLocaleString()}`)
      return
    }

    if (user && stakeValue > user.balance) {
      setMessage(`Insufficient balance. Your balance: UGX ${user.balance.toLocaleString()}`)
      return
    }
    
    setPlacing(true)
    setMessage('')
    
    try {
      console.log('Placing bet with stake:', stakeValue);
      const result = await placeBets(stakeValue)
      
      console.log('Bet result:', result);
      
      if (result.success) {
        setMessage(`✅ Bet placed successfully! New balance: UGX ${result.newBalance.toLocaleString()}`)
        setStake('')
        
        // Refresh user data to update balance in header
        const profileData = await userAPI.getProfile()
        console.log('Profile after bet:', profileData);
        
        if (profileData.success) {
          updateBalance(profileData.user.balance)
        }
      } else {
        setMessage(`❌ Error: ${result.message}`)
      }
    } catch (error) {
      console.error('Bet error:', error);
      // Handle unknown error type
      const errorMessage = error instanceof Error ? error.message : String(error);
      setMessage(`❌ Error: ${errorMessage}`)
    } finally {
      setPlacing(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow sticky top-4">
      {/* Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <h3 className="font-bold text-lg">Bet Slip</h3>
        {bets.length > 0 && (
          <button 
            onClick={clearBets}
            className="text-sm text-red-500 hover:text-red-600"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mx-4 mt-4 p-3 rounded text-sm ${
          message.includes('✅') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}

      {/* Stake Limits Info */}
      {bets.length > 0 && (
        <div className="mx-4 mt-4 text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <p>Min Stake: UGX {MIN_STAKE.toLocaleString()}</p>
          <p>Max Stake: UGX {MAX_STAKE.toLocaleString()}</p>
        </div>
      )}

      {/* Bets or Empty State */}
      <div className="p-4 min-h-[200px]">
        {bets.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">Betslip is empty</p>
            <p className="text-sm text-gray-400">
              Click on odds to add bets
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {bets.map((bet) => (
              <div key={bet.matchId} className="flex justify-between items-start border-b pb-2">
                <div className="flex-1">
                  <p className="text-sm font-medium">{bet.homeTeam} vs {bet.awayTeam}</p>
                  <p className="text-xs text-gray-500">
                    {bet.selection === 'HOME' && 'Home'}
                    {bet.selection === 'DRAW' && 'Draw'}
                    {bet.selection === 'AWAY' && 'Away'}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-[#F59E0B]">{bet.odds}</span>
                  <button 
                    onClick={() => removeBet(bet.matchId)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}

            {/* Total Odds */}
            <div className="flex justify-between text-sm pt-2">
              <span className="text-gray-600">Total Odds:</span>
              <span className="font-bold">{totalOdds.toFixed(2)}</span>
            </div>

            {/* Stake Input */}
            <div className="pt-3">
              <label className="text-sm text-gray-600 block mb-1">
                Stake (UGX)
              </label>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(e.target.value)}
                placeholder={`Min ${MIN_STAKE.toLocaleString()}`}
                className="w-full border rounded p-2 text-sm"
                min={MIN_STAKE}
                max={MAX_STAKE}
                step="1000"
              />
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setStake(MIN_STAKE.toString())}
                  className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                >
                  Min
                </button>
                <button
                  onClick={() => setStake(MAX_STAKE.toString())}
                  className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-gray-200"
                >
                  Max
                </button>
              </div>
            </div>

            {/* Potential Win */}
            {stake && parseFloat(stake) >= MIN_STAKE && (
              <div className="bg-green-50 p-3 rounded">
                <p className="text-sm text-gray-600">Potential Win:</p>
                <p className="text-lg font-bold text-green-600">
                  UGX {potentialWin.toFixed(2).toLocaleString()}
                </p>
              </div>
            )}

            {/* Stake Warning if below minimum */}
            {stake && parseFloat(stake) < MIN_STAKE && parseFloat(stake) > 0 && (
              <div className="bg-yellow-50 p-2 rounded text-xs text-yellow-700">
                Minimum stake is UGX {MIN_STAKE.toLocaleString()}
              </div>
            )}

            {/* Place Bet Button */}
            <button
              onClick={handlePlaceBet}
              disabled={Boolean(
                !stake || 
                parseFloat(stake) < MIN_STAKE || 
                parseFloat(stake) > MAX_STAKE || 
                placing || 
                bets.length === 0 || 
                (user && parseFloat(stake) > user.balance)
              )}
              className="w-full bg-[#F59E0B] text-white py-3 rounded font-medium 
                       hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center gap-2"
            >
              {placing ? (
                <>
                  <span className="animate-spin">⚪</span>
                  Placing Bet...
                </>
              ) : (
                'Place Bet'
              )}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 bg-gray-50 rounded-b-lg text-center text-sm text-gray-500">
        Min Stake: UGX {MIN_STAKE.toLocaleString()} | Max Stake: UGX {MAX_STAKE.toLocaleString()}
      </div>
    </div>
  )
}