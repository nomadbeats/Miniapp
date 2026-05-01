'use client';

import { create } from 'zustand';
import api from '@/lib/api';

export interface User {
  id: number;
  telegramId: number;
  username?: string;
  firstName: string;
  totalScore: number;
  rank?: number;
}

export interface Score {
  game: string;
  score: number;
  rank?: number;
}

interface GameStore {
  user: User | null;
  scores: Record<string, number>;
  token: string | null;
  currentGame: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  initGame: () => Promise<void>;
  setCurrentGame: (game: string) => void;
  submitScore: (gameName: string, score: number, duration?: number) => Promise<void>;
  logout: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  user: null,
  scores: {},
  token: null,
  currentGame: null,
  loading: false,
  error: null,

  initGame: async () => {
    set({ loading: true });
    try {
      const initData = window.Telegram?.WebApp?.initData;
      if (!initData) throw new Error('Telegram WebApp not available');

      const response = await api.post('/auth/login', { initData });
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      set({ token, user, error: null });
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to initialize';
      set({ error: message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  setCurrentGame: (game: string) => {
    set({ currentGame: game });
  },

  submitScore: async (gameName: string, score: number, duration?: number) => {
    try {
      const response = await api.post('/scores/submit', {
        gameName,
        score,
        duration
      });

      const { highScore, rank } = response.data;

      set((state) => ({
        scores: { ...state.scores, [gameName]: highScore },
        user: state.user ? { ...state.user, rank } : null
      }));
    } catch (error: any) {
      const message = error.response?.data?.error || 'Failed to submit score';
      set({ error: message });
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  }
}));
