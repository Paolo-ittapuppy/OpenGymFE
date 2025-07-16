// components/RequireAuth.tsx
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from './AuthProvider';
import LoginModal from '@/components/LoginModal';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // Open the modal once we know there's no user
  useEffect(() => {
    if (!loading && !user) {
      setShowModal(true);
    }
  }, [loading, user]);

  // 1️⃣ Still checking auth?  render nothing
  if (loading) return null;

  // 2️⃣ Not signed in → show modal only
  if (!user) {
    return (
      <>
        {showModal && (
          <LoginModal
            mode="login"
            open
            onSuccess={() => {
              setShowModal(false); // hide modal
              // Optional: trigger a refresh or route change here
              // router.refresh() or router.replace(currentPath)
            }}
          />
        )}
      </>
    );
  }

  // 3️⃣ Signed in → render protected content
  return <>{children}</>;
}
