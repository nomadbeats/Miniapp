'use client';

import { User } from '@/lib/store';
import { LogOut, User as UserIcon } from 'lucide-react';

interface UserProfileProps {
  user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-dark-secondary/50">
      <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center">
        <UserIcon className="w-4 h-4 text-accent" />
      </div>
      <div className="hidden sm:block">
        <p className="text-xs font-medium leading-none">
          {user.firstName}
        </p>
        <p className="text-xs text-gray-400 mt-0.5">
          {user.totalScore} pts
        </p>
      </div>
    </div>
  );
}
