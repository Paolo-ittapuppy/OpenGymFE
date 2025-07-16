'use client';

import { useState } from 'react';
import LoginForm from './LoginForm';

export default function LoginModal({
  mode,
  trigger,
  onSuccess,
  open = false,      // NEW
}: {
  mode: 'login' | 'signup';
  trigger?: React.ReactNode;
  onSuccess?: () => void;
  open?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{trigger}</span>
      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-96 relative">
            <button
              className="absolute top-2 right-2 text-gray-500"
              onClick={() => setIsOpen(false)}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold mb-4 text-black">
              {mode === 'login' ? 'Log In' : 'Sign Up'}
            </h2>
            <LoginForm
              mode={mode}
              onSuccess={() => {
                setIsOpen(false);
                onSuccess?.();
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}