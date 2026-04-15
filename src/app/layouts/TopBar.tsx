import React from 'react';
import { Music } from 'lucide-react';
import { VersionSelector } from '../../shared/ui/VersionSelector';

export const TopBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-zinc-800/60">
      <button className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-800/80 rounded-full px-3 py-1.5 text-sm font-medium cursor-default opacity-30 grayscale pointer-events-none">
        <Music className="w-3.5 h-3.5" />
        ∞
      </button>

      <div className="flex bg-zinc-900/80 border border-zinc-800/80 rounded-full p-0.5 opacity-30 grayscale pointer-events-none">
        <button className="px-3 py-1 text-sm font-medium rounded-full text-zinc-600 cursor-default">Simple</button>
        <button className="px-3 py-1 text-sm font-medium rounded-full bg-zinc-800 text-zinc-100 shadow-sm cursor-default">Advanced</button>
        <button className="px-3 py-1 text-sm font-medium rounded-full text-zinc-600 cursor-default">Sounds</button>
      </div>

      <VersionSelector />
    </div>
  );
};
