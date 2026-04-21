import React from 'react';
import { ChevronRight, Pencil } from 'lucide-react';

export const WorkspaceHeader: React.FC = () => {
  return (
    <div 
      className="px-4 pt-6 pb-4 flex items-center justify-between opacity-40 grayscale pointer-events-none cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2 text-[15px] font-medium">
        <span className="text-zinc-500">Workspaces</span>
        <ChevronRight className="w-4 h-4 text-zinc-600" />
        <span className="text-zinc-500">Test</span>
        <button className="text-zinc-600 ml-1">
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
