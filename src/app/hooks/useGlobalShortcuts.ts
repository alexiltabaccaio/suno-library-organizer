import { useEffect } from 'react';
import { useUIStore } from '@/app/store/useUIStore';
import { useLibraryStore } from '@/app/store/useLibraryStore';

export const useGlobalShortcuts = () => {
  const { viewMode, closeDetails, clearItemSelection, clearCheckedSongs, checkedSongIds } = useUIStore();
  const { handleDelete } = useLibraryStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input or textarea
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable
      ) {
        return;
      }

      if (event.key === 'Escape') {
        // ESC should NOT work in "before" mode as per user request
        if (viewMode === 'before') return;

        // 1. Close the right details panel
        closeDetails();
        
        // 2. Clear all selections (single and bulk)
        clearItemSelection();
        clearCheckedSongs();
      }

      if (event.key === 'Delete' || event.key === 'Backspace') {
        // Only if there are checked items
        if (checkedSongIds.size > 0) {
          handleDelete(Array.from(checkedSongIds));
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, closeDetails, clearItemSelection, clearCheckedSongs, checkedSongIds, handleDelete]);
};
