'use client';

import { useGameStore } from '@/lib/store';
import api from '@/lib/api';
import { useState, useEffect } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';

interface LeaderboardEntry {
  telegram_id: number;
  username: string;
  first_name: string;
  total_score: number;
  rank: number;
}

export default function ScoreDisplay() {
  const { user } = useGameStore();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/scores/leaderboard?limit=10');
        setLeaderboard(response.data.leaderboard);
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="space-y-4">
      {/* User Stats */}
      {user && (
        <div className="glass p-4 rounded-xl">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Your Stats
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Total Score</span>
              <span className="font-bold text-accent text-lg">{user.totalScore}</span>
            </div>
            {user.rank && (
              <div className="flex justify-between">
                <span className="text-gray-400">Global Rank</span>
                <span className="font-bold text-accent"># {user.rank}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="glass p-4 rounded-xl">
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          Top Players
        </h3>

        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-400 text-sm">Loading...</p>
          </div>
        ) : leaderboard.length > 0 ? (
          <div className="space-y-2">
            {leaderboard.slice(0, 5).map((entry, idx) => (
              <div
                key={entry.telegram_id}
                className="flex items-center justify-between p-2 rounded bg-dark/50 hover:bg-dark/70 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-accent w-6">{idx + 1}.</span>
                  <span className="text-sm">
                    {entry.username || entry.first_name || 'User'}
                  </span>
                </div>
                <span className="font-bold text-accent text-sm">
                  {entry.total_score}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400 text-sm text-center py-4">No data yet</p>
        )}
      </div>
    </div>
  );
}
