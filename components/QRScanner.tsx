// components/QRCodeScanner.tsx
'use client';

import { useEffect } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

export default function QRCodeScanner({ onScan }: { onScan: (url: string) => void }) {
  useEffect(() => {
    const qrCodeScanner = new Html5Qrcode('qr-reader');

    qrCodeScanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          qrCodeScanner.stop();
          onScan(decodedText);
        },
        (err) => console.warn('QR error:', err)
      )
      .catch((err) => console.error('Camera start error:', err));

    return () => {
      qrCodeScanner.stop().catch(() => {});
    };
  }, []);

  return (
    <div id="qr-reader" className="w-full h-64 border border-gray-400" />
  );
}
