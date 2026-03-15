import Header from '@/components/Header'
import SportIcons from '@/components/SportIcons'
import Navigation from '@/components/Navigation'
import MatchesList from '@/components/MatchesList'
import BetSlip from '@/components/BetSlip'
import RecentBets from '@/components/RecentBets'

export default function Home() {
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
            <MatchesList />
          </div>
          
          {/* Right Sidebar - Bet Slip and Recent Bets */}
          <div className="col-span-3 space-y-4">
            <BetSlip />
            <RecentBets />
          </div>
        </div>
      </div>
    </main>
  )
}