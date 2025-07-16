'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

// ─── types ─────────────────────────────────────────────
type UserInfo = {
  id: string;
  name: string;
  avatarUrl: string;
};

type AuthContextShape = {
  user: UserInfo | null ;
  loading: boolean;
};

// ─── context ───────────────────────────────────────────
const AuthContext = createContext<AuthContextShape>({
  user: null,
  loading: true,
});

export function useAuth() {
  return useContext(AuthContext);
}

// ─── provider ──────────────────────────────────────────
export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // initial check
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        hydrateUser(data.user);
      }
      setLoading(false);
    });

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
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
