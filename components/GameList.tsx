'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type Game = {
  id: string;
  team1: string;
  team2: string;
  team1_response: boolean;
  team2_response: boolean;
  team1_points: number;
  team2_points: number;
  court: string;
};

interface GamesListProps {
  sessionId: string;
}

export const GamesList: React.FC<GamesListProps> = ({ sessionId }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/session/${sessionId}/current-games`);
        setGames(response.data.data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to fetch games.');
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [sessionId]);

  if (loading) return <p>Loading games...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  if (games.length === 0) return <p>No games found for this session.</p>;
  console.log("games:",games)
  return (
    <div className="overflow-x-auto rounded-xl shadow-md border bg-white mt-4">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Court</th>
            <th className="px-6 py-3">Team 1</th>
            <th className="px-6 py-3">Team 2</th>
            <th className="px-6 py-3">Ready</th>
            <th className="px-6 py-3">Score</th>
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id} className="border-t hover:bg-gray-50">
              <td className="px-6 py-4">{game.court}</td>
              <td className="px-6 py-4">{game.team1}</td>
              <td className="px-6 py-4">{game.team2}</td>
              <td className="px-6 py-4">
                {game.team1_response ? '✅' : '❌'} / {game.team2_response ? '✅' : '❌'}
              </td>
              <td className="px-6 py-4">
                {game.team1_points} - {game.team2_points}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
