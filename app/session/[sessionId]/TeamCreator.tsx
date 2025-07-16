'use client';
import { useState } from 'react';
import axios from 'axios';
import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function TeamCreator({ sessionId }: { sessionId: string}) {
  const [teamName, setTeamName] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const createTeam = async () => {
    if (!teamName.trim()) return;

    try {
      setStatus('loading');
      setMessage('');
      const {
          data: { session },
        } = await supabase.auth.getSession();
        const token = session?.access_token;

      await axios.post(
        `${API_URL}/api/session/${sessionId}/create-team`,
        { team_name: teamName.trim() }
        , { headers: { Authorization: `Bearer ${token}` } }  // add if needed
      );

      setStatus('success');
      setMessage('Team created!');
      setTeamName('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.response?.data?.error || 'Could not create team');
    }
  };

  return (
    <div className="w-full max-w-md flex flex-col items-center gap-4">
      <input
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Team name"
        className="w-full border border-black px-4 py-3 text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <button
        onClick={createTeam}
        disabled={status === 'loading'}
        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {status === 'loading' ? 'Creating…' : 'Create Team'}
      </button>

      {message && (
        <p
          className={
            status === 'error' ? 'text-red-600 text-sm' : 'text-green-600 text-sm'
          }
        >
          {message}
        </p>
      )}
    </div>
  );
}
