import React, { useState } from 'react';
import { Check, Star, ThumbsUp, ThumbsDown, Pin } from 'lucide-react';
import { SongContextMenu } from '../../../widgets/workspace/ui/SongContextMenu';
import { useLibrary } from '../../../features/library/model/LibraryContext';
import { useUI } from '../../../features/ui/model/UIContext';

interface SongCardProps {
  id: string;
  duration: string;
  coverColor: string;
  onClick?: (e: React.MouseEvent) => void;
  onCheck?: (e: React.MouseEvent) => void;
  isFavorite?: boolean;
  onSetFavorite?: (e: React.MouseEvent) => void;
  isLiked?: boolean;
  isDisliked?: boolean;
  isPinned?: boolean;
  takeNumber?: number;
}

export const SongCard: React.FC<SongCardProps> = ({ 
  id, duration, coverColor, onClick, onCheck,
  isFavorite, onSetFavorite, isLiked, isDisliked, isPinned, takeNumber
}) => {
  const { handleDelete, groupFavorites, songs, handleToggleLike, handleToggleDislike, handleTogglePin } = useLibrary();
  const { selectedItemIds, checkedSongIds } = useUI();

  const isSelected = selectedItemIds.has(id);
  const isChecked = checkedSongIds.has(id);
  const [showMenu, setShowMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<DOMRect | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const handleMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    // This is now only used via context menu since button was removed
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
    if (selectedItemIds.has(id)) {
      const favoriteIds = new Set(Object.values(groupFavorites));
      const idsToDelete = (Array.from(selectedItemIds) as string[]).filter(itemId => {
        if (favoriteIds.has(itemId)) return false;
        if (itemId.includes('|')) return false;
        return true;
      });

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
    }
  };

  const canExcludeFavorite = () => {
    if (!selectedItemIds.has(id)) return false;
    const selection = Array.from(selectedItemIds) as string[];
    const favoriteIds = new Set(Object.values(groupFavorites));
    
    if (selection.length > 1) {
      return selection.some(itemId => favoriteIds.has(itemId) || itemId.includes('|'));
    }
    
    const singleId = selection[0];
    return singleId.includes('|');
  };

  return (
    <>
      <div 
        onClick={onClick}
        onContextMenu={handleContextMenu}
        className="relative flex items-center group cursor-pointer transition-colors py-1.5"
      >
        {/* Artwork Container */}
        <div className={`relative w-(--song-w-child) h-(--song-h-child) rounded-xl shrink-0 overflow-hidden bg-gradient-to-tr ${coverColor} shadow-lg`}>
          {/* Selection Indicator (Square) - Center Left */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onCheck?.(e);
            }}
            className={`absolute left-1.75 top-1/2 -translate-y-1/2 z-30 w-3 h-3 rounded-[2px] border transition-all flex items-center justify-center ${
            isChecked 
              ? 'opacity-100 bg-zinc-100 border-zinc-100' 
              : `border-white/40 bg-black/20 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'}`
          }`}>
            {isChecked && <Check className="w-2 h-2 text-black stroke-[5]" />}
          </div>

          {/* Favorite Star - Top Left */}
          <div className={`absolute left-1 top-1 z-30 flex items-center transition-all duration-300 ease-out ${isFavorite || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); onSetFavorite?.(e); }}
              className={`p-0.5 transition-colors drop-shadow-md ${isFavorite ? 'text-yellow-500' : 'text-white/70 hover:text-white'}`}
            >
              <Star className="w-3.5 h-3.5" fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/20 transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-white drop-shadow-lg w-4 h-4 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute bottom-1.5 right-1.5 bg-black/60 backdrop-blur-sm text-white font-bold rounded text-[8px] px-1 py-0.5">
            {duration}
          </div>

          {/* Take Badge */}
          {takeNumber && (
            <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-sm text-white font-bold rounded text-[8px] px-1 py-0.5">
              T{takeNumber}
            </div>
          )}
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
