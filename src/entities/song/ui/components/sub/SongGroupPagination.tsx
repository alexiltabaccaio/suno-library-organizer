import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SongItemSubFilters } from '../SongItemSubFilters';

interface SongGroupPaginationProps {
  groupKey: string;
  subPage: number;
  totalSubPages: number;
  groupCount?: number;
  onSubPageChange?: (page: number) => void;
  showSubFilters: boolean;
  setShowSubFilters: (show: boolean) => void;
}

export const SongGroupPagination: React.FC<SongGroupPaginationProps> = ({
  groupKey,
  subPage,
  totalSubPages,
  groupCount,
  onSubPageChange,
  showSubFilters,
  setShowSubFilters
}) => {
  return (
    <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
      <div className="w-[1px] h-4 bg-zinc-800 mx-1" />
      {/* Sub-pagination */}
      <div className="flex items-center gap-0.5 bg-zinc-800/80 rounded-md px-1 py-0.5 shrink-0">
        <button 
          onClick={() => {
            if (subPage > 1) onSubPageChange?.(subPage - 1);
          }}
          disabled={subPage === 1}
          className={`p-0.5 transition-colors ${subPage === 1 ? 'text-zinc-700' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <ChevronLeft className="w-3 h-3" />
        </button>
        <span className="text-zinc-300 text-[10px] font-bold min-w-[10px] text-center">
          {subPage}
        </span>
        <button 
          onClick={() => {
            if (subPage < totalSubPages) onSubPageChange?.((groupCount || 0) > 0 ? subPage + 1 : subPage);
          }}
          disabled={subPage === totalSubPages}
          className={`p-0.5 transition-colors ${subPage === totalSubPages ? 'text-zinc-700' : 'text-zinc-400 hover:text-zinc-200'}`}
        >
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
      
      <SongItemSubFilters 
        groupKey={groupKey}
        showSubFilters={showSubFilters} 
        setShowSubFilters={setShowSubFilters} 
      />
    </div>
  );
};
