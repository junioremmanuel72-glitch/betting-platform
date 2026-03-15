'use client';

import { useEffect, useState } from 'react';
import { matchesAPI } from '@/lib/api';

export default function TestAPI2() {
  const [status, setStatus] = useState('Testing API...');
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing matchesAPI.getAll()...');
        const data = await matchesAPI.getAll();
        console.log('API response:', data);
        
        if (data.success) {
          setStatus('✅ API is working!');
          setMatches(data.matches || []);
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
    <div style={{ padding: '20px' }}>
      <h1>API Test Page 2</h1>
      <div style={{ 
        padding: '10px', 
        background: status.includes('✅') ? '#d4edda' : '#f8d7da',
        border: `1px solid ${status.includes('✅') ? '#c3e6cb' : '#f5c6cb'}`,
        borderRadius: '4px',
        marginBottom: '20px'
      }}>
        {status}
      </div>
      
      {matches.length > 0 && (
        <div>
          <h2>Matches from API ({matches.length})</h2>
          <pre style={{ 
            background: '#f4f4f4', 
            padding: '10px', 
            borderRadius: '4px',
            overflow: 'auto'
          }}>
            {JSON.stringify(matches, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}