import React from 'react';
import { ThumbsUp, ThumbsDown, Pin } from 'lucide-react';
import { Song } from '../../../../../entities/song/model/types';

interface GroupActionPanelProps {
  groupKey: string;
  paginatedSubSongs: Song[];
  checkedSongIds: Set<string>;
  hoveredSongId: string | null;
  hoveredActionsGroupKey: string | null;
  selectedSongId: string | null;
  selectedItemId: string | null;
  favoriteSong: Song;
  onHoverActions: (key: string | null) => void;
  onToggleLike: (ids: string[], val: boolean) => void;
  onToggleDislike: (ids: string[], val: boolean) => void;
  onTogglePin: (ids: string[], val: boolean) => void;
}

export const GroupActionPanel: React.FC<GroupActionPanelProps> = ({
  groupKey,
  paginatedSubSongs,
  checkedSongIds,
  hoveredSongId,
  hoveredActionsGroupKey,
  selectedSongId,
  selectedItemId,
  favoriteSong,
  onHoverActions,
  onToggleLike,
  onToggleDislike,
  onTogglePin
}) => {
  const hasChecked = paginatedSubSongs.some(s => checkedSongIds.has(s.id));
  const isHovered = paginatedSubSongs.some(s => s.id === hoveredSongId) || hoveredActionsGroupKey === groupKey;
  const isItemSelected = paginatedSubSongs.some(s => s.id === selectedItemId);
  const isVisible = hasChecked || isHovered || isItemSelected;

  const detailInRow = paginatedSubSongs.find(s => s.id === selectedSongId || s.id === selectedItemId);
  const hoveredInRow = paginatedSubSongs.find(s => s.id === hoveredSongId);
  const selectedInRow = paginatedSubSongs.filter(s => checkedSongIds.has(s.id));
  
  const targetIds = selectedInRow.length > 0 
    ? selectedInRow.map(s => s.id) 
    : (detailInRow ? [detailInRow.id] : [favoriteSong.id]);

  let displayState = {
    isLiked: false,
    isDisliked: false,
    isPinned: false
  };

  if (hoveredInRow) {
    displayState = { isLiked: hoveredInRow.isLiked, isDisliked: hoveredInRow.isDisliked, isPinned: hoveredInRow.isPinned };
  } else if (selectedInRow.length > 0) {
    displayState = {
      isLiked: selectedInRow.every(s => s.isLiked),
      isDisliked: selectedInRow.every(s => s.isDisliked),
      isPinned: selectedInRow.every(s => s.isPinned)
    };
  } else if (detailInRow) {
    displayState = { isLiked: detailInRow.isLiked, isDisliked: detailInRow.isDisliked, isPinned: detailInRow.isPinned };
  } else {
    displayState = { isLiked: favoriteSong.isLiked, isDisliked: favoriteSong.isDisliked, isPinned: favoriteSong.isPinned };
  }

  return (
    <div 
      onMouseEnter={() => onHoverActions(groupKey)}
      onMouseLeave={() => onHoverActions(null)}
      className={`flex flex-col items-center gap-3 py-2 mr-2 w-6 shrink-0 z-10 transition-opacity duration-200 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          onToggleLike(targetIds, !displayState.isLiked); 
        }}
        className={`transition-colors ${displayState.isLiked ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
      >
        <ThumbsUp className="w-3.5 h-3.5" fill={displayState.isLiked ? "currentColor" : "none"} />
      </button>
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          onToggleDislike(targetIds, !displayState.isDisliked); 
        }}
        className={`transition-colors ${displayState.isDisliked ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
      >
        <ThumbsDown className="w-3.5 h-3.5" fill={displayState.isDisliked ? "currentColor" : "none"} />
      </button>
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          onTogglePin(targetIds, !displayState.isPinned); 
        }}
        className={`transition-colors ${displayState.isPinned ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
      >
        <Pin className="w-3.5 h-3.5" fill={displayState.isPinned ? "currentColor" : "none"} />
      </button>
    </div>
  );
};
