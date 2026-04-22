import React from 'react';
import { Filter, ChevronDown, ThumbsUp, ThumbsDown, EyeOff, Check } from 'lucide-react';

interface Filters {
  liked: boolean;
  disliked: boolean;
  hideDisliked: boolean;
}

interface FilterDropdownProps {
  filters: Filters;
  toggleFilter: (filter: keyof Filters) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  filterRef: React.RefObject<HTMLDivElement | null>;
}

export const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filters,
  toggleFilter,
  showFilters,
  setShowFilters,
  filterRef
}) => {
  return (
    <div className="relative" ref={filterRef}>
      <button 
        onClick={() => setShowFilters(!showFilters)}
        className={`flex items-center gap-1.5 bg-[#19191b] hover:bg-zinc-800 transition-colors px-3 py-1.5 md:px-3 md:py-1.5 h-8 md:h-10 rounded-full text-xs md:text-sm ${showFilters ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-300'}`}
      >
        <Filter className="w-4 h-4 md:w-3.5 md:h-3.5" />
        <span className="hidden md:inline">Filters ({Object.values(filters).filter(Boolean).length})</span>
        <ChevronDown className={`w-3.5 h-3.5 ml-0.5 text-zinc-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
      </button>

      {showFilters && (
        <div className="absolute top-full left-0 md:right-0 md:left-auto mt-2 w-52 bg-[#19191b] border border-zinc-800 rounded-xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100 origin-top-left md:origin-top-right">
          <button 
            onClick={() => toggleFilter('liked')}
            className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ThumbsUp className={`w-4 h-4 ${filters.liked ? 'text-zinc-100' : 'text-zinc-500'}`} />
              <span className={`text-sm ${filters.liked ? 'text-zinc-100 font-bold' : 'text-zinc-400'}`}>Liked</span>
            </div>
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.liked ? 'bg-zinc-100 border-zinc-100' : 'border-zinc-700'}`}>
              {filters.liked && <Check className="w-3 h-3 text-black stroke-[4]" />}
            </div>
          </button>

          <button 
            onClick={() => toggleFilter('disliked')}
            className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <ThumbsDown className={`w-4 h-4 ${filters.disliked ? 'text-zinc-100' : 'text-zinc-500'}`} />
              <span className={`text-sm ${filters.disliked ? 'text-zinc-100 font-bold' : 'text-zinc-400'}`}>Disliked</span>
            </div>
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.disliked ? 'bg-zinc-100 border-zinc-100' : 'border-zinc-700'}`}>
              {filters.disliked && <Check className="w-3 h-3 text-black stroke-[4]" />}
            </div>
          </button>

          <div className="h-[1px] bg-zinc-800 my-1 mx-2" />

          <button 
            onClick={() => toggleFilter('hideDisliked')}
            className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-3">
              <EyeOff className={`w-4 h-4 ${filters.hideDisliked ? 'text-zinc-100' : 'text-zinc-500'}`} />
              <span className={`text-sm ${filters.hideDisliked ? 'text-zinc-100 font-bold' : 'text-zinc-400'}`}>Hide Disliked</span>
            </div>
            <div className={`w-4 h-4 rounded border flex items-center justify-center ${filters.hideDisliked ? 'bg-zinc-100 border-zinc-100' : 'border-zinc-700'}`}>
              {filters.hideDisliked && <Check className="w-3 h-3 text-black stroke-[4]" />}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
