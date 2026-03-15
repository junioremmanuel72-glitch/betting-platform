'use client'

import { X, CheckCircle } from 'lucide-react'

interface BetConfirmationProps {
  isOpen: boolean
  onClose: () => void
  betDetails: {
    selections: number
    totalOdds: number
    stake: number
    potentialWin: number
  }
}

export default function BetConfirmation({ isOpen, onClose, betDetails }: BetConfirmationProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="text-green-500" size={24} />
            <h3 className="text-xl font-bold">Bet Confirmed!</h3>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={20} />
          </button>
        </div>
        
        <div className="bg-green-50 p-4 rounded-lg mb-4">
          <p className="text-green-700 font-medium">Your bet has been placed successfully!</p>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">Selections:</span>
            <span className="font-medium">{betDetails.selections}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Total Odds:</span>
            <span className="font-bold text-[#6B46C1]">{betDetails.totalOdds.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Stake:</span>
            <span className="font-medium">UGX {betDetails.stake.toLocaleString()}</span>
          </div>
          <div className="flex justify-between border-t pt-2">
            <span className="text-gray-600">Potential Win:</span>
            <span className="text-xl font-bold text-green-600">
              UGX {betDetails.potentialWin.toLocaleString()}
            </span>
          </div>
        </div>
        
        <button
          onClick={onClose}
          className="w-full bg-[#6B46C1] text-white py-3 rounded font-medium hover:bg-purple-700"
        >
          Continue
        </button>
      </div>
    </div>
  )
}