'use client'

import { useEffect, useState } from 'react'
import MatchCard from './MatchCard'
import { matchesAPI } from '@/lib/api'

interface Match {
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

export default function MatchesList() {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await matchesAPI.getAll()
        if (data.success) {
          setMatches(data.matches)
        }
      } catch (error) {
        console.error('Error fetching matches:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Loading matches...</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {matches.length > 0 ? (
        matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No matches available</p>
        </div>
      )}
    </div>
  )
}