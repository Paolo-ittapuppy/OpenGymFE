'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import GoogleSignInButton from './OAuthButton';

export default function LoginForm({
  mode = 'login',
  onSuccess,
}: {
  mode?: 'login' | 'signup';
  onSuccess?: () => void;
}) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    const { error } = await supabase.auth.signInWithOtp({ email });

    if (error) setMessage(error.message);
    else {
      setMessage('Check your email to continue!');
      onSuccess?.();
    }
  };

  return (
    <div className="space-y-4">
    <GoogleSignInButton />
      <input
        className="border rounded px-4 py-2 w-full"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full"
      >
        {mode === 'login' ? 'Send Login Link' : 'Sign Up'}
      </button>
      {message && <p className="text-sm text-gray-600">{message}</p>}
    </div>
  );
}