'use client';

import { useState, useEffect } from 'react';
import { useGameStore } from '@/lib/store';

interface GameEmbedProps {
  gameId: string;
}

const GAME_URLS: Record<string, string> = {
  '2048': 'https://gabrielecirulli.github.io/2048/',
  'hextris': 'https://hextris.io/',
  'flappybird': 'https://nebez.github.io/flappybird/',
  'microgames': 'https://games.telegram.org/games/games',
};

export default function GameEmbed({ gameId }: GameEmbedProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { submitScore } = useGameStore();

  useEffect(() => {
    // Simulate game completion after demo
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [gameId]);

  const handleGameEnd = async (score: number, duration?: number) => {
    try {
      await submitScore(gameId, score, duration);
      console.log(`Score submitted: ${gameId} - ${score}`);
    } catch (error) {
      console.error('Failed to submit score:', error);
    }
  };

  const gameUrl = GAME_URLS[gameId];

  return (
    <div className="w-full h-full">
      {isLoading && (
        <div className="flex items-center justify-center w-full h-full">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full border-4 border-gray-600 border-t-accent animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading {gameId}...</p>
          </div>
        </div>
      )}

      {gameUrl && (
        <iframe
          src={gameUrl}
          className="w-full h-full min-h-[500px] border-0 rounded-lg"
          allow="autoplay; fullscreen"
          loading="lazy"
          onLoad={() => setIsLoading(false)}
        />
      )}

      {!gameUrl && (
        <div className="text-center py-8">
          <p className="text-gray-400">Game not available</p>
        </div>
      )}
    </div>
  );
}
