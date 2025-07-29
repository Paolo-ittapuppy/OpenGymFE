import { useEffect, useState } from 'react';
import axios from 'axios';
import { Dialog } from '@headlessui/react'; // or your preferred modal component

export default function TeamDetailsModal({
  team,
  onClose,
}: {
  team: any;
  onClose: () => void;
}) {
  const [players, setPlayers] = useState([]);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    const fetchDetails = async () => {
      const playersRes = await axios.get(`/api/teams/${team.id}/players`);
      const statsRes = await axios.get(`/api/teams/${team.id}/stats`);

      setPlayers(playersRes.data);
      setStats(statsRes.data);
    };

    fetchDetails();
  }, [team.id]);

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="max-w-md w-full bg-white rounded-xl p-6 shadow-lg">
          <Dialog.Title className="text-xl font-bold mb-4">
            {team.team_name} – Details
          </Dialog.Title>

          <h2 className="font-semibold">Players</h2>
          <ul className="mb-4 list-disc ml-5">
            {players.map((player: any) => (
              <li key={player.id}>
                {player.name} {player.id === team.captain_id && '👑'}
              </li>
            ))}
          </ul>

          <h2 className="font-semibold">Team Stats</h2>
          <ul className="list-disc ml-5">
            <li>Wins: {stats.wins}</li>
            <li>Losses: {stats.losses}</li>
            <li>Average Score: {stats.avg_score}</li>
          </ul>

          <button
            className="mt-6 bg-red-500 text-white px-4 py-2 rounded"
            onClick={onClose}
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
