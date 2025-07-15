'use client';

import { QRCodeCanvas } from 'qrcode.react';

export default function QRCodeGenerator({ sessionName }: { sessionName: string }) {
  const sessionUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/session/${sessionName}`;

  return (
    <div className="flex flex-col items-center space-y-2">
      <QRCodeCanvas value={sessionUrl} size={200} />
      <p className="text-sm text-gray-700">Scan to join: {sessionName}</p>
    </div>
  );
}