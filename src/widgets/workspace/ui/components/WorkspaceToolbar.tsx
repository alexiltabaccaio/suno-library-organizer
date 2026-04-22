import React from 'react';
import { Search, ListFilter, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { FilterDropdown } from './FilterDropdown';
import { Filters } from '@/app/store/useUIStore';

interface WorkspaceToolbarProps {
  filters: Filters;
  toggleFilter: (key: keyof Filters) => void;
  showFilters: boolean;
  setShowFilters: (val: boolean) => void;
  filterRef: React.RefObject<HTMLDivElement | null>;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number | ((prev: number) => number)) => void;
}

export const WorkspaceToolbar: React.FC<WorkspaceToolbarProps> = ({
  filters,
  toggleFilter,
  showFilters,
  setShowFilters,
  filterRef,
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="px-4 py-2 flex items-center justify-between gap-2 md:gap-4" onClick={(e) => e.stopPropagation()}>
      {/* Desktop Search */}
      <div className="hidden md:block flex-1 max-w-md relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search" 
          className="w-full bg-[#19191b] text-sm text-zinc-100 placeholder:text-zinc-500 rounded-full pl-9 pr-4 py-2 outline-none border border-transparent focus:border-zinc-800"
        />
      </div>

      {/* Mobile Search Button (Disabled Visual) */}
      <button className="md:hidden w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#19191b] flex items-center justify-center text-zinc-500 shrink-0 opacity-40 grayscale pointer-events-none cursor-default">
        <Search className="w-3.5 h-3.5" />
      </button>

      <div className="flex items-center gap-2 text-sm flex-1 md:flex-none justify-between md:justify-end">
        <div className="flex items-center gap-2">
          <FilterDropdown 
            filters={filters}
            toggleFilter={toggleFilter}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            filterRef={filterRef}
          />

          <button className="flex items-center gap-1.5 bg-[#19191b] px-3 py-1.5 md:px-3 md:py-1.5 h-8 md:h-10 rounded-full text-zinc-500 opacity-40 grayscale pointer-events-none cursor-default text-xs md:text-sm">
            <ListFilter className="w-3.5 h-3.5 md:w-3.5 md:h-3.5" />
            <span className="hidden md:inline">Newest</span>
            <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-zinc-500" />
          </button>
        </div>

        <div className="hidden md:flex items-center bg-[#19191b] rounded-full p-0.5 h-10 opacity-40 grayscale pointer-events-none cursor-default">
          <button className="px-3 py-1 text-zinc-500">Liked</button>
          <button className="px-3 py-1 text-zinc-500">Public</button>
          <button className="px-3 py-1 text-zinc-500">Uploads</button>
        </div>

        <div className="flex items-center gap-1 bg-[#19191b] rounded-full px-2 h-8 md:h-10">
          <button 
            onClick={() => onPageChange(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
            className={`p-1 transition-colors ${currentPage === 1 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-zinc-300 text-xs font-medium px-1 min-w-[20px] text-center">
            {currentPage}
          </span>
          <button 
            onClick={() => onPageChange(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
            className={`p-1 transition-colors ${currentPage === totalPages ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-500 hover:text-zinc-300'}`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
