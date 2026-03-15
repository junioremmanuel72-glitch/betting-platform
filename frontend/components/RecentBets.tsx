'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';  // ← ADD THIS LINE
import { betsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

interface Bet {
  id: string;
  matchId: string;
  selection: string;
  odds: number;
  stake: number;
  potentialWin: number;
  status: string;
  cashoutAmount: number | null;
  createdAt: string;
  match: {
    homeTeam: string;
    awayTeam: string;
    league: string;
  };
}

export default function RecentBets() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const fetchBets = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }
      
      try {
        const data = await betsAPI.getMyBets();
        if (data.success) {
          setBets(data.bets.slice(0, 5)); // Show only 5 most recent
        }
      } catch (error) {
        console.error('Error fetching bets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBets();
  }, [isAuthenticated]);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'won': return 'text-green-600 bg-green-100';
      case 'lost': return 'text-red-600 bg-red-100';
      case 'cashed': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="font-bold text-lg mb-3">Recent Bets</h3>
        <div className="text-center py-6 text-gray-500">
          <p>Login to see your bet history</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">Recent Bets</h3>
        <Link href="/my-bets" className="text-sm text-[#F59E0B] hover:underline">
          View All
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-6 text-gray-500">
          <p>Loading bets...</p>
        </div>
      ) : bets.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <p>No bets placed yet</p>
          <p className="text-sm mt-2">Click on odds to place your first bet!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bets.map((bet) => (
            <div key={bet.id} className="border-b pb-3 last:border-0">
              <div className="flex justify-between items-start mb-1">
                <span className="text-sm font-medium">
                  {bet.match.homeTeam} vs {bet.match.awayTeam}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(bet.status)}`}>
                  {bet.status}
                </span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>Stake: UGX {bet.stake}</span>
                <span>Odds: {bet.odds}</span>
                <span>Potential: UGX {bet.potentialWin}</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {formatDate(bet.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}