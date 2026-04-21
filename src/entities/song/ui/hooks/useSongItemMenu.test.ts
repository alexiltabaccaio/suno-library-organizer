import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSongItemMenu } from './useSongItemMenu';
import { useLibraryStore } from '@/app/store/useLibraryStore';
import { useUIStore } from '@/app/store/useUIStore';

vi.mock('@/app/store/useLibraryStore');
vi.mock('@/app/store/useUIStore');

describe('useSongItemMenu', () => {
  const mockHandleDelete = vi.fn();
  const mockHandleSetFavorite = vi.fn();

  const mockSongs = [
    { id: 'song-1', title: 'Song 1', styles: 'Pop', lyrics: 'L1' },
    { id: 'song-2', title: 'Song 1', styles: 'Pop', lyrics: 'L1' }, // Same group as song-1
    { id: 'song-3', title: 'Song 3', styles: 'Rock', lyrics: 'L3' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useLibraryStore as any).mockReturnValue({
      handleDelete: mockHandleDelete,
      handleSetFavorite: mockHandleSetFavorite,
      songs: mockSongs,
      groupFavorites: {
        'Song 1|Pop|L1': 'song-1', // song-1 is favorite for this group
      },
    });

    (useUIStore as any).mockReturnValue({
      checkedSongIds: new Set(),
    });
  });

  describe('Standard Deletion (onDelete)', () => {
    it('should delete only the specific item if it is not selected', () => {
      (useUIStore as any).mockReturnValue({ checkedSongIds: new Set(['song-2']) });
      
      const { result } = renderHook(() => useSongItemMenu('song-3', false));
      
      act(() => {
        result.current.onDelete();
      });

      // song-3 deleted because it was right-clicked, not the selected one
      expect(mockHandleDelete).toHaveBeenCalledWith(['song-3']);
    });

    it('should delete all checked items if the clicked item is among them', () => {
      (useUIStore as any).mockReturnValue({ checkedSongIds: new Set(['song-1', 'song-3']) });
      
      const { result } = renderHook(() => useSongItemMenu('song-1', false));
      
      act(() => {
        result.current.onDelete();
      });

      expect(mockHandleDelete).toHaveBeenCalledWith(['song-1', 'song-3']);
    });
  });

  describe('Exclude Favorite Logic (canExcludeFavorite)', () => {
    it('should return true for a group header that has multiple items and a favorite', () => {
      const { result } = renderHook(() => useSongItemMenu('Song 1|Pop|L1', true));
      expect(result.current.canExcludeFavorite()).toBe(true);
    });

    it('should return false for a group header with no favorite or single item', () => {
      const { result } = renderHook(() => useSongItemMenu('Song 3|Rock|L3', true));
      expect(result.current.canExcludeFavorite()).toBe(false); // Only 1 song in this group
    });

    it('should return true if multiple items are selected and at least one is NOT a favorite', () => {
      (useUIStore as any).mockReturnValue({ checkedSongIds: new Set(['song-1', 'song-2']) }); // 1 is fav, 2 is not
      const { result } = renderHook(() => useSongItemMenu('song-1', false));
      
      expect(result.current.canExcludeFavorite()).toBe(true);
    });

    it('should return false if only favorites are selected', () => {
      (useUIStore as any).mockReturnValue({ checkedSongIds: new Set(['song-1']) }); // song-1 is fav
      const { result } = renderHook(() => useSongItemMenu('song-1', false));
      
      expect(result.current.canExcludeFavorite()).toBe(false);
    });
  });

  describe('Delete Excluding Favorite (onDeleteExcludeFavorite)', () => {
    it('should exclude the favorite item when deleting multiple from selection', () => {
      // Selecting both songs from the first group, and song-3
      (useUIStore as any).mockReturnValue({ checkedSongIds: new Set(['song-1', 'song-2', 'song-3']) });
      const { result } = renderHook(() => useSongItemMenu('song-1', false));
      
      act(() => {
        result.current.onDeleteExcludeFavorite();
      });

      // song-1 is favorite, so it should be excluded. song-2 and song-3 should be deleted.
      expect(mockHandleDelete).toHaveBeenCalledWith(['song-2', 'song-3']);
    });

    it('should clear favorite status and delete non-favorites when deleting a group from selection', () => {
      (useUIStore as any).mockReturnValue({ checkedSongIds: new Set(['Song 1|Pop|L1', 'song-3']) });
      const { result } = renderHook(() => useSongItemMenu('Song 1|Pop|L1', false));
      
      act(() => {
        result.current.onDeleteExcludeFavorite();
      });

      // Should delete song-3 (normal item) and song-2 (non-favorite from group)
      expect(mockHandleDelete).toHaveBeenCalledWith(['song-3', 'song-2']);
      // Should also clear the favorite status for the group
      expect(mockHandleSetFavorite).toHaveBeenCalledWith('Song 1|Pop|L1', 'song-1');
    });

    it('should delete non-favorites of a group when invoked directly on a group header', () => {
      (useUIStore as any).mockReturnValue({ checkedSongIds: new Set() }); // Empty selection
      const { result } = renderHook(() => useSongItemMenu('Song 1|Pop|L1', true));
      
      act(() => {
        result.current.onDeleteExcludeFavorite();
      });

      expect(mockHandleDelete).toHaveBeenCalledWith(['song-2']); // Only song-2 deleted (song-1 is fav)
      expect(mockHandleSetFavorite).toHaveBeenCalledWith('Song 1|Pop|L1', 'song-1'); // Triggered to clear
    });
  });

  describe('Menu State Handling', () => {
    it('should open context menu on handleContextMenu', () => {
      const { result } = renderHook(() => useSongItemMenu('song-1', false));
      
      const mockEvent = {
        preventDefault: vi.fn(),
        stopPropagation: vi.fn(),
        clientX: 100,
        clientY: 200,
      } as unknown as React.MouseEvent;

      act(() => {
        result.current.handleContextMenu(mockEvent);
      });

      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(result.current.showMenu).toBe(true);
      expect(result.current.menuPosition).toEqual({ x: 100, y: 200 });
      expect(result.current.menuAnchor).toBeNull();
    });
  });
});
