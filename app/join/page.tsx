'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Html5Qrcode } from 'html5-qrcode';
import Header from '@/components/Header';

export default function JoinSessionPage() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [scanMode, setScanMode] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  /* ───────────── QR‑scanner lifecycle ───────────── */
  useEffect(() => {
    if (!scanMode) return;

    const qr = new Html5Qrcode('qr-reader');

    qr.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: 250 },
      (text) => {
        qr.stop().catch(() => {});
        handleJoin(text);
      },
      (err) => console.warn(err)
    ).catch((err) => {
      setCameraError('Could not access camera.');
      console.error(err);
    });

    return () => {
      qr.stop().catch(() => {});
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scanMode]);

  /* ───────────── Join helper ───────────── */
  const handleJoin = (fullUrlOrCode: string) => {
    const slug =
      fullUrlOrCode.startsWith('http')
        ? fullUrlOrCode.split('/session/').pop() ?? ''
        : fullUrlOrCode;

    if (!slug) {
      alert('Invalid session code');
      return;
    }
    router.push(`/session/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleJoin(code.trim());
  };

  /* ───────────── UI ───────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 px-6 py-10">
    <Header />

    <div className="flex flex-col items-center justify-center px-6 mt-10">
      <h1 className="text-4xl font-extrabold mb-10 text-gray-900">Join a Session</h1>

      {/* QR code scanner */}
      {!scanMode ? (
        <button
          onClick={() => {
            setCameraError(null);
            setScanMode(true);
          }}
          className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition"
        >
          📷 Scan QR Code
        </button>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <div id="qr-reader" className="w-64 h-64 border border-gray-400" />
          {cameraError && (
            <p className="text-red-600 text-sm">{cameraError}</p>
          )}
          <button
            className="text-sm text-blue-600 underline"
            onClick={() => setScanMode(false)}
          >
            Cancel
          </button>
        </div>
      )}

      {/* Divider */}
      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-gray-300" />
        <span className="text-gray-700 text-sm">or</span>
        <span className="h-px flex-1 bg-gray-300" />
      </div>

      {/* Manual entry */}
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-4 w-full max-w-sm"
      >
        <input
          type="text"
          placeholder="Enter session code"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-xl text-center tracking-widest text-black"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg text-xl font-semibold hover:bg-blue-700 transition"
        >
          Join Session
        </button>
      </form>

    </div>
    </div>
  );
}
