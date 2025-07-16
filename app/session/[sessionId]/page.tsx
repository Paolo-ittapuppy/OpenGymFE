import type { Metadata } from 'next';
import TeamCreator from './TeamCreator';
import axios from 'axios';
import { useAuth } from '@/components/AuthProvider';
import RequireAuth from '@/components/RequireAuth';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export const metadata: Metadata = {
  title: 'Open Gym – Session',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default async function SessionPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = await params;
  console.log(sessionId )

  const [role, setRole] = useState<'host' | 'captain' | 'player' | 'guest' | null>(null);
  const [userId, setUserId] = useState<string | null| undefined>(null);
  const [loading, setLoading] = useState(true);

  try {
    // axios throws for 4xx/5xx so wrap in try/catch
    console.log(`${API_URL}/api/session/${sessionId}`)
    const res = await axios.get(`${API_URL}/api/session/${sessionId}`);
    console.log("res", res)
    const session = res.data; // already JSON

    useEffect(() => {
    const checkRole = async () => {
      setLoading(true);

      const {user} = useAuth();
      setUserId(user?.id);

      // 1. Get session info
      const sessionRes = await axios.get(`/api/session/${sessionId}`);
      const sessionData = sessionRes.data;

      if (sessionData.host_id === user?.id) {
        setRole('host');
        setLoading(false);
        return;
      }

      // 2. Check if user is a captain
      const teamRes = await axios.get(`/api/session/${sessionId}/team-of/${user?.id}`);
      const team = teamRes.data;

      if (!team) {
        setRole('guest');
      } else if (team.captain_id === user?.id) {
        setRole('captain');
      } else {
        setRole('player');
      }

      setLoading(false);
    };

    checkRole();
  }, [sessionId]);

  if (loading) return <p>Loading...</p>;

    return (
      <RequireAuth>
       <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 px-6 py-10">
        {/* Header at the top */}

        {/* main content stays the same */}
        <main className="flex flex-col items-center px-6 py-10">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
            {session.session_name}
          </h1>

          <p className="mb-8 text-black">
            <strong>ID:</strong> {sessionId} &nbsp;|&nbsp;
            <strong>Sport:</strong> {session.sport}
          </p>

          <TeamCreator sessionId={sessionId} />
        </main>
      </div>
      </RequireAuth>
    );
  } catch (err: any) {
    // err.response?.status contains the HTTP status
    console.log(err)
    return (
      
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-xl">Session not found.</p>
      </main>
    );
  }
}