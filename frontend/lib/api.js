const API_URL = 'https://betting-platform-production-f7be.up.railway.app/api';

// Store token in localStorage
const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

const setToken = (token) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
};

// Helper to create headers with auth
const getHeaders = () => {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// User API
export const userAPI = {
  login: async (email, password) => {
    const res = await fetch(`${API_URL}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.success) setToken(data.token);
    return data;
  },

  getProfile: async () => {
    const res = await fetch(`${API_URL}/users/profile`, {
      headers: getHeaders()
    });
    return res.json();
  }
};

// Matches API
export const matchesAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/matches`);
    return res.json();
  }
};

// Bets API
export const betsAPI = {
  placeBet: async (matchId, selection, stake) => {
    const res = await fetch(`${API_URL}/bets`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ matchId, selection, stake })
    });
    return res.json();
  },

  getMyBets: async () => {
    const res = await fetch(`${API_URL}/bets/my-bets`, {
      headers: getHeaders()
    });
    return res.json();
  }
};