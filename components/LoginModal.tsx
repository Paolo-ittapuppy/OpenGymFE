'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';

export default function LoginModal({
  trigger,
  mode = 'login',
  onSuccess,
}: {
  trigger: React.ReactNode;
  mode?: 'login' | 'signup';
  onSuccess?: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4">
              {mode === 'login' ? 'Log In' : 'Sign Up'}
            </h2>
            <LoginForm
              mode={mode}
              onSuccess={() => {
                setOpen(false);
                onSuccess?.();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}