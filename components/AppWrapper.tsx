'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import CompleteProfileForm from './CompleteProfileForm';

export default function AppWrapper({ children }: { children: React.ReactNode }) {
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (!userData.user || userError) {
        setLoading(false);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('username, full_name, has_completed_profile')
        .eq('id', userData.user.id)
        .single();
      console.log('Profile data:', profile);
      if (!profile?.has_completed_profile) {
        setShowProfileForm(true);
      }

      setLoading(false);
    };

    checkProfile();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading...</p>;
  }

  return (
    <>
      {children}
      {showProfileForm && (
        <CompleteProfileForm onSubmitted={() => setShowProfileForm(false)}
        onCancel={() => setShowProfileForm(false)} />
      )}
    </>
  );
}