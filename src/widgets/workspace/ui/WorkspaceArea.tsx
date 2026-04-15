import React, { useState, useMemo, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, Pencil, Search, Filter, ChevronDown, ChevronLeft, ListFilter, Sparkles, Type, Highlighter, Palette, ThumbsUp, ThumbsDown, EyeOff, Check } from 'lucide-react';
import { useLibrary } from '../../../features/library/model/LibraryContext';
import { useUI } from '../../../features/ui/model/UIContext';
import { useEditor } from '../../../features/editor/model/EditorContext';
import { Song } from '../../../entities/song/model/types';
import { useSongGrouping } from '../../../features/library/hooks/useSongGrouping';
import { BeforeView } from './views/BeforeView';
import { V1ListView } from './views/V1ListView';
import { V2GridView } from './views/V2GridView';

interface WorkspaceAreaProps {
  hideFooter?: boolean;
}

export const WorkspaceArea: React.FC<WorkspaceAreaProps> = ({ hideFooter = false }) => {
  const { 
    songs, handleRenameSong, handleSetFavorite, groupFavorites
  } = useLibrary();
  const {
    checkedSongIds, handleSelectItem, toggleCheck, toggleGroupCheck, viewMode, setViewMode,
    filters, toggleFilter, subFilters, toggleSubFilter, selectedSong, clearItemSelection
  } = useUI();
  const { formattingMode, setFormattingMode } = useEditor();

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 12;

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle group key changes to preserve expanded state
  React.useEffect(() => {
    const handleGroupRenamed = (e: any) => {
      const { oldKey, newKey } = e.detail;
      setExpandedGroups(prev => {
        if (prev.has(oldKey)) {
          const next = new Set(prev);
          next.delete(oldKey);
          next.add(newKey);
          return next;
        }
        return prev;
      });
    };

    window.addEventListener('groupRenamed', handleGroupRenamed);
    return () => window.removeEventListener('groupRenamed', handleGroupRenamed);
  }, []);

  // Reset page when view mode changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  const { sortedSongs, groupedSongs, songsWithTakeNumbers } = useSongGrouping(songs, groupFavorites);

  // Filter logic
  const filteredGroupedSongs = useMemo(() => {
    return groupedSongs.filter(group => {
      const favoriteId = groupFavorites[group.key] || group.songs[0].id;
      const favoriteSong = group.songs.find(s => s.id === favoriteId) || group.songs[0];

      // Check if favorite song matches main filters
      const matchesMain = (
        (!filters.liked || favoriteSong.isLiked) &&
        (!filters.disliked || favoriteSong.isDisliked) &&
        (!filters.hideDisliked || !favoriteSong.isDisliked)
      );

      if (matchesMain) return true;

      // Check if any song in the group matches sub-filters
      // This ensures the group header stays visible if we want to see its sub-content
      const matchesSub = group.songs.some(s => {
        return (
          (!subFilters.liked || s.isLiked) &&
          (!subFilters.disliked || s.isDisliked) &&
          (!subFilters.hideDisliked || !s.isDisliked)
        );
      });

      return matchesSub;
    });
  }, [groupedSongs, filters, subFilters, groupFavorites]);

  const filteredSortedSongs = useMemo(() => {
    return sortedSongs.filter(song => {
      if (filters.liked && !song.isLiked) return false;
      if (filters.disliked && !song.isDisliked) return false;
      if (filters.hideDisliked && song.isDisliked) return false;
      return true;
    });
  }, [sortedSongs, filters]);

  // Pagination logic
  const paginatedData = useMemo(() => {
    if (viewMode === 'before') {
      const totalPages = Math.ceil(filteredSortedSongs.length / ITEMS_PER_PAGE);
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return {
        items: filteredSortedSongs.slice(start, end),
        totalPages: Math.max(1, totalPages)
      };
    } else {
      const totalPages = Math.ceil(filteredGroupedSongs.length / ITEMS_PER_PAGE);
      const start = (currentPage - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE;
      return {
        items: filteredGroupedSongs.slice(start, end),
        totalPages: Math.max(1, totalPages)
      };
    }
  }, [viewMode, filteredSortedSongs, filteredGroupedSongs, currentPage]);

  const visibleIds = useMemo(() => {
    if (viewMode === 'before') return (paginatedData.items as Song[]).map(s => s.id);
    
    const ids: string[] = [];
    (paginatedData.items as any[]).forEach(group => {
      if (group.songs.length === 1) {
        ids.push(group.songs[0].id);
      } else {
        ids.push(group.key);
        if (expandedGroups.has(group.key)) {
          const filteredSubSongs = group.songs.filter((s: Song) => {
            if (subFilters.liked && !s.isLiked) return false;
            if (subFilters.disliked && !s.isDisliked) return false;
            if (subFilters.hideDisliked && s.isDisliked) return false;
            return true;
          });
          filteredSubSongs.forEach((s: Song) => ids.push(s.id));
        }
      }
    });
    return ids;
  }, [viewMode, paginatedData.items, expandedGroups, subFilters]);

  const toggleGroup = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div 
      className="flex-1 h-full flex flex-col bg-[#101012] overflow-hidden"
      onClick={() => clearItemSelection()}
    >
      {/* Header */}
      <div 
        className="px-4 pt-6 pb-4 flex items-center justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 text-[15px] font-medium">
          <span className="text-zinc-100">Workspaces</span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-400">Test</span>
          <button className="text-zinc-600 hover:text-zinc-400 ml-1">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2 flex items-center justify-between gap-2 md:gap-4">
        {/* Desktop Search */}
        <div className="hidden md:block flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-[#19191b] text-sm text-zinc-100 placeholder:text-zinc-500 rounded-full pl-9 pr-4 py-2 outline-none border border-transparent focus:border-zinc-800"
          />
        </div>

        {/* Mobile Search Button */}
        <button className="md:hidden w-10 h-10 rounded-full bg-[#19191b] flex items-center justify-center text-zinc-300 shrink-0">
          <Search className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-sm flex-1 md:flex-none justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <div className="relative" ref={filterRef}>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 bg-[#19191b] hover:bg-zinc-800 transition-colors px-3 py-1.5 md:px-3 md:py-1.5 h-10 rounded-full ${showFilters ? 'text-zinc-100 bg-zinc-800' : 'text-zinc-300'}`}
              >
                <Filter className="w-4 h-4 md:w-3.5 md:h-3.5" />
                <span className="hidden md:inline">Filters ({Object.values(filters).filter(Boolean).length})</span>
                <ChevronDown className={`w-3.5 h-3.5 ml-0.5 text-zinc-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-52 bg-[#19191b] border border-zinc-800 rounded-xl shadow-2xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
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

            <button className="flex items-center gap-1.5 bg-[#19191b] hover:bg-zinc-800 transition-colors px-3 py-1.5 md:px-3 md:py-1.5 h-10 rounded-full text-zinc-300">
              <ListFilter className="w-4 h-4 md:w-3.5 md:h-3.5" />
              <span className="hidden md:inline">Newest</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-zinc-500" />
            </button>
          </div>

          <div className="hidden md:flex items-center bg-[#19191b] rounded-full p-0.5 h-10">
            <button className="px-3 py-1 text-zinc-400 hover:text-zinc-200">Liked</button>
            <button className="px-3 py-1 text-zinc-400 hover:text-zinc-200">Public</button>
            <button className="px-3 py-1 text-zinc-400 hover:text-zinc-200">Uploads</button>
          </div>

          <div className="flex items-center gap-1 bg-[#19191b] rounded-full px-2 h-10">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className={`p-1 transition-colors ${currentPage === 1 ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-zinc-300 text-xs font-medium px-1 min-w-[20px] text-center">
              {currentPage}
            </span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(paginatedData.totalPages, prev + 1))}
              disabled={currentPage === paginatedData.totalPages}
              className={`p-1 transition-colors ${currentPage === paginatedData.totalPages ? 'text-zinc-700 cursor-not-allowed' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Song List */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-4 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <div className="space-y-1 relative pl-0">
          {viewMode === 'before' ? (
            <BeforeView 
              songs={paginatedData.items as Song[]}
              songsWithTakeNumbers={songsWithTakeNumbers}
              visibleIds={visibleIds}
              toggleCheck={toggleCheck}
              handleSelectItem={handleSelectItem}
              handleRenameSong={handleRenameSong}
            />
          ) : viewMode === 'v1' ? (
            <V1ListView 
              groupedSongs={paginatedData.items as any[]}
              songsWithTakeNumbers={songsWithTakeNumbers}
              checkedSongIds={checkedSongIds}
              visibleIds={visibleIds}
              expandedGroups={expandedGroups}
              groupFavorites={groupFavorites}
              toggleCheck={toggleCheck}
              toggleGroupCheck={toggleGroupCheck}
              handleSelectItem={handleSelectItem}
              handleRenameSong={handleRenameSong}
              handleSetFavorite={handleSetFavorite}
              toggleGroup={toggleGroup}
            />
          ) : (
            <V2GridView 
              groupedSongs={paginatedData.items as any[]}
              songsWithTakeNumbers={songsWithTakeNumbers}
              checkedSongIds={checkedSongIds}
              visibleIds={visibleIds}
              expandedGroups={expandedGroups}
              groupFavorites={groupFavorites}
              toggleCheck={toggleCheck}
              toggleGroupCheck={toggleGroupCheck}
              handleSelectItem={handleSelectItem}
              handleRenameSong={handleRenameSong}
              handleSetFavorite={handleSetFavorite}
              toggleGroup={toggleGroup}
            />
          )}
        </div>
      </div>

      {/* New Footer */}
      {!hideFooter && (
        <motion.div 
          initial={false}
          animate={{ paddingRight: selectedSong ? 24 : 404 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="hidden md:grid grid-cols-1 lg:grid-cols-3 items-center px-6 py-8 border-t border-zinc-800/50 bg-[#101012] gap-8 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Smart Lyrics Editor Badge - Left Aligned */}
          <div className="flex flex-col items-center lg:items-start gap-2 order-1">
            <a 
              href="https://github.com/alexiltabaccaio/suno-flow-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer group"
            >
              <Sparkles className="w-3.5 h-3.5 text-pink-500/50 group-hover:text-pink-400 transition-colors" />
              <span className="text-[11px] font-medium tracking-widest uppercase">
                Smart Lyrics Editor
              </span>
            </a>
            
            <div className="flex items-center bg-zinc-900/50 rounded-lg p-0.5 border border-zinc-800/50">
              <button
                onClick={() => setFormattingMode('none')}
                className={`p-1 rounded-md transition-all ${formattingMode === 'none' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                title="Plain text"
              >
                <Type className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFormattingMode('simple')}
                className={`p-1 rounded-md transition-all ${formattingMode === 'simple' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                title="B&W Formatting"
              >
                <Highlighter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFormattingMode('colored')}
                className={`p-1 rounded-md transition-all ${formattingMode === 'colored' ? 'bg-cyan-500/20 text-cyan-400 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
                title="Color formatting"
              >
                <Palette className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Center Content */}
          <div className="flex flex-col items-center gap-4 order-2">
            <h2 className="text-zinc-400 text-lg font-semibold tracking-tight uppercase opacity-50">
              Suno Library Organizer
            </h2>
            
            <div className="flex items-center bg-[#19191b] rounded-full p-1 border border-zinc-800/50">
              <button 
                onClick={() => setViewMode('before')}
                className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${
                  viewMode === 'before' 
                    ? 'bg-zinc-100 text-black shadow-lg' 
                    : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                Before
              </button>
              <div className="flex items-center ml-1 bg-zinc-800/30 rounded-full p-0.5">
                <button 
                  onClick={() => setViewMode('v1')}
                  className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                    viewMode === 'v1' 
                      ? 'bg-zinc-100 text-black shadow-md' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  V1
                </button>
                <button 
                  onClick={() => setViewMode('v2')}
                  className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                    viewMode === 'v2' 
                      ? 'bg-zinc-100 text-black shadow-md' 
                      : 'text-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  V2
                </button>
              </div>
            </div>

            <p className="text-[10px] text-zinc-600 font-medium tracking-tight">
              Prototype developed by{' '}
              <a 
                href="https://www.linkedin.com/in/alexgiustizieri/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
              >
                Alex Giustizieri
              </a>
            </p>
          </div>

          {/* Right Spacer for centering */}
          <div className="hidden lg:block order-3"></div>
        </motion.div>
      )}
    </div>
  );
};

