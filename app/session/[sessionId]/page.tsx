'use client';

import { useEffect, useState,  } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import TeamCreator from './TeamCreator';
import { useAuth } from '@/components/AuthProvider';
import RequireAuth from '@/components/RequireAuth';
import { Button } from '@/components/ui/button';
import TeamsList from '@/components/TeamList';
import { GamesList } from '@/components/GameList';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type Role = 'host' | 'captain' | 'player' | 'guest';

export default function SessionPage() {
  const params = useParams(); // ← use this hook
  const sessionId = params?.sessionId as string;

  const { user, token, loading: authLoading } = useAuth(); // from context
  console.log("token",token)
  console.log("user",user)
  const [session, setSession] = useState<any | null>(null);
  const [role, setRole] = useState<Role>('guest');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* ------------------- fetch session + role ------------------- */
  useEffect(() => {
    if (authLoading) return; // wait until auth check done

    const fetchData = async () => {
      try {
        // 1. get session details
        const { data: sess } = await axios.get(
          `${API_URL}/api/session/${sessionId}`
        );
        //console.log("sess", sess)
        setSession(sess);

        if (!user) {
          setRole('guest');
          return;
        }
        console.log(sess.data.host_id, user.id)
        // 2. determine role
        if (sess.data.host_id === user.id) {
          setRole('host');
          return;
        }

        // 3. check team membership
        const { data: team } = await axios.get(
                                `${API_URL}/api/session/${sessionId}/team-of`, 
                                { headers: { Authorization: `Bearer ${token}` }} 
                              );
        //console.log(team) 

        if (!team || team == null) setRole('guest');
        else if (team.captain_id === user.id) setRole('captain');
        else setRole('player');
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

  fetchData();
  }, [sessionId, user, authLoading]);

  /* ------------------- UI states ------------------- */
  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading…</p>
      </main>
    );
  }

  if (error || !session) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-xl">Session not found.</p>
      </main>
    );
  }

  /* ------------------- Protected content ------------------- */
  return (
    <RequireAuth>
      <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 px-6 py-10">
        <main className="flex flex-col items-center px-6 py-10">
          <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
            {session.session_name }
          </h1>

          <p className="mb-8 text-black">
            <strong>ID:</strong> {sessionId} &nbsp;|&nbsp;
            <strong>Sport:</strong> {session.sport}
          </p>

          {/* role info */}
          <p className="mb-6 text-gray-800">
            You are&nbsp;
            {role === 'host'
              ? 'the host 👑'
              : role === 'captain'
              ? 'a captain 🧢'
              : role === 'player'
              ? 'a player 🏃'
              : 'a guest 🙋'}
          </p>

          {/* show creator only to captains / host */}
          {(role === 'player' || role === 'guest' || role === 'host') && (
            <TeamCreator sessionId={sessionId} />
          )}
          <TeamsList sessionId={sessionId} token={token} />
          <GamesList sessionId={sessionId}></GamesList>
        </main>
      </div>
    </RequireAuth>
  );
}
