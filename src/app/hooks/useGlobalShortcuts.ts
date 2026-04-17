import { useEffect } from 'react';
import { useUIStore } from '@/app/store/useUIStore';

export const useGlobalShortcuts = () => {
  const { viewMode, closeDetails, clearItemSelection, clearCheckedSongs } = useUIStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // ESC should NOT work in "before" mode as per user request
        if (viewMode === 'before') return;

        // 1. Close the right details panel
        closeDetails();
        
        // 2. Clear all selections (single and bulk)
        clearItemSelection();
        clearCheckedSongs();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewMode, closeDetails, clearItemSelection, clearCheckedSongs]);
};
