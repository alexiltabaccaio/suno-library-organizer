import React from 'react';
import { Plus } from 'lucide-react';

interface ActionButtonsProps {
  className?: string;
  variant?: 'default' | 'header';
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ className, variant = 'default' }) => {
  const btnClass = variant === 'header' 
    ? "flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-bold bg-zinc-800/80 rounded-lg text-zinc-300 hover:bg-zinc-700 transition-colors"
    : "flex items-center justify-center gap-1.5 bg-[#19191b] rounded-xl py-3.5 text-sm font-medium cursor-default";

  return (
    <div className={className || "grid grid-cols-3 gap-2"}>
      <button className={btnClass}>
        <Plus className={variant === 'header' ? "w-3 h-3 text-zinc-400" : "w-4 h-4 text-zinc-300"} />
        Audio
      </button>
      <button className={btnClass}>
        <Plus className={variant === 'header' ? "w-3 h-3 text-zinc-400" : "w-4 h-4 text-zinc-300"} />
        Voice
        <span className="bg-pink-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none ml-0.5">NEW</span>
      </button>
      <button className={btnClass}>
        <Plus className={variant === 'header' ? "w-3 h-3 text-zinc-400" : "w-4 h-4 text-zinc-300"} />
        Inspo
      </button>
    </div>
  );
};
