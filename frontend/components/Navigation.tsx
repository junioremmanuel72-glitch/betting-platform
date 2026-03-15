'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export default function Navigation() {
  const [activeTab, setActiveTab] = useState('sport')

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Navigation Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('sport')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'sport'
              ? 'text-[#6B46C1] border-b-2 border-[#6B46C1]'
              : 'text-gray-600'
          }`}
        >
          Sport
        </button>
        <button
          onClick={() => setActiveTab('virtuals')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'virtuals'
              ? 'text-[#6B46C1] border-b-2 border-[#6B46C1]'
              : 'text-gray-600'
          }`}
        >
          Virtuals
        </button>
        <button
          onClick={() => setActiveTab('live')}
          className={`flex-1 px-4 py-3 text-sm font-medium ${
            activeTab === 'live'
              ? 'text-[#6B46C1] border-b-2 border-[#6B46C1]'
              : 'text-gray-600'
          }`}
        >
          Live
        </button>
      </div>

      {/* Live Counts */}
      <div className="grid grid-cols-5 gap-1 p-3 bg-gray-50">
        <div className="text-center">
          <div className="text-lg font-bold text-[#6B46C1]">24</div>
          <div className="text-xs text-gray-600">Sport</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#6B46C1]">8</div>
          <div className="text-xs text-gray-600">Virtuals</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#6B46C1]">8</div>
          <div className="text-xs text-gray-600">Live</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#6B46C1]">18</div>
          <div className="text-xs text-gray-600">UCL</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-[#6B46C1]">20</div>
          <div className="text-xs text-gray-600">Europa</div>
        </div>
      </div>

      {/* Leagues List */}
      <div className="p-3">
        <h3 className="font-semibold mb-2">Popular Leagues</h3>
        <div className="space-y-1">
          {[
            'UEFA Champions League',
            'UEFA Europa League',
            'Premier League',
            'La Liga',
            'Serie A',
            'Bundesliga',
          ].map((league) => (
            <Link
              key={league}
              href="#"
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
            >
              <span className="text-sm">{league}</span>
              <ChevronRight size={16} className="text-gray-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}