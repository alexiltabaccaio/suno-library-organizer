import React, { useState } from 'react';
import { MoreHorizontal, Check, Pencil, ChevronDown, Layers } from 'lucide-react';
import { SongContextMenu } from '@/widgets/workspace/ui/SongContextMenu';
import { useLibraryStore } from '@/app/store/useLibraryStore';
import { useUIStore } from '@/app/store/useUIStore';
import { SongItemProps } from '../types';
import { useSongItemMenu } from '../hooks/useSongItemMenu';
import { useSongItemEdit } from '../hooks/useSongItemEdit';
import { SongItemSubFilters } from './SongItemSubFilters';
import { SongTitleEditor } from './sub/SongTitleEditor';
import { SongGroupActions } from './sub/SongGroupActions';
import { SongGroupPagination } from './sub/SongGroupPagination';

export const SongGroupHeader: React.FC<SongItemProps> = ({ 
  id, title, styles, duration, version, coverColor, takeNumber, isChecked: isCheckedProp, onClick, onCheck, onRename,
  groupCount, isExpanded, onToggleExpand,
  isLiked, isDisliked, isPinned,
  subPage = 1, totalSubPages = 1, onSubPageChange, onQuickGenerate
}) => {
  const { handleToggleLike, handleToggleDislike, handleTogglePin } = useLibraryStore();
  const { checkedSongIds, selectedItemId } = useUIStore();

  const isSelected = checkedSongIds.has(id) || selectedItemId === id;
  const isChecked = isCheckedProp !== undefined ? isCheckedProp : checkedSongIds.has(id);
  
  const [showSubFilters, setShowSubFilters] = useState(false);

  const {
    isEditing, editTitle, setEditTitle, handleStartEdit, handleConfirmEdit, handleCancelEdit
  } = useSongItemEdit(title, onRename);

  const {
    showMenu, setShowMenu, menuAnchor, menuPosition, moreButtonRef,
    handleMoreClick, handleContextMenu, onDelete, onDeleteExcludeFavorite, canExcludeFavorite
  } = useSongItemMenu(id, true);

  return (
    <>
      <div 
        onClick={(e) => {
          e.stopPropagation();
          if (isSelected && !e.shiftKey && !e.ctrlKey && !e.metaKey) {
            onToggleExpand?.(e);
          } else {
            onClick?.(e);
          }
        }}
        onContextMenu={handleContextMenu}
        data-selectable-id={id}
        className={`relative flex items-center gap-2 sm:gap-4 p-1 md:p-1.5 sm:p-2 rounded-xl group cursor-pointer ${
          isSelected ? 'bg-zinc-800/80' : 'hover:bg-zinc-900/40'
        }`}
      >
        {/* Left Column: Selection & Expand */}
        <div className="relative flex items-center justify-center shrink-0 w-4 sm:w-3 h-10">
          <div className="absolute -top-4 flex items-center justify-center w-full">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand?.(e);
              }}
              className="p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              <ChevronDown className={`w-4 sm:w-3.5 h-4 sm:h-3.5 transition-transform ${!isExpanded ? '-rotate-90' : ''}`} />
            </button>
          </div>
          
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
        <div className={`relative w-(--song-w) h-(--song-h) ml-[1px] rounded-xl shrink-0 overflow-hidden bg-gradient-to-tr ${coverColor} shadow-lg`}>
          {/* Play Button Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center bg-black/20 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <svg viewBox="0 0 24 24" fill="currentColor" className="text-white drop-shadow-lg w-7 h-7 ml-0.5">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          
          <div className="absolute bottom-1 right-1 md:bottom-1.5 md:right-1.5 bg-black/60 backdrop-blur-sm text-white font-bold rounded text-[9px] px-1 py-0.5 md:text-[10px] md:px-1.5">
            {duration}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 h-(--song-h) flex flex-col justify-between py-1">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              {isEditing ? (
                <SongTitleEditor 
                  editTitle={editTitle}
                  setEditTitle={setEditTitle}
                  onConfirm={handleConfirmEdit}
                  onCancel={handleCancelEdit}
                />
              ) : (
                <div className="flex items-center gap-2 min-w-0">
                  <h3 className="font-bold truncate transition-all duration-200 ease-out text-zinc-100 text-[15px] sm:text-[16px]">
                    {title}
                  </h3>
                  <div className="flex items-center gap-1 shrink-0">
                    <div className={`flex items-center overflow-hidden transition-all duration-200 ease-out ${isSelected ? 'w-7 opacity-100' : 'w-0 opacity-0 lg:group-hover:opacity-100 lg:group-hover:w-7'}`}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleStartEdit(e as any); }}
                        className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                    <span className={`${version === 'v5.5' ? 'bg-pink-500/20 text-pink-400' : 'bg-zinc-800 text-zinc-400'} font-black px-2 py-0.5 rounded-md leading-none shrink-0 ml-1 uppercase text-[11px]`}>
                      {version}
                    </span>
                    {takeNumber && (
                      <span className="bg-zinc-800 text-zinc-400 font-bold px-1.5 py-0.5 rounded-md leading-none shrink-0 ml-1 uppercase text-[10px]">
                        Take {takeNumber}
                      </span>
                    )}
                    <div className="flex items-center gap-1.5 bg-zinc-800/80 text-zinc-300 text-[11px] font-black px-2 py-0.5 rounded-md leading-none shrink-0 ml-1 uppercase">
                      <Layers className="w-3.5 h-3.5" />
                      {groupCount}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <p className="text-zinc-500 text-[13px] sm:text-[14px] truncate leading-tight">
              {styles}
            </p>
          </div>
          <div className="flex items-center h-8">
            <SongGroupActions
              id={id}
              isLiked={isLiked}
              isDisliked={isDisliked}
              isPinned={isPinned}
              onToggleLike={handleToggleLike}
              onToggleDislike={handleToggleDislike}
              onTogglePin={handleTogglePin}
              onQuickGenerate={(e) => { e.stopPropagation(); onQuickGenerate?.(e); }}
            />

            <SongGroupPagination 
              groupKey={id}
              subPage={subPage}
              totalSubPages={totalSubPages}
              groupCount={groupCount}
              onSubPageChange={onSubPageChange}
              showSubFilters={showSubFilters}
              setShowSubFilters={setShowSubFilters}
            />
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
