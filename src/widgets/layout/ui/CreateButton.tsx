import React from 'react';
import { Music, Sparkles } from 'lucide-react';

interface CreateButtonProps {
  isActive?: boolean;
  onClick?: () => void;
}

export const CreateButton: React.FC<CreateButtonProps> = ({ isActive, onClick }) => {
  return (
    <div className="p-4 pb-8 bg-[#101012]">
      <button 
        onClick={onClick}
        className={`w-full flex items-center justify-center gap-2 rounded-full py-3.5 font-medium cursor-default ${
          isActive 
            ? 'bg-gradient-to-r from-[#ff8c37] via-[#ff4d6d] to-[#ff3b3b] text-white border-none' 
            : 'bg-[#141417] text-zinc-500 border border-zinc-800/20'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <Music className={`w-4 h-4 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
          <Sparkles className={`w-3 h-3 absolute -top-1.5 -right-1.5 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
        </div>
        Create
      </button>
    </div>
  );
};
