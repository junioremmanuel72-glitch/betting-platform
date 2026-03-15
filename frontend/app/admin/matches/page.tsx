'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  league: string;
  startTime: string;
  homeOdds: number;
  drawOdds: number;
  awayOdds: number;
  status: string;
}

export default function AdminMatchesPage() {
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    homeTeam: '',
    awayTeam: '',
    league: 'UEFA Champions League',
    startTime: '',
    homeOdds: '',
    drawOdds: '',
    awayOdds: '',
    status: 'upcoming'
  });

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/matches');
      const data = await res.json();
      if (data.success) {
        setMatches(data.matches);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('auth-storage');
    router.push('/admin/login');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const token = localStorage.getItem('token');
    const matchData = {
      ...formData,
      homeOdds: parseFloat(formData.homeOdds),
      drawOdds: parseFloat(formData.drawOdds),
      awayOdds: parseFloat(formData.awayOdds),
      startTime: new Date(formData.startTime).toISOString()
    };

    try {
      const url = editingMatch 
        ? `http://localhost:5000/api/admin/matches/${editingMatch.id}`
        : 'http://localhost:5000/api/admin/matches';
      
      const method = editingMatch ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(matchData)
      });

      const data = await res.json();
      
      if (data.success) {
        fetchMatches();
        setShowAddModal(false);
        setEditingMatch(null);
        resetForm();
      }
    } catch (error) {
      console.error('Error saving match:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`http://localhost:5000/api/admin/matches/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (data.success) {
        fetchMatches();
      }
    } catch (error) {
      console.error('Error deleting match:', error);
    }
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setFormData({
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      league: match.league,
      startTime: new Date(match.startTime).toISOString().slice(0, 16),
      homeOdds: match.homeOdds.toString(),
      drawOdds: match.drawOdds.toString(),
      awayOdds: match.awayOdds.toString(),
      status: match.status
    });
    setShowAddModal(true);
  };

  const resetForm = () => {
    setFormData({
      homeTeam: '',
      awayTeam: '',
      league: 'UEFA Champions League',
      startTime: '',
      homeOdds: '',
      drawOdds: '',
      awayOdds: '',
      status: 'upcoming'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-[#1A1A2E] text-white px-6 py-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-[#F59E0B]">bet</span>Pawa Admin
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow">
        <div className="container mx-auto">
          <div className="flex gap-8 px-6 py-3">
            <Link href="/admin/dashboard" className="text-gray-600 hover:text-[#F59E0B] transition py-2">
              Dashboard
            </Link>
            <Link href="/admin/matches" className="text-[#F59E0B] font-semibold border-b-2 border-[#F59E0B] py-2">
              Matches
            </Link>
            <Link href="/admin/bets" className="text-gray-600 hover:text-[#F59E0B] transition py-2">
              Bets
            </Link>
            <Link href="/admin/users" className="text-gray-600 hover:text-[#F59E0B] transition py-2">
              Users
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Manage Matches</h1>
            <p className="text-gray-500 text-sm mt-1.5">Add, edit or remove matches from the platform</p>
          </div>
          <button
            onClick={() => {
              setEditingMatch(null);
              resetForm();
              setShowAddModal(true);
            }}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition shadow-sm"
          >
            <span className="text-xl">+</span> Add New Match
          </button>
        </div>

        {/* Matches Table */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading matches...</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Match</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date/Time</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">League</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Odds (1 X 2)</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {matches.map((match) => (
                  <tr key={match.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{match.homeTeam}</div>
                      <div className="text-sm text-gray-400">vs</div>
                      <div className="font-medium text-gray-900">{match.awayTeam}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{formatDate(match.startTime)}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-50 text-blue-700 px-2.5 py-1.5 rounded-full text-xs font-medium">
                        {match.league}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <span className="bg-gray-100 px-2.5 py-1.5 rounded-md text-sm font-mono">{match.homeOdds}</span>
                        <span className="bg-gray-100 px-2.5 py-1.5 rounded-md text-sm font-mono">{match.drawOdds}</span>
                        <span className="bg-gray-100 px-2.5 py-1.5 rounded-md text-sm font-mono">{match.awayOdds}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1.5 rounded-full text-xs font-medium ${
                        match.status === 'live' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {match.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(match)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(match.id)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add/Edit Match Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6">
              {editingMatch ? 'Edit Match' : 'Add New Match'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Home Team</label>
                  <input
                    type="text"
                    name="homeTeam"
                    value={formData.homeTeam}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Away Team</label>
                  <input
                    type="text"
                    name="awayTeam"
                    value={formData.awayTeam}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">League</label>
                  <select
                    name="league"
                    value={formData.league}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F59E0B]"
                  >
                    <option>UEFA Champions League</option>
                    <option>Premier League</option>
                    <option>La Liga</option>
                    <option>Serie A</option>
                    <option>Bundesliga</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date & Time</label>
                  <input
                    type="datetime-local"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Home Odds</label>
                  <input
                    type="number"
                    name="homeOdds"
                    value={formData.homeOdds}
                    onChange={handleInputChange}
                    step="0.01"
                    min="1.01"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Draw Odds</label>
                  <input
                    type="number"
                    name="drawOdds"
                    value={formData.drawOdds}
                    onChange={handleInputChange}
                    step="0.01"
                    min="1.01"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Away Odds</label>
                  <input
                    type="number"
                    name="awayOdds"
                    value={formData.awayOdds}
                    onChange={handleInputChange}
                    step="0.01"
                    min="1.01"
                    className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F59E0B]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:border-[#F59E0B]"
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="live">Live</option>
                  <option value="finished">Finished</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMatch(null);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#F59E0B] text-white rounded-lg hover:bg-[#d48806]"
                >
                  {editingMatch ? 'Update Match' : 'Add Match'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}