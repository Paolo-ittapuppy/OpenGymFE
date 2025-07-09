'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import LoginModal from '@/components/LoginModal';

export default function Header() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; avatarUrl: string } | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check if user is already signed in on component mount
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) {
        setIsSignedIn(true);
        setUser({
          name: data.user.user_metadata.full_name || data.user.email || 'User',
          avatarUrl:
            data.user.user_metadata.avatar_url ||
            'https://i.pravatar.cc/40?u=' + data.user.id,
        });
      }
    });

    // Listen for login/logout events and update state
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setIsSignedIn(true);
        setUser({
          name: session.user.user_metadata.full_name || session.user.email || 'User',
          avatarUrl:
            session.user.user_metadata.avatar_url ||
            'https://i.pravatar.cc/40?u=' + session.user.id,
        });
      } else {
        setIsSignedIn(false);
        setUser(null);
      }
    });

    // Cleanup subscription on unmount
    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <header className="flex justify-between items-center py-4 px-6 border-b border-gray-300">
      <h1 className="text-3xl font-extrabold text-gray-900">Open Gym</h1>

      <div>
        {!isSignedIn ? (
          <>
            <LoginModal
              mode="login"
              trigger={
                <button className="mr-4 px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700">
                  Log In
                </button>
              }
              onSuccess={() => setIsSignedIn(true)}
            />
            <LoginModal
              mode="signup"
              trigger={
                <button className="px-4 py-2 rounded border border-blue-600 text-blue-600 hover:bg-blue-100">
                  Sign Up
                </button>
              }
              onSuccess={() => setIsSignedIn(true)}
            />
          </>
        ) : (
          <div className="relative">
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <img
                src={user?.avatarUrl}
                alt={user?.name}
                className="w-10 h-10 rounded-full"
              />
              <span className="font-semibold">{user?.name}</span>
            </div>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-md z-50">
                <button
                  className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                  onClick={() => {
                    console.log('Go to profile');
                    // router.push('/profile') or similar
                  }}
                >
                  Profile
                </button>
                <button
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-100"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setIsSignedIn(false);
                    setUser(null);
                  }}
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}