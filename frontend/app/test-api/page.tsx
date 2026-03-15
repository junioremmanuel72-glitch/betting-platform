'use client';

import { useEffect, useState } from 'react';
import { matchesAPI, userAPI } from '@/lib/api';

export default function TestAPI2() {
  const [status, setStatus] = useState('Testing API...');
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const testAPI = async () => {
      try {
        // Test matches API
        const matchesData = await matchesAPI.getAll();
        console.log('Matches API response:', matchesData);
        
        if (matchesData.success) {
          setStatus('✅ API is working!');
          setMatches(matchesData.matches || []);
        } else {
          setStatus('❌ API returned error');
        }
      } catch (error) {
        console.error('API test error:', error);
        setStatus(`❌ Error: ${error.message}`);
      }
    };
    testAPI();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page 2</h1>
      <div className={`p-4 rounded mb-4 ${status.includes('✅') ? 'bg-green-100' : 'bg-red-100'}`}>
        {status}
      </div>
      
      {matches.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Matches ({matches.length})</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(matches, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}