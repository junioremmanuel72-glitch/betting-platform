'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, Search } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { userAPI } from '@/lib/api';

export default function Header() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { user, login, logout, isAuthenticated, updateBalance } = useAuthStore();

  // Fetch latest balance when authenticated
  useEffect(() => {
    const fetchBalance = async () => {
      if (isAuthenticated) {
        try {
          const profile = await userAPI.getProfile();
          if (profile.success) {
            updateBalance(profile.user.balance);
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      }
    };
    fetchBalance();
  }, [isAuthenticated, updateBalance]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const result = await login(email, password);
      if (result.success) {
        setShowLogin(false);
        setEmail('');
        setPassword('');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (err) {
      setError('Login failed');
    }
  };

  return (
    <header className="bg-[#1A1A2E] text-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <button className="lg:hidden">
              <Menu size={24} />
            </button>
            <Link href="/" className="text-2xl font-bold text-[#F59E0B]">
              betPawa
            </Link>
          </div>

          {/* Quick Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/sports" className="hover:text-[#F59E0B]">SPORTS</Link>
            <Link href="/live" className="hover:text-[#F59E0B]">LIVE</Link>
            <Link href="/my-bets" className="hover:text-[#F59E0B]">MY BETS</Link>
            <Link href="/casino" className="hover:text-[#F59E0B]">CASINO</Link>
            <Link href="/virtuals" className="hover:text-[#F59E0B]">VIRTUALS</Link>
            <Link href="/aviator" className="hover:text-[#F59E0B]">AVIATOR</Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            <button className="p-2 hover:bg-purple-800 rounded-full">
              <Search size={20} />
            </button>
            
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-300">
                  Balance: <span className="text-[#F59E0B] font-bold">UGX {user?.balance?.toLocaleString() || 0}</span>
                </span>
                <button
                  onClick={logout}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowLogin(true)}
                  className="hidden sm:block px-4 py-2 text-sm font-medium hover:bg-purple-800 rounded"
                >
                  LOGIN
                </button>
                <Link
                  href="/register"
                  className="bg-[#F59E0B] text-white px-4 py-2 rounded text-sm font-medium hover:bg-orange-600"
                >
                  JOIN NOW
                </Link>
              </>
            )}
          </div>
        </div>

        {/* User Status Bar */}
        <div className="py-2 text-sm border-t border-purple-800">
          {isAuthenticated ? (
            <span className="text-gray-300">
              Welcome, <span className="text-[#F59E0B]">{user?.name || 'User'}</span>
            </span>
          ) : (
            <span className="text-gray-300">
              Not logged in -{' '}
              <button onClick={() => setShowLogin(true)} className="text-[#F59E0B] hover:underline">
                Login
              </button>{' '}
              or{' '}
              <Link href="/register" className="text-[#F59E0B] hover:underline">
                Join Now
              </Link>
            </span>
          )}
        </div>
      </div>

      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#16213e] p-8 rounded-lg w-96">
            <h2 className="text-2xl text-white font-bold mb-6">Login</h2>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded mb-4">
                {error}
              </div>
            )}
            
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 mb-4 bg-[#0f3460] text-white rounded border-none"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 mb-6 bg-[#0f3460] text-white rounded border-none"
                required
              />
              <button
                type="submit"
                className="w-full bg-[#F59E0B] text-white py-3 rounded font-bold hover:bg-[#d48806]"
              >
                Login
              </button>
            </form>
            
            <button
              onClick={() => setShowLogin(false)}
              className="w-full text-gray-400 text-sm mt-4 hover:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}