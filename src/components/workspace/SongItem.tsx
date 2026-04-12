import React, { useState, useRef } from 'react';
import { ThumbsUp, ThumbsDown, Pin, Share, MoreHorizontal, Check, Pencil, X, ChevronDown, ChevronRight, Layers, Star } from 'lucide-react';
import { SongContextMenu } from './SongContextMenu';
import { useWorkspace } from '../../contexts/WorkspaceContext';

interface SongItemProps {
  id: string; // Added id to props
  title: string;
  styles: string;
  duration: string;
  version: string;
  coverColor: string;
  isSelected?: boolean;
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
}

export const SongItem: React.FC<SongItemProps> = ({ 
  id, title, styles, duration, version, coverColor, isSelected, isChecked, onClick, onCheck, onRename,
  isGroupHeader, groupCount, isExpanded, onToggleExpand, isChild, isFavorite, onSetFavorite
}) => {
  const { handleDelete, selectedItemIds, groupFavorites, songs } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [showMenu, setShowMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<DOMRect | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(title);
  };

  const handleConfirmEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim() && editTitle !== title) {
      onRename?.(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditTitle(title);
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
    if (selectedItemIds.has(id)) {
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
    }
  };

  // Check if selection includes at least one favorite and has other items to delete
  const canExcludeFavorite = () => {
    if (!selectedItemIds.has(id)) return false;
    const selection = Array.from(selectedItemIds) as string[];
    const favoriteIds = new Set(Object.values(groupFavorites));
    
    // If multiple items are selected, show if there's at least one favorite to keep
    if (selection.length > 1) {
      return selection.some(itemId => favoriteIds.has(itemId) || itemId.includes('|'));
    }
    
    // If only one item is selected, only show if it's a group header (which contains multiple songs)
    const singleId = selection[0];
    return singleId.includes('|');
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
        {/* Selection Indicator (Square) */}
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onCheck?.(e);
          }}
          className={`w-3 h-3 rounded-[2px] border transition-all flex items-center justify-center shrink-0 ${
          isChecked 
            ? 'opacity-100 bg-zinc-100 border-zinc-100' 
            : 'opacity-0 group-hover:opacity-100 border-zinc-700 bg-transparent'
        }`}>
          {isChecked && <Check className="w-2 h-2 text-black stroke-[5]" />}
        </div>

        {/* Artwork */}
        <div className={`relative ${isChild ? 'w-10 h-14' : 'w-12 h-16'} rounded-lg shrink-0 overflow-hidden bg-gradient-to-tr ${coverColor}`}>
          <div className={`absolute bottom-1 right-1 bg-black/60 backdrop-blur-sm text-white font-medium rounded ${isChild ? 'text-[8px] px-1 py-0.5' : 'text-[10px] px-1.5 py-0.5'}`}>
            {duration}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-center gap-2 mb-0.5">
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
                  className="bg-[#0047ab] text-[15px] font-medium text-zinc-100 px-1 py-0.5 rounded-sm outline-none border-b border-white w-[200px]"
                />
                <button 
                  onClick={handleConfirmEdit}
                  className="p-1 text-zinc-100 hover:text-white transition-colors shrink-0"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={handleCancelEdit}
                  className="p-1 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 min-w-0">
                <h3 className={`font-medium text-zinc-100 truncate ${isChild ? 'text-[14px]' : 'text-[15px]'}`}>{title}</h3>
                <div className="flex items-center gap-0.5">
                  <div className={`flex items-center transition-all duration-300 ease-out overflow-hidden ${isSelected ? 'w-5 opacity-100' : 'w-0 opacity-0 lg:group-hover:w-5 lg:group-hover:opacity-100'}`}>
                    <button 
                      onClick={handleStartEdit}
                      className="p-0.5 text-zinc-500 hover:text-zinc-300 transition-colors"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {isChild && (
                    <div className={`flex items-center transition-all duration-300 ease-out overflow-hidden ${isFavorite || isSelected ? 'w-5 opacity-100' : 'w-0 opacity-0 lg:group-hover:w-5 lg:group-hover:opacity-100'}`}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onSetFavorite?.(e); }}
                        className={`p-0.5 transition-colors ${isFavorite ? 'text-yellow-500' : 'text-zinc-500 hover:text-zinc-300'}`}
                      >
                        <Star className="w-3.5 h-3.5" fill={isFavorite ? "currentColor" : "none"} />
                      </button>
                    </div>
                  )}
                  <span className="bg-pink-500/20 text-pink-400 text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none shrink-0 ml-0.5">
                    {version}
                  </span>
                  {isGroupHeader && (
                    <div className="flex items-center gap-1 bg-zinc-800/80 text-zinc-300 text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none shrink-0">
                      <Layers className="w-3 h-3" />
                      {groupCount}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <p className="text-[13px] text-zinc-500 truncate mb-1.5">
            {styles}
          </p>
          {!isChild && (
            <div className="flex items-center gap-3">
              <button className="text-zinc-600 hover:text-zinc-300 transition-colors"><ThumbsUp className="w-3.5 h-3.5" /></button>
              <button className="text-zinc-600 hover:text-zinc-300 transition-colors"><ThumbsDown className="w-3.5 h-3.5" /></button>
              <button className="text-zinc-600 hover:text-zinc-300 transition-colors"><Pin className="w-3.5 h-3.5" /></button>
              <button className="text-zinc-600 hover:text-zinc-300 transition-colors"><Share className="w-3.5 h-3.5" /></button>
            </div>
          )}
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
