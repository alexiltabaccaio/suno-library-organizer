import React, { useState, useRef, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, Pin, Share, MoreHorizontal, Check, Pencil, X, ChevronDown, ChevronRight, ChevronLeft, Layers, Star, Filter, EyeOff } from 'lucide-react';
import { SongContextMenu } from '../../../widgets/workspace/ui/SongContextMenu';
import { useLibrary } from '../../../features/library/model/LibraryContext';
import { useUI } from '../../../features/ui/model/UIContext';
import { useGlobalTimeTick } from '../../../shared/hooks/useGlobalTimeTick';

interface SongItemProps {
  id: string; // Added id to props
  title: string;
  styles: string;
  duration: string;
  version: string;
  coverColor: string;
  notes?: string;
  isRenamed?: boolean;
  takeNumber?: number;
  isChecked?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onCheck?: (e: React.MouseEvent) => void;
  onRename?: (newTitle: string) => void;
  isGroupHeader?: boolean;
  groupCount?: number;
  isExpanded?: boolean;
  onToggleExpand?: (e: React.MouseEvent) => void;
  isChild?: boolean;
  isFavorite?: boolean;
  onSetFavorite?: (e: React.MouseEvent) => void;
  isLiked?: boolean;
  isDisliked?: boolean;
  isPinned?: boolean;
  createdAt?: Date;
  subPage?: number;
  totalSubPages?: number;
  onSubPageChange?: (page: number) => void;
}

const formatRelativeTime = (date?: Date) => {
  if (!date) return '';
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'less than 1 minute ago';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

export const SongItem: React.FC<SongItemProps> = ({ 
  id, title, styles, duration, version, coverColor, notes, isRenamed, takeNumber, isChecked: isCheckedProp, onClick, onCheck, onRename,
  isGroupHeader, groupCount, isExpanded, onToggleExpand, isChild, isFavorite, onSetFavorite,
  isLiked, isDisliked, isPinned, createdAt,
  subPage = 1, totalSubPages = 1, onSubPageChange
}) => {
  const { handleDelete, groupFavorites, songs, handleToggleLike, handleToggleDislike, handleTogglePin } = useLibrary();
  const { selectedItemIds, checkedSongIds, subFilters, toggleSubFilter } = useUI();

  const isSelected = selectedItemIds.has(id);
  const isChecked = isCheckedProp !== undefined ? isCheckedProp : checkedSongIds.has(id);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(notes || title);
  const [showMenu, setShowMenu] = useState(false);
  const [showSubFilters, setShowSubFilters] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<DOMRect | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const subFilterRef = useRef<HTMLDivElement>(null);

  // Close sub-filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (subFilterRef.current && !subFilterRef.current.contains(event.target as Node)) {
        setShowSubFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Highly performant global clock to update relative time
  useGlobalTimeTick(!!isChild && !isRenamed);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(isChild ? (notes || '') : title);
  };

  const handleConfirmEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    const currentVal = isChild ? (notes || '') : title;
    if (editTitle.trim() !== currentVal) {
      onRename?.(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditTitle(notes || title);
  };

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (showMenu && menuAnchor) {
      setShowMenu(false);
    } else {
      if (moreButtonRef.current) {
        setMenuPosition(null);
        setMenuAnchor(moreButtonRef.current.getBoundingClientRect());
        setShowMenu(true);
      }
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setMenuAnchor(null);
    setMenuPosition({ x: e.clientX, y: e.clientY });
    setShowMenu(true);
  };

  const onDelete = () => {
    if (selectedItemIds.has(id)) {
      handleDelete(Array.from(selectedItemIds));
    } else {
      handleDelete([id]);
    }
  };

  const onDeleteExcludeFavorite = () => {
    if (selectedItemIds.has(id) && selectedItemIds.size > 1) {
      // Find which IDs in the selection are favorites
      const favoriteIds = new Set(Object.values(groupFavorites));
      const idsToDelete = (Array.from(selectedItemIds) as string[]).filter(itemId => {
        // If it's a song ID, check if it's a favorite
        if (favoriteIds.has(itemId)) return false;
        
        // Let's check if this itemId is a group key
        const isGroupKey = itemId.includes('|');
        if (isGroupKey) {
          return false; // Don't delete group headers in this mode
        }

        return true;
      });

      // Special case: if a group header is selected, we should delete all its songs EXCEPT the favorite
      const finalIdsToDelete: string[] = [...idsToDelete];
      (Array.from(selectedItemIds) as string[]).forEach(itemId => {
        if (itemId.includes('|')) {
          const groupKey = itemId;
          const groupSongs = songs.filter(s => `${s.title}|${s.styles}|${s.lyrics}` === groupKey);
          const favId = groupFavorites[groupKey] || groupSongs[0]?.id;
          groupSongs.forEach(s => {
            if (s.id !== favId) finalIdsToDelete.push(s.id);
          });
        }
      });

      handleDelete(finalIdsToDelete);
    } else {
      // Single item action (either selected or just clicked via menu)
      if (isGroupHeader) {
        const groupKey = id;
        const groupSongs = songs.filter(s => `${s.title}|${s.styles}|${s.lyrics}` === groupKey);
        const favId = groupFavorites[groupKey] || groupSongs[0]?.id;
        const finalIdsToDelete = groupSongs.filter(s => s.id !== favId).map(s => s.id);
        handleDelete(finalIdsToDelete);
      }
    }
  };

  // Check if selection includes at least one explicit favorite and has other items to delete
  const canExcludeFavorite = () => {
    // If this specific item is a group header and has a favorite, we can always show it
    if (isGroupHeader && !!groupFavorites[id]) {
      return true;
    }

    if (!selectedItemIds.has(id)) return false;
    const selection = Array.from(selectedItemIds) as string[];
    const favoriteIds = new Set(Object.values(groupFavorites));
    
    // If multiple items are selected, show if there's at least one explicit favorite to keep
    if (selection.length > 1) {
      return selection.some(itemId => favoriteIds.has(itemId) || (itemId.includes('|') && !!groupFavorites[itemId]));
    }
    
    return false;
  };

  return (
    <>
      <div 
        onClick={(e) => {
          onClick?.(e);
          // Only toggle expansion if no modifier keys are pressed
          if (isGroupHeader && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
            onToggleExpand?.(e);
          }
        }}
        onContextMenu={handleContextMenu}
        className={`relative flex items-center gap-4 p-2 rounded-xl group cursor-pointer transition-colors ${
          isSelected ? 'bg-zinc-800/80' : 'hover:bg-zinc-900/40'
        } ${isChild ? 'py-1.5' : ''}`}
      >
        {/* Left Column: Selection & Favorite */}
        <div className="relative flex items-center justify-center shrink-0 w-3 h-10">
          {isChild && (
            <div className={`absolute -top-3 flex items-center transition-all duration-300 ease-out overflow-hidden ${isFavorite || isSelected ? 'h-4 opacity-100' : 'h-0 opacity-0 lg:group-hover:h-4 lg:group-hover:opacity-100'}`}>
              <button 
                onClick={(e) => { e.stopPropagation(); onSetFavorite?.(e); }}
                className={`p-0.5 transition-colors ${isFavorite ? 'text-yellow-500' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Star className="w-3 h-3" fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          )}
          
          {/* Selection Indicator (Square) */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onCheck?.(e);
            }}
            className={`w-3 h-3 rounded-[2px] border transition-all flex items-center justify-center ${
            isChecked 
              ? 'opacity-100 bg-zinc-100 border-zinc-100' 
              : `border-zinc-700 bg-transparent ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`
          }`}>
            {isChecked && <Check className="w-2 h-2 text-black stroke-[5]" />}
          </div>
        </div>

        {/* Artwork */}
        <div className={`relative ${isChild ? 'w-(--song-w-child) h-(--song-h-child)' : 'w-(--song-w) h-(--song-h) ml-[1px]'} rounded-xl shrink-0 overflow-hidden bg-gradient-to-tr ${coverColor} shadow-lg`}>
          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={`text-white drop-shadow-lg ${isChild ? "w-5 h-5 ml-0.5" : "w-7 h-7 ml-0.5"}`}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          
          <div className={`absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-sm text-white font-bold rounded ${isChild ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'}`}>
            {duration}
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 min-w-0 ${isChild ? 'h-(--song-h-child)' : 'h-(--song-h)'} flex flex-col justify-between py-1`}>
          <div>
            <div className={`flex items-center gap-2 ${isChild ? 'mb-0' : 'mb-0.5'}`}>
              {isEditing ? (
                <div className="flex items-center gap-1">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleConfirmEdit(e as any);
                      if (e.key === 'Escape') handleCancelEdit(e as any);
                    }}
                    autoFocus
                    onFocus={(e) => {
                      e.currentTarget.select();
                      e.currentTarget.setSelectionRange(0, e.currentTarget.value.length, 'backward');
                    }}
                    className={`bg-[#0047ab] font-bold text-zinc-100 px-1.5 py-1 rounded-sm outline-none border-b border-white ${isChild ? 'text-[14px] w-[200px]' : 'text-[16px] w-[250px]'}`}
                    placeholder={isChild ? "Add a note..." : "Enter title..."}
                  />
                  <button 
                    onClick={handleConfirmEdit}
                    className="p-1.5 text-zinc-100 hover:text-white transition-colors shrink-0"
                  >
                    <Check className={isChild ? "w-3.5 h-3.5" : "w-4 h-4"} />
                  </button>
                  <button 
                    onClick={handleCancelEdit}
                    className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
                  >
                    <X className={isChild ? "w-3.5 h-3.5" : "w-4 h-4"} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className={`font-bold truncate ${isChild ? (isRenamed ? 'text-zinc-100 text-[13px]' : `text-zinc-600 text-[13px] transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`) : 'text-zinc-100 text-[16px]'}`}>
                    {isChild ? (isRenamed ? notes : 'Add a note...') : title}
                  </h3>
                  <div className="flex items-center gap-1">
                    <div className={`flex items-center transition-all duration-300 ease-out overflow-hidden ${isSelected ? (isChild ? 'w-5' : 'w-6') : 'w-0 opacity-0 lg:group-hover:opacity-100'} ${isChild ? 'lg:group-hover:w-5' : 'lg:group-hover:w-6'}`}>
                      <button 
                        onClick={handleStartEdit}
                        className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        <Pencil className={isChild ? "w-3 h-3" : "w-4 h-4"} />
                      </button>
                    </div>
                    {!isChild && (
                      <>
                        <span className={`${version === 'v5.5' ? 'bg-pink-500/20 text-pink-400' : 'bg-zinc-800 text-zinc-400'} font-black px-2 py-0.5 rounded-md leading-none shrink-0 ml-1 uppercase text-[11px]`}>
                          {version}
                        </span>
                        {takeNumber && (
                          <span className={`bg-zinc-800 text-zinc-400 font-bold px-1.5 py-0.5 rounded-md leading-none shrink-0 ml-1 uppercase text-[10px]`}>
                            Take {takeNumber}
                          </span>
                        )}
                        {isGroupHeader && (
                          <>
                            <div className="flex items-center gap-1.5 bg-zinc-800/80 text-zinc-300 text-[11px] font-black px-2 py-0.5 rounded-md leading-none shrink-0">
                              <Layers className="w-3.5 h-3.5" />
                              {groupCount}
                            </div>
                            
                            {/* Sub-pagination */}
                            <div className="flex items-center gap-0.5 bg-zinc-800/80 rounded-md px-1 py-0.5 shrink-0 ml-1">
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (subPage < totalSubPages) onSubPageChange?.(groupCount > 0 ? subPage + 1 : subPage);
                                }}
                                disabled={subPage === totalSubPages}
                                className={`p-0.5 transition-colors ${subPage === totalSubPages ? 'text-zinc-700' : 'text-zinc-400 hover:text-zinc-200'}`}
                              >
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                            
                            {/* Sub-card Filters */}
                            <div className="relative ml-1" ref={subFilterRef}>
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
                                  className="absolute top-full left-0 mt-2 w-48 bg-[#19191b] border border-zinc-800 rounded-xl shadow-2xl z-50 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100"
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
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
            {isChild ? (
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-zinc-500 text-[11px] font-medium">
                  {formatRelativeTime(createdAt)}
                </span>
                <span className={`${version === 'v5.5' ? 'bg-pink-500/20 text-pink-400' : 'bg-zinc-800 text-zinc-400'} font-black px-1.5 py-0.5 rounded-md leading-none shrink-0 text-[8px] uppercase`}>
                  {version}
                </span>
                {takeNumber && (
                  <span className="bg-zinc-800 text-zinc-400 font-bold px-1 py-0.5 rounded-md leading-none shrink-0 text-[8px] uppercase">
                    Take {takeNumber}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-zinc-500 text-[14px] truncate leading-tight">
                {styles}
              </p>
            )}
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); handleToggleLike(id); }}
              className={`transition-colors ${isLiked ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
            >
              <ThumbsUp className={isChild ? "w-3.5 h-3.5" : "w-4 h-4"} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleToggleDislike(id); }}
              className={`transition-colors ${isDisliked ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
            >
              <ThumbsDown className={isChild ? "w-3.5 h-3.5" : "w-4 h-4"} fill={isDisliked ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleTogglePin(id); }}
              className={`transition-colors ${isPinned ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
            >
              <Pin className={isChild ? "w-3.5 h-3.5" : "w-4 h-4"} fill={isPinned ? "currentColor" : "none"} />
            </button>
            {!isChild && (
              <button className="text-zinc-600 hover:text-zinc-300 transition-colors">
                <Share className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* More Options */}
        <div className="flex items-center gap-1 ml-2">
          <button 
            ref={moreButtonRef}
            onClick={handleMoreClick}
            onMouseDown={(e) => e.stopPropagation()}
            className={`p-1.5 rounded-full text-zinc-600 hover:text-zinc-300 transition-all ${showMenu ? 'bg-zinc-800 text-zinc-100' : 'bg-transparent group-hover:bg-[#19191b]'}`}
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showMenu && (
        <SongContextMenu 
          anchorRect={menuAnchor}
          position={menuPosition}
          onClose={() => setShowMenu(false)}
          onDelete={onDelete}
          onDeleteExcludeFavorite={canExcludeFavorite() ? onDeleteExcludeFavorite : undefined}
        />
      )}
    </>
  );
};
