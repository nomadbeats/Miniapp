'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';
import GameEmbed from './GameEmbed';
import { motion, AnimatePresence } from 'framer-motion';

const GAMES = [
  { id: '2048', name: '2048', icon: '🎮' },
  { id: 'hextris', name: 'Hextris', icon: '🔷' },
  { id: 'flappybird', name: 'Flappy Bird', icon: '🐦' },
  { id: 'microgames', name: 'Mini Games', icon: '⚡' },
];

export default function GameTabs() {
  const { currentGame, setCurrentGame } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!currentGame) {
      setCurrentGame(GAMES[0].id);
    }
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {GAMES.map((game) => (
          <button
            key={game.id}
            onClick={() => setCurrentGame(game.id)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all duration-300 flex items-center gap-2 ${
              currentGame === game.id
                ? 'bg-accent text-dark shadow-lg shadow-accent/50'
                : 'bg-dark-secondary hover:bg-dark-secondary/80 text-gray-300'
            }`}
          >
            <span>{game.icon}</span>
            <span>{game.name}</span>
          </button>
        ))}
      </div>

      {/* Game Container */}
      <AnimatePresence mode="wait">
        {currentGame && (
          <motion.div
            key={currentGame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="glass p-4 rounded-2xl min-h-[500px] flex items-center justify-center"
          >
            <GameEmbed gameId={currentGame} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
