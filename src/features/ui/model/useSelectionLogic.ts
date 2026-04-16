import { useState, useEffect } from 'react';
import { Song } from '../../../entities/song/model/types';

export const useSelectionLogic = (songs: Song[], isMobile: boolean) => {
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [checkedSongIds, setCheckedSongIds] = useState<Set<string>>(new Set());
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);

  // Handle group key changes to preserve selection state
  useEffect(() => {
    const handleGroupRenamed = (e: any) => {
      const { oldKey, newKey } = e.detail;
      
      setCheckedSongIds(prev => {
        if (prev.has(oldKey)) {
          const next = new Set(prev);
          next.delete(oldKey);
          next.add(newKey);
          return next;
        }
        return prev;
      });

      setSelectedItemId(prev => prev === oldKey ? newKey : prev);
      setLastClickedId(prev => prev === oldKey ? newKey : prev);
    };

    window.addEventListener('groupRenamed', handleGroupRenamed);
    return () => window.removeEventListener('groupRenamed', handleGroupRenamed);
  }, []);

  const handleSelectItem = (itemId: string, songId: string, shiftKey?: boolean, ctrlKey?: boolean, visibleIds?: string[]) => {
    setSelectedItemId(itemId);
    if (!isMobile) {
      setSelectedSongId(songId);
    }

    if (shiftKey && lastClickedId && visibleIds) {
      const lastIndex = visibleIds.indexOf(lastClickedId);
      const currentIndex = visibleIds.indexOf(itemId);
      
      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        const rangeIds = visibleIds.slice(start, end + 1);
        setCheckedSongIds(new Set(rangeIds));
      } else {
        setCheckedSongIds(new Set([itemId]));
        setLastClickedId(itemId);
      }
    } else if (ctrlKey) {
      setCheckedSongIds(prev => {
        const next = new Set(prev);
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        return next;
      });
      setLastClickedId(itemId);
    } else {
      setLastClickedId(itemId);
    }
  };

  const toggleCheck = (id: string) => {
    setCheckedSongIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        
        // If it's a song ID, also check if we need to remove its group key
        const song = songs.find(s => s.id === id);
        if (song) {
          const groupKey = `${song.title}|${song.styles}|${song.lyrics}`;
          next.delete(groupKey);
        }

        if (selectedItemId === id) {
          setSelectedItemId(null);
          setLastClickedId(null);
        }
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleGroupCheck = (songsInGroup: Song[]) => {
    setCheckedSongIds(prev => {
      const next = new Set(prev);
      const allChecked = songsInGroup.every(s => next.has(s.id));
      const groupKey = `${songsInGroup[0].title}|${songsInGroup[0].styles}|${songsInGroup[0].lyrics}`;
      
      if (allChecked) {
        songsInGroup.forEach(s => next.delete(s.id));
        next.delete(groupKey);
        // Check if the group header was the selected item
        if (selectedItemId === groupKey) {
          setSelectedItemId(null);
          setLastClickedId(null);
        }
      } else {
        songsInGroup.forEach(s => next.add(s.id));
        next.add(groupKey);
      }
      return next;
    });
  };

  const handleBulkToggleSelection = (ids: string[], ctrlKey?: boolean) => {
    setCheckedSongIds(prev => {
      const next = new Set(prev);
      ids.forEach(id => {
        if (ctrlKey) {
          // Toggle behavior if Ctrl is held
          if (next.has(id)) {
            next.delete(id);
            const song = songs.find(s => s.id === id);
            if (song) {
              const groupKey = `${song.title}|${song.styles}|${song.lyrics}`;
              next.delete(groupKey);
            }
          } else {
            next.add(id);
            if (id.includes('|')) {
              const groupSongs = songs.filter(s => `${s.title}|${s.styles}|${s.lyrics}` === id);
              groupSongs.forEach(s => next.add(s.id));
            }
          }
        } else {
          // Default behavior: only add (activate)
          if (!next.has(id)) {
            next.add(id);
            if (id.includes('|')) {
              const groupSongs = songs.filter(s => `${s.title}|${s.styles}|${s.lyrics}` === id);
              groupSongs.forEach(s => next.add(s.id));
            }
          }
        }
      });
      return next;
    });
  };

  const clearCheckedSongs = () => {
    setCheckedSongIds(new Set());
  };

  const closeDetails = () => {
    setSelectedSongId(null);
  };

  const clearItemSelection = () => {
    setSelectedItemId(null);
    setLastClickedId(null);
  };

  return {
    selectedSongId,
    selectedItemId,
    checkedSongIds,
    setCheckedSongIds,
    handleSelectItem,
    toggleCheck,
    toggleGroupCheck,
    handleBulkToggleSelection,
    clearCheckedSongs,
    closeDetails,
    clearItemSelection,
  };
};
