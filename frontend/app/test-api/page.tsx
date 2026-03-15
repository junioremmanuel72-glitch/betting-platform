'use client';

import { useEffect, useState } from 'react';

export default function TestAPIPage() {
  const [status, setStatus] = useState('Testing API...');
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const testAPI = async () => {
      try {
        console.log('Testing matchesAPI.getAll()...');
        const res = await fetch('http://localhost:5000/api/matches');
        const data = await res.json();
        console.log('API response:', data);
        
        if (data.success) {
          setStatus('✅ API is working!');
          setMatches(data.matches || []);
        } else {
          setStatus('❌ API returned error');
        }
      } catch (error) {
        console.error('API test error:', error);
        // Fixed: Handle unknown error type
        setStatus(`❌ Error: ${error instanceof Error ? error.message : String(error)}`);
      }
    };
    testAPI();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>API Test Page</h1>
      <div style={{ 
        padding: '10px', 
        background: status.includes('✅') ? '#d4edda' : status.includes('❌') ? '#f8d7da' : '#fff3cd',
        border: `1px solid ${status.includes('✅') ? '#c3e6cb' : status.includes('❌') ? '#f5c6cb' : '#ffeeba'}`,
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
            overflow: 'auto',
            maxHeight: '400px'
          }}>
            {JSON.stringify(matches, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}