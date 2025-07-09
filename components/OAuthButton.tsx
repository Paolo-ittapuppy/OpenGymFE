'use client';

import { supabase } from '@/lib/supabase';

export default function GoogleSignInButton() {
  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://localhost:3000', // change this to your deployed URL in production
      },
    });
    if (error) console.error('Google login error:', error.message);
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center space-x-2"
    >
      <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
      <span>Sign in with Google</span>
    </button>
  );
}
