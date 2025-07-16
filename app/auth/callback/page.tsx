'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/';

  useEffect(() => {
    const completeOAuth = async () => {
      // Refresh session if needed
      await supabase.auth.getSession();
      // Then redirect
      router.replace(next);
    };

    completeOAuth();
  }, [next, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-gray-700 text-lg">Signing you in...</p>
    </main>
  );
}
