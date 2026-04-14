import React from 'react';

interface ActionButtonsProps {
  className?: string;
  variant?: 'default' | 'header';
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ className, variant = 'default' }) => {
  const btnClass = variant === 'header' 
    ? "flex items-center justify-center gap-1 px-2 py-1.5 text-[11px] font-bold bg-zinc-800/40 rounded-lg text-zinc-500 opacity-50 cursor-not-allowed transition-colors"
    : "flex items-center justify-center gap-1.5 bg-[#19191b] rounded-xl py-3.5 text-sm font-medium opacity-50 cursor-not-allowed text-zinc-500";

  return (
    <div className={className || "grid grid-cols-3 gap-2"}>
      <button className={btnClass} disabled>
        + Audio
      </button>
      <button className={btnClass} disabled>
        + Voice
        <span className="bg-pink-500/50 text-white/50 text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none ml-0.5">NEW</span>
      </button>
      <button className={btnClass} disabled>
        + Inspo
      </button>
    </div>
  );
};
