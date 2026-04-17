import React, { useState, useRef } from 'react';
import { useLibraryStore } from '@/app/store/useLibraryStore';
import { useUIStore } from '@/app/store/useUIStore';

export const useSongItemMenu = (id: string, isGroupHeader?: boolean) => {
  const { handleDelete, groupFavorites, songs, handleSetFavorite } = useLibraryStore();
  const { checkedSongIds } = useUIStore();
  
  const [showMenu, setShowMenu] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<DOMRect | null>(null);
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);

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
    if (checkedSongIds.has(id)) {
      handleDelete(Array.from(checkedSongIds));
    } else {
      handleDelete([id]);
    }
  };

  const onDeleteExcludeFavorite = () => {
    if (checkedSongIds.has(id) && checkedSongIds.size > 1) {
      const favoriteIds = new Set(Object.values(groupFavorites));
      const idsToDelete = (Array.from(checkedSongIds) as string[]).filter(itemId => {
        if (favoriteIds.has(itemId)) return false;
        const isGroupKey = itemId.includes('|');
        if (isGroupKey) return false;
        return true;
      });

      const finalIdsToDelete: string[] = [...idsToDelete];
      (Array.from(checkedSongIds) as string[]).forEach(itemId => {
        if (itemId.includes('|')) {
          const groupKey = itemId;
          const groupSongs = songs.filter(s => `${s.title}|${s.styles}|${s.lyrics}` === groupKey);
          const favId = groupFavorites[groupKey] || groupSongs[0]?.id;
          
          // Clear favorite status for this group
          if (groupFavorites[groupKey]) {
            handleSetFavorite(groupKey, groupFavorites[groupKey]);
          }

          groupSongs.forEach(s => {
            if (s.id !== favId) finalIdsToDelete.push(s.id);
          });
        }
      });

      handleDelete(finalIdsToDelete);
    } else {
      if (isGroupHeader) {
        const groupKey = id;
        const groupSongs = songs.filter(s => `${s.title}|${s.styles}|${s.lyrics}` === groupKey);
        const favId = groupFavorites[groupKey] || groupSongs[0]?.id;
        
        // Clear favorite status for this group
        if (groupFavorites[groupKey]) {
          handleSetFavorite(groupKey, groupFavorites[groupKey]);
        }

        const finalIdsToDelete = groupSongs.filter(s => s.id !== favId).map(s => s.id);
        handleDelete(finalIdsToDelete);
      }
    }
  };

  const canExcludeFavorite = () => {
    if (isGroupHeader) {
      const groupKey = id;
      const groupSongs = songs.filter(s => `${s.title}|${s.styles}|${s.lyrics}` === groupKey);
      return groupSongs.length > 1 && !!groupFavorites[groupKey];
    }

    if (!checkedSongIds.has(id)) return false;
    const selection = Array.from(checkedSongIds) as string[];
    const favoriteIds = new Set(Object.values(groupFavorites));
    
    if (selection.length > 1) {
      // Show only if there is at least one non-favorite song to delete
      return selection.some(itemId => {
        if (favoriteIds.has(itemId)) return false;
        if (itemId.includes('|')) return false; // It's a group
        return true;
      });
    }
    return false;
  };

  return {
    showMenu,
    setShowMenu,
    menuAnchor,
    menuPosition,
    moreButtonRef,
    handleMoreClick,
    handleContextMenu,
    onDelete,
    onDeleteExcludeFavorite,
    canExcludeFavorite
  };
};
