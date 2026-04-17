import React, { useRef, useEffect } from 'react';
import { Filter, ThumbsUp, ThumbsDown, EyeOff, Check } from 'lucide-react';
import { useUIStore } from '@/app/store/useUIStore';

interface Props {
  showSubFilters: boolean;
  setShowSubFilters: (show: boolean) => void;
}

export const SongItemSubFilters: React.FC<Props> = ({ showSubFilters, setShowSubFilters }) => {
  const { subFilters, toggleSubFilter } = useUIStore();
  const subFilterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subFilterRef.current && !subFilterRef.current.contains(event.target as Node)) {
        setShowSubFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowSubFilters]);

  return (
    <div className="relative" ref={subFilterRef}>
      <button 
        onClick={(e) => {
          e.stopPropagation();
          setShowSubFilters(!showSubFilters);
        }}
        className={`p-1 rounded-md transition-colors ${showSubFilters ? 'bg-zinc-100 text-black' : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200'}`}
      >
        <Filter className="w-3 h-3" />
      </button>

      {showSubFilters && (
        <div 
          onClick={(e) => e.stopPropagation()}
          className="absolute top-full right-0 mt-2 w-48 bg-[#19191b] border border-zinc-800 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
        >
          <button 
            onClick={() => toggleSubFilter('liked')}
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ThumbsUp className={`w-3.5 h-3.5 ${subFilters.liked ? 'text-zinc-100' : 'text-zinc-500'}`} />
              <span className={`text-[12px] ${subFilters.liked ? 'text-zinc-100 font-bold' : 'text-zinc-400'}`}>Liked</span>
            </div>
            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${subFilters.liked ? 'bg-zinc-100 border-zinc-100' : 'border-zinc-700'}`}>
              {subFilters.liked && <Check className="w-2.5 h-2.5 text-black stroke-[4]" />}
            </div>
          </button>

          <button 
            onClick={() => toggleSubFilter('disliked')}
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <ThumbsDown className={`w-3.5 h-3.5 ${subFilters.disliked ? 'text-zinc-100' : 'text-zinc-500'}`} />
              <span className={`text-[12px] ${subFilters.disliked ? 'text-zinc-100 font-bold' : 'text-zinc-400'}`}>Disliked</span>
            </div>
            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${subFilters.disliked ? 'bg-zinc-100 border-zinc-100' : 'border-zinc-700'}`}>
              {subFilters.disliked && <Check className="w-2.5 h-2.5 text-black stroke-[4]" />}
            </div>
          </button>

          <div className="h-[1px] bg-zinc-800 my-1 mx-2" />

          <button 
            onClick={() => toggleSubFilter('hideDisliked')}
            className="w-full px-3 py-2 flex items-center justify-between hover:bg-zinc-800 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <EyeOff className={`w-3.5 h-3.5 ${subFilters.hideDisliked ? 'text-zinc-100' : 'text-zinc-500'}`} />
              <span className={`text-[12px] ${subFilters.hideDisliked ? 'text-zinc-100 font-bold' : 'text-zinc-400'}`}>Hide Disliked</span>
            </div>
            <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center ${subFilters.hideDisliked ? 'bg-zinc-100 border-zinc-100' : 'border-zinc-700'}`}>
              {subFilters.hideDisliked && <Check className="w-2.5 h-2.5 text-black stroke-[4]" />}
            </div>
          </button>
        </div>
      )}
    </div>
  );
};
