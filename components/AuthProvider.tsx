'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Session, SupabaseClient } from '@supabase/supabase-js';

// ─── types ─────────────────────────────────────────────
type UserInfo = {
  id: string;
  name: string;
  avatarUrl: string;
};

type AuthContextShape = {
  user: UserInfo | null ;
  loading: boolean;
  token: string | null;
};

// ─── context ───────────────────────────────────────────
const AuthContext = createContext<AuthContextShape>({
  user: null,
  loading: true,
  token: null,
});

export function useAuth() {
  return useContext(AuthContext);
}

// ─── provider ──────────────────────────────────────────
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
const [session, setSession] = useState<Session | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // initial check
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        hydrateUser(data.user);
      }
      setLoading(false);
    });

    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      setSession(session);
      setToken(session?.access_token || null);
      setLoading(false);
    };
    getSession()

    // live listener (login / logout / tab focus)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        hydrateUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const hydrateUser = (u: any) => {
    setUser({
      id: u.id,
      name: u.user_metadata.full_name || u.email || 'User',
      avatarUrl:
        u.user_metadata.avatar_url || `https://i.pravatar.cc/40?u=${u.id}`,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, token }}>
      {children}
    </AuthContext.Provider>
  );
}
