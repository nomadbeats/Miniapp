'use client';

import { useEffect, useState } from 'react';
import { useGameStore } from '@/lib/store';
import GameTabs from '@/components/GameTabs';
import ScoreDisplay from '@/components/ScoreDisplay';
import UserProfile from '@/components/UserProfile';
import { Zap } from 'lucide-react';

export default function Home() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { initGame, user } = useGameStore();

  useEffect(() => {
    const initializeTelegram = async () => {
      try {
        // Ensure Telegram WebApp is ready
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          window.Telegram.WebApp.ready();
          window.Telegram.WebApp.expand();
          window.Telegram.WebApp.setBackgroundColor('#0a0e27');
          window.Telegram.WebApp.setHeaderColor('#0a0e27');
        }

        // Initialize game with Telegram auth
        await initGame();
        setIsReady(true);
      } catch (err) {
        console.error('Failed to initialize game:', err);
        setError('Failed to initialize game');
      }
    };

    initializeTelegram();
  }, [initGame]);

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Error</h1>
          <p className="text-gray-300">{error}</p>
        </div>
      </div>
    );
  }

  if (!isReady) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="text-center">
          <Zap className="w-12 h-12 animate-pulse text-accent mx-auto mb-4" />
          <p className="text-gray-400">Loading games...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-dark via-dark-secondary to-dark pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-dark/80 backdrop-blur-lg border-b border-white/5 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-hover flex items-center justify-center">
                <Zap className="w-5 h-5 text-dark" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Game Hub</h1>
                <p className="text-xs text-gray-400">Play & Compete</p>
              </div>
            </div>
            {user && <UserProfile user={user} />}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Games Section */}
          <div className="lg:col-span-2">
            <GameTabs />
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <ScoreDisplay />
          </div>
        </div>
      </div>
    </main>
  );
}
