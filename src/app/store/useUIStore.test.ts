import { describe, it, expect, beforeEach } from 'vitest';
import { useUIStore } from './useUIStore';
import { useLibraryStore } from './useLibraryStore';

describe('useUIStore', () => {
  const resetStores = () => {
    useUIStore.setState({
      selectedSongId: null,
      selectedItemId: null,
      checkedSongIds: new Set(),
      lastClickedId: null,
      expandedGroups: new Set()
    });
    useLibraryStore.setState({ songs: [] });
  };

  beforeEach(() => {
    resetStores();
  });

  describe('selection logic', () => {
    it('should select an item simply', () => {
      useUIStore.getState().handleSelectItem('item-1', 'song-1');
      expect(useUIStore.getState().selectedItemId).toBe('item-1');
      expect(useUIStore.getState().selectedSongId).toBe('song-1');
      expect(useUIStore.getState().lastClickedId).toBe('item-1');
    });

    it('should handle Ctrl+Click selection (multi-select)', () => {
      useUIStore.getState().handleSelectItem('item-1', 'song-1', false, true);
      useUIStore.getState().handleSelectItem('item-2', 'song-2', false, true);
      
      const checked = useUIStore.getState().checkedSongIds;
      expect(checked.has('item-1')).toBe(true);
      expect(checked.has('item-2')).toBe(true);
      expect(checked.size).toBe(2);
    });

    it('should handle Shift+Click range selection', () => {
      const visibleIds = ['id-1', 'id-2', 'id-3', 'id-4', 'id-5'];
      
      // Select first
      useUIStore.getState().handleSelectItem('id-1', 's1', false, false, visibleIds);
      // Shift click on fourth
      useUIStore.getState().handleSelectItem('id-4', 's4', true, false, visibleIds);
      
      const checked = useUIStore.getState().checkedSongIds;
      expect(checked.size).toBe(4);
      expect(checked.has('id-1')).toBe(true);
      expect(checked.has('id-2')).toBe(true);
      expect(checked.has('id-3')).toBe(true);
      expect(checked.has('id-4')).toBe(true);
      expect(checked.has('id-5')).toBe(false);
    });
  });

  describe('group expansion', () => {
    it('should toggle group expansion', () => {
      useUIStore.getState().toggleGroup(undefined, 'group-a');
      expect(useUIStore.getState().expandedGroups.has('group-a')).toBe(true);
      
      useUIStore.getState().toggleGroup(undefined, 'group-a');
      expect(useUIStore.getState().expandedGroups.has('group-a')).toBe(false);
    });
  });
});
