import type { Metadata } from 'next';
import TeamCreator from './TeamCreator';
import axios from 'axios';

export const metadata: Metadata = {
  title: 'Open Gym – Session',
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default async function SessionPage({ params }: { params: { sessionId: string } }) {
  const { sessionId } = await params;

  try {
    // axios throws for 4xx/5xx so wrap in try/catch
    console.log(`${API_URL}/api/session/${sessionId}`)
    const res = await axios.get(`${API_URL}/api/session/${sessionId}`);
    console.log("res", res)
    const session = res.data; // already JSON

    return (
      <main className="min-h-screen flex flex-col items-center px-6 py-10">
        <h1 className="text-4xl font-extrabold mb-4 text-gray-900">
          {session.session_name}
        </h1>

        <p className="mb-8 text-gray-700">
          <strong>ID:</strong> {sessionId} &nbsp;|&nbsp;
          <strong>Sport:</strong> {session.sport}
        </p>

        <TeamCreator sessionId={sessionId} />
      </main>
    );
  } catch (err: any) {
    // err.response?.status contains the HTTP status
    console.log(err)
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-xl">Session not found.</p>
      </main>
    );
  }
}