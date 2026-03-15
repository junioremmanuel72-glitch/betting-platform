'use client';

import { useEffect, useState } from 'react';
import { betsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import Header from '@/components/Header';
import Link from 'next/link';

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
    startTime: string;
  };
}

export default function MyBetsPage() {
  const [bets, setBets] = useState<Bet[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
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
          setBets(data.bets);
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
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'won': return 'bg-green-100 text-green-800';
      case 'lost': return 'bg-red-100 text-red-800';
      case 'cashed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const filteredBets = filter === 'all' ? bets : bets.filter(bet => bet.status === filter);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h1 className="text-2xl font-bold mb-4">My Bets</h1>
            <p className="text-gray-600">Please login to view your bet history</p>
            <Link href="/" className="inline-block mt-4 bg-[#F59E0B] text-white px-6 py-2 rounded">
              Go to Homepage
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-3xl font-bold mb-6">My Betting History</h1>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {['all', 'pending', 'won', 'lost', 'cashed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                  filter === status
                    ? 'bg-[#F59E0B] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading your bets...</p>
            </div>
          ) : filteredBets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-4">No bets found</p>
              <Link href="/" className="bg-[#F59E0B] text-white px-6 py-2 rounded inline-block">
                Place Your First Bet
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBets.map((bet) => (
                <div key={bet.id} className="border rounded-lg p-4 hover:shadow-md transition">
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {bet.match.homeTeam} vs {bet.match.awayTeam}
                      </h3>
                      <p className="text-sm text-gray-600">{bet.match.league}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDate(bet.match.startTime)}
                      </p>
                    </div>
                    
                    <div className="text-right">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(bet.status)}`}>
                        {bet.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    <div>
                      <p className="text-xs text-gray-500">Selection</p>
                      <p className="font-medium">{bet.selection}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Stake</p>
                      <p className="font-medium">UGX {bet.stake}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Odds</p>
                      <p className="font-medium text-[#F59E0B]">{bet.odds}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Potential Win</p>
                      <p className="font-medium text-green-600">UGX {bet.potentialWin}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-3 border-t text-xs text-gray-400">
                    <span>Placed: {formatDate(bet.createdAt)}</span>
                    {bet.cashoutAmount && (
                      <span className="text-blue-600">Cashed out: UGX {bet.cashoutAmount}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}