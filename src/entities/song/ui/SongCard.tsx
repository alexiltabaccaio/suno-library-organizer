import React from 'react';
import { Check, Star } from 'lucide-react';
import { SongContextMenu } from '@/widgets/workspace/ui/SongContextMenu';
import { useUIStore } from '@/app/store/useUIStore';
import { useSongItemMenu } from './hooks/useSongItemMenu';

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
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export const SongCard: React.FC<SongCardProps> = ({ 
  id, duration, coverColor, onClick, onCheck,
  isFavorite, onSetFavorite, isLiked, isDisliked, isPinned, takeNumber,
  onMouseEnter, onMouseLeave
}) => {
  const { checkedSongIds, selectedItemId } = useUIStore();

  const isSelected = checkedSongIds.has(id) || selectedItemId === id;
  const isChecked = checkedSongIds.has(id);
  
  const {
    showMenu, setShowMenu, menuAnchor, menuPosition,
    handleContextMenu, onDelete, onDeleteExcludeFavorite, canExcludeFavorite
  } = useSongItemMenu(id, false);

  return (
    <>
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        onContextMenu={handleContextMenu}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        data-selectable-id={id}
        className={`relative flex items-center group cursor-pointer py-1.5 px-1 song-card ${isSelected ? 'is-selected' : ''}`}
      >
        {/* Artwork Container */}
        <div className={`relative w-(--song-w-child) h-(--song-h-child) rounded-xl shrink-0 overflow-hidden bg-gradient-to-tr ${coverColor} shadow-lg`}>
          {/* Selection Indicator (Square) - Center Left */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onCheck?.(e);
            }}
            className={`absolute left-[6.8px] top-1/2 -translate-y-1/2 z-30 w-3 h-3 rounded-[2px] border flex items-center justify-center ${
            isChecked 
              ? 'opacity-100 bg-zinc-100 border-zinc-100' 
              : `border-white/40 bg-black/20 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'}`
          }`}>
            {isChecked && <Check className="w-2 h-2 text-black stroke-[5]" />}
          </div>

          {/* Favorite Star - Top Left */}
          <div className={`absolute left-1 top-1 z-30 flex items-center ${isFavorite || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'}`}>
            <button 
              onClick={(e) => { e.stopPropagation(); onSetFavorite?.(e); }}
              className={`p-0.5 transition-colors drop-shadow-md ${isFavorite ? 'text-yellow-500' : 'text-white/70 hover:text-white'}`}
            >
              <Star className="w-3.5 h-3.5" fill={isFavorite ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/20 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-white drop-shadow-lg w-5 h-5 ml-0.5">
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
