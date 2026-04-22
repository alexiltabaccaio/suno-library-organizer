import React from 'react';
import { ThumbsUp, ThumbsDown, Pin, Share, MoreHorizontal, Check, Pencil, X, Star, Plus } from 'lucide-react';
import { SongContextMenu } from '@/widgets/workspace/ui/SongContextMenu';
import { useLibraryStore } from '@/app/store/useLibraryStore';
import { useUIStore } from '@/app/store/useUIStore';
import { useGlobalTimeTick } from '@/shared/hooks/useGlobalTimeTick';
import { SongItemProps } from '../types';
import { useSongItemMenu } from '../hooks/useSongItemMenu';
import { useSongItemEdit } from '../hooks/useSongItemEdit';

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

export const SongListItem: React.FC<SongItemProps> = ({ 
  id, title, styles, duration, version, coverColor, notes, isRenamed, takeNumber, isChecked: isCheckedProp, onClick, onCheck, onRename,
  isChild, isFavorite, onSetFavorite,
  isLiked, isDisliked, isPinned, createdAt, onQuickGenerate
}) => {
  const { handleToggleLike, handleToggleDislike, handleTogglePin } = useLibraryStore();
  const { checkedSongIds, selectedItemId } = useUIStore();

  const isSelected = checkedSongIds.has(id) || selectedItemId === id;
  const isChecked = isCheckedProp !== undefined ? isCheckedProp : checkedSongIds.has(id);

  // Highly performant global clock to update relative time
  useGlobalTimeTick(!!isChild && !isRenamed);

  const {
    isEditing, editTitle, setEditTitle, handleStartEdit, handleConfirmEdit, handleCancelEdit
  } = useSongItemEdit(isChild ? (notes || '') : title, onRename);

  const {
    showMenu, setShowMenu, menuAnchor, menuPosition, moreButtonRef,
    handleMoreClick, handleContextMenu, onDelete, onDeleteExcludeFavorite, canExcludeFavorite
  } = useSongItemMenu(id, false);

  return (
    <>
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(e);
        }}
        onContextMenu={handleContextMenu}
        data-selectable-id={id}
        className={`relative flex items-center gap-2 sm:gap-4 p-1 md:p-1.5 sm:p-2 rounded-xl group cursor-pointer ${
          isSelected ? 'bg-zinc-800/80' : 'hover:bg-zinc-900/40'
        } ${isChild ? 'py-1 sm:py-1.5' : ''}`}
      >
        {/* Left Column: Selection & Favorite */}
        <div className="relative flex items-center justify-center shrink-0 w-4 sm:w-3 h-10">
          {isChild && (
            <div className={`absolute -top-[10px] ml-[0.5px] md:-top-3 md:ml-0 flex items-center overflow-hidden ${isFavorite || isSelected ? 'h-4 opacity-100' : 'h-0 opacity-0 lg:group-hover:h-4 lg:group-hover:opacity-100'}`}>
              <button 
                onClick={(e) => { e.stopPropagation(); onSetFavorite?.(e); }}
                className={`p-0.5 transition-colors ${isFavorite ? 'text-yellow-500' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <Star className="w-3.5 h-3.5" fill={isFavorite ? "currentColor" : "none"} />
              </button>
            </div>
          )}
          
          {/* Selection Indicator (Square) */}
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onCheck?.(e);
            }}
            className={`w-3 h-3 rounded-[2px] border flex items-center justify-center transition-all ${
            isChecked 
              ? 'opacity-100 bg-zinc-100 border-zinc-100 pointer-events-auto' 
              : `border-zinc-700 bg-transparent ${isSelected ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto'}`
          }`}>
            {isChecked && <Check className="w-2 h-2 text-black stroke-[5]" />}
          </div>
        </div>

        {/* Artwork */}
        <div className={`relative ${isChild ? 'w-(--song-w-child) h-(--song-h-child)' : 'w-(--song-w) h-(--song-h) ml-[1px]'} rounded-xl shrink-0 overflow-hidden bg-gradient-to-tr ${coverColor} shadow-lg`}>
          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/20 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className={`text-white drop-shadow-lg ${isChild ? "w-5 h-5 ml-0.5" : "w-7 h-7 ml-0.5"}`}>
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          
          <div className={`absolute bottom-1 right-1 md:bottom-1.5 md:right-1.5 bg-black/60 backdrop-blur-sm text-white font-bold rounded ${isChild ? 'text-[7px] px-0.5 py-0.5 md:text-[8px] md:px-1' : 'text-[9px] px-1 py-0.5 md:text-[10px] md:px-1.5'}`}>
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
                    className={`bg-[#0047ab] font-bold text-zinc-100 px-1.5 py-1 rounded-sm outline-none border-b border-white ${isChild ? 'text-[13px] sm:text-[14px] w-[180px] sm:w-[200px]' : 'text-[15px] sm:text-[16px] w-[220px] sm:w-[250px]'}`}
                    placeholder={isChild ? "Add a Caption" : "Enter title..."}
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
                  <h3 className={`font-bold truncate transition-all duration-200 ease-out ${isChild ? (isRenamed ? 'text-zinc-100 text-[12px] sm:text-[13px]' : `text-zinc-600 text-[12px] sm:text-[13px] ${isSelected ? 'opacity-100 max-w-[180px] sm:max-w-[200px]' : 'opacity-0 max-w-0 lg:group-hover:opacity-100 lg:group-hover:max-w-[200px]'}`) : 'text-zinc-100 text-[15px] sm:text-[16px]'}`}>
                    {isChild ? (isRenamed ? notes : 'Add a Caption') : title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <div className={`flex items-center overflow-hidden transition-all duration-200 ease-out ${isSelected ? (isChild ? 'w-6 opacity-100' : 'w-7 opacity-100') : 'w-0 opacity-0 lg:group-hover:opacity-100'} ${isChild ? 'lg:group-hover:w-6' : 'lg:group-hover:w-7'}`}>
                      <button 
                        onClick={handleStartEdit}
                        className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
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
              <p className="text-zinc-500 text-[13px] sm:text-[14px] truncate leading-tight">
                {styles}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 md:gap-4 h-8">
            {onQuickGenerate && (
              <button 
                onClick={onQuickGenerate}
                className="text-zinc-600 hover:text-zinc-300 transition-colors"
              >
                <Plus className={isChild ? "w-3 h-3 md:w-3.5 md:h-3.5" : "w-3.5 h-3.5 md:w-4 md:h-4"} />
              </button>
            )}
            <button 
              onClick={(e) => { e.stopPropagation(); handleToggleLike(id); }}
              className={`transition-colors ${isLiked ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
            >
              <ThumbsUp className={isChild ? "w-3 h-3 md:w-3.5 md:h-3.5" : "w-3.5 h-3.5 md:w-4 md:h-4"} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); handleToggleDislike(id); }}
              className={`transition-colors ${isDisliked ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
            >
              <ThumbsDown className={isChild ? "w-3 h-3 md:w-3.5 md:h-3.5" : "w-3.5 h-3.5 md:w-4 md:h-4"} fill={isDisliked ? "currentColor" : "none"} />
            </button>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                handleTogglePin(id); 
              }}
              className={`transition-colors ${isPinned ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
            >
              <Pin className={isChild ? "w-3 h-3 md:w-3.5 md:h-3.5" : "w-3.5 h-3.5 md:w-4 md:h-4"} fill={isPinned ? "currentColor" : "none"} />
            </button>
            {!isChild && (
              <button className="text-zinc-600 hover:text-zinc-300 transition-colors">
                <Share className="w-3.5 h-3.5 md:w-4 md:h-4" />
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
            className={`p-1.5 rounded-full text-zinc-600 hover:text-zinc-300 ${showMenu ? 'bg-zinc-800 text-zinc-100' : 'bg-transparent group-hover:bg-[#19191b]'}`}
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
