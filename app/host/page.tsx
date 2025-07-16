'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import axios from 'axios';
import { supabase } from '@/lib/supabase';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
const {
    data: { session },
  } = await supabase.auth.getSession();
  const token = session?.access_token;

const defaultTeamSizes: Record<string, number> = {
  volleyball: 6,
  basketball: 5,
  pickleball: 2,
  tennis: 1,
  badminton: 1,
};

export default function HostPage() {
  const [form, setForm] = useState({
    session_name: '',
    description: '',
    sport: 'volleyball',
    custom_sport: '',
    team_size: defaultTeamSizes['volleyball'],
    max_teams: 4,
    starts_at: '',
    rotation_mode: 'winner_stays',
    winner_max_wins: 3,
  });
  const [startNow, setStartNow] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name === 'sport') {
      setForm((prev) => ({
        ...prev,
        sport: value,
        custom_sport: '',
        team_size: defaultTeamSizes[value] ?? 2,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: ['team_size', 'max_teams', 'winner_max_wins'].includes(name)
          ? parseInt(value)
          : value,
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const starts_at = startNow
      ? new Date().toISOString()
      : new Date(form.starts_at).toISOString();

    const sportToUse = form.sport === 'other' ? form.custom_sport.trim() : form.sport;

    if (!sportToUse) {
      alert('Please enter a custom sport name.');
      return;
    }

    const payload = {
      ...form,
      sport: sportToUse,
      starts_at,
    };

    //delete payload.custom_sport;

    console.log('Submitting session:', payload);
    try{
      const data = await axios.post(`${API_URL}/api/session/create`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
    } catch (error) {
      console.error("Error creating session:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-red-100 px-6 py-10">
      <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Host a Session</h1>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="flex gap-4 text-gray-800 items-center justify-center mb-4">
            <button
              type="button"
              onClick={() => setStartNow(true)}
              className={`px-4 py-2 rounded-md font-medium ${startNow ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            >
              Start Now
            </button>
            <button
              type="button"
              onClick={() => setStartNow(false)}
              className={`px-4 py-2 text-gray-800rounded-md text-gray-800 font-medium ${!startNow ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
            >
              Schedule for Later
            </button>
          </div>

          <div>
            <label className="block font-medium text-gray-800">Session Name</label>
            <input
              type="text"
              name="session_name"
              value={form.session_name}
              onChange={handleChange}
              className="w-full p-2 rounded-md border text-gray-800"
              required
            />
          </div>

          <div>
            <label className="block font-medium text-gray-800">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full p-2 rounded-md border text-gray-800"
              rows={3}
            />
          </div>

          <div>
            <label className="block font-medium text-gray-800">Sport</label>
            <select
              name="sport"
              value={form.sport}
              onChange={handleChange}
              className="w-full p-2 rounded-md border text-gray-800"
            >
              <option value="volleyball">Volleyball</option>
              <option value="basketball">Basketball</option>
              <option value="pickleball">Pickleball</option>
              <option value="tennis">Tennis</option>
              <option value="badminton">Badminton</option>
              <option value="other">Other</option>
            </select>
          </div>

          {form.sport === 'other' && (
            <div>
              <label className="block font-medium text-gray-800">Custom Sport Name</label>
              <input
                type="text"
                name="custom_sport"
                value={form.custom_sport}
                onChange={handleChange}
                className="w-full p-2 rounded-md border text-gray-800"
                placeholder="e.g. Ultimate Frisbee"
                required
              />
            </div>
          )}

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium text-gray-800">Team Size</label>
              <input
                type="number"
                name="team_size"
                min={1}
                value={form.team_size}
                onChange={handleChange}
                className="w-full p-2 rounded-md border text-gray-800"
                required
              />
            </div>

            <div className="flex-1">
              <label className="block font-medium text-gray-800">Max Teams</label>
              <input
                type="number"
                name="max_teams"
                min={2}
                value={form.max_teams}
                onChange={handleChange}
                className="w-full p-2 rounded-md border text-gray-800"
                required
              />
            </div>
          </div>

          {!startNow && (
            <div>
              <label className="block font-medium text-gray-800">Start Time</label>
              <input
                type="datetime-local"
                name="starts_at"
                value={form.starts_at}
                onChange={handleChange}
                className="w-full p-2 rounded-md border text-gray-800"
                required
              />
            </div>
          )}

          <div>
            <label className="block font-medium text-gray-800">Rotation Mode</label>
            <select
              name="rotation_mode"
              value={form.rotation_mode}
              onChange={handleChange}
              className="w-full p-2 rounded-md border text-gray-800"
            >
              <option value="winner_stays">Winner Stays</option>
              <option value="loser_stays">Loser Stays</option>
              <option value="rotate_all">Rotate All</option>
              <option value="winner_max">Winner Stays (Max Wins)</option>
            </select>
          </div>

          {form.rotation_mode === 'winner_max' && (
            <div>
              <label className="block font-medium text-gray-800">Max Wins for Winner</label>
              <input
                type="number"
                name="winner_max_wins"
                min={1}
                value={form.winner_max_wins}
                onChange={handleChange}
                className="w-full p-2 rounded-md border text-gray-800"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-xl transition"
          >
            Start Session
          </button>
        </form>
      </div>
    </div>
  );
}
