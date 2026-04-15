import React from 'react';
import { ChevronRight, Music, Folder } from 'lucide-react';

interface SongMetadataProps {
  title: string;
  setTitle: (title: string) => void;
}

export const SongMetadata: React.FC<SongMetadataProps> = ({ title, setTitle }) => {
  return (
    <>
      {/* More Options */}
      <button className="w-full flex items-center gap-2 bg-[#19191b] rounded-xl p-4 font-medium cursor-default text-[15px] text-zinc-500 opacity-40 grayscale pointer-events-none">
        <ChevronRight className="w-4 h-4" />
        More Options
      </button>

      {/* Song Title */}
      <div className="flex items-center gap-3 bg-[#19191b] rounded-xl p-4">
        <Music className="w-4 h-4 text-zinc-100" />
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Song Title (Optional)" 
          className="bg-transparent outline-none text-[15px] text-zinc-100 placeholder:text-zinc-600 w-full"
        />
      </div>

      {/* Save to */}
      <div className="flex items-center justify-between bg-[#19191b] rounded-xl p-4 opacity-40 grayscale pointer-events-none">
        <div className="flex items-center gap-3">
          <Folder className="w-4 h-4 text-zinc-600 fill-zinc-600" />
          <span className="text-[15px] font-medium text-zinc-500">Save to...</span>
        </div>
        <button className="bg-zinc-800/80 px-4 py-1.5 rounded-full text-sm font-medium cursor-default text-zinc-400">
          My Workspace
        </button>
      </div>
    </>
  );
};
