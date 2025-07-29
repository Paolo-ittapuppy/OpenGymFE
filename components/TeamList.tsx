'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import TeamDetailsModal from './TeamDetailsModal'
import { Button } from '@/components/ui/button';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function TeamsList({ sessionId, token }: { sessionId: string, token: string | null }) {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const { data } = await axios.get(`${API_URL}/api/session/${sessionId}/teams`);
      setTeams(data);
      setLoading(false);
    };

    fetchTeams();
  }, [sessionId]);

  console.log('list token:', token)
  const handleJoin = async (teamId: string) => {
    // Add your join logic here
    await axios.post(
        `${API_URL}/api/session/${sessionId}/team/${teamId}/join`, 
        {},
        { headers: { Authorization: `Bearer ${token}` }}
    );
    alert('Joined team!');
  };

  if (loading) return <p>Loading teams...</p>;

  return (
    <div className="overflow-x-auto rounded-xl shadow-md border bg-white">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">Team Name</th>
            <th className="px-6 py-3">Captain</th>
            <th className="px-6 py-3"># Players</th>
            <th className="px-6 py-3 text-right">Action</th>
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => (
            <tr
              key={team.id}
              onClick={() => setSelectedTeam(team)}
              className="cursor-pointer hover:bg-gray-50 border-t"
            >
              <td className="px-6 py-4">{team.team_name}</td>
              <td className="px-6 py-4">{team.profiles.full_name}</td>
              <td className="px-6 py-4">{team.number_of_players}</td>
              <td className="px-6 py-4 text-right">
                <Button size="sm" onClick={(e) => {
                  e.stopPropagation();
                  handleJoin(team.id);
                }}>
                  Join
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedTeam && (
        <TeamDetailsModal
          team={selectedTeam}
          onClose={() => setSelectedTeam(null)}
        />
      )}
    </div>
  );
}
