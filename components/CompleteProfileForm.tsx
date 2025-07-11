'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function CompleteProfileForm({
  onSubmitted,
  onCancel,
}: {
  onSubmitted: () => void;
  onCancel: () => void;
}) {
  const [username, setUsername] = useState('');
  const [full_name, setFullName] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const user = session?.user;
      if (user?.user_metadata?.full_name) {
        setFullName(user.user_metadata.full_name);
      }
    };

    fetchUserInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (!token) throw new Error('No access token found');

  try {
    const { data } = await axios.post(
      `${API_URL}/api/profile/update`,
      { username, full_name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    onSubmitted();
  } catch (err: any) {
    if (
      axios.isAxiosError(err) &&
      err.response?.status === 400 &&
      err.response?.data?.error?.includes('duplicate key')
    ) {
      alert('Username is already taken. Please choose a different one.');
    } else {
      alert('Something went wrong. Please try again later.');
    }
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <form
        onSubmit={handleSubmit}
        className="relative bg-white rounded-lg shadow-xl p-8 w-full max-w-md border border-gray-300"
      >
        {/* ❌ Close Button */}
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
          Complete Your Profile
        </h2>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full mb-4 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="text"
          placeholder="Full Name"
          value={full_name}
          onChange={(e) => setFullName(e.target.value)}
          required
          className="w-full mb-6 px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded hover:bg-blue-700 transition"
        >
          Save and Continue
        </button>
      </form>
    </div>
  );
}
