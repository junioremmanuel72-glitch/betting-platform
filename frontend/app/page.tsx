'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import SportIcons from '@/components/SportIcons';
import Navigation from '@/components/Navigation';
import BetSlip from '@/components/BetSlip';
import RecentBets from '@/components/RecentBets';
import MatchCard from '@/components/MatchCard';
import { matchesAPI } from '@/lib/api';

export default function Home() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const data = await matchesAPI.getAll();
        if (data.success) {
          setMatches(data.matches);
        }
      } catch (error) {
        console.error('Error fetching matches:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-20">
            <p className="text-gray-500">Loading matches...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Sport Icons */}
        <div className="mb-6">
          <SportIcons />
        </div>
        
        {/* 3-Column Layout */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Navigation */}
          <div className="col-span-3">
            <Navigation />
          </div>
          
          {/* Main Content - Match Cards */}
          <div className="col-span-6">
            {matches.length > 0 ? (
              matches.map((match: any) => (
                <MatchCard key={match.id} match={match} />
              ))
            ) : (
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <p className="text-gray-500">No matches available</p>
              </div>
            )}
          </div>
          
          {/* Right Sidebar - Bet Slip and Recent Bets */}
          <div className="col-span-3 space-y-4">
            <BetSlip />
            <RecentBets />
          </div>
        </div>
      </div>
    </main>
  );
}