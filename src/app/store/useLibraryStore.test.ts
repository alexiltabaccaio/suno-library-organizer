import { describe, it, expect, beforeEach } from 'vitest';
import { useLibraryStore } from './useLibraryStore';
import { useUIStore } from './useUIStore';
import { Song } from '@/entities/song/model/types';

describe('useLibraryStore', () => {
  // Helper to get a clean state
  const resetStores = () => {
    useLibraryStore.setState({
      songs: [],
      groupFavorites: {}
    });
    useUIStore.setState({
      expandedGroups: new Set()
    });
  };

  beforeEach(() => {
    resetStores();
  });

  const mockSong: Song = {
    id: '1',
    title: 'Test Song',
    styles: 'Pop',
    lyrics: 'Lalala',
    duration: '3:00',
    version: 'v1',
    createdAt: new Date(),
    coverColor: '#000',
    takeNumber: 1
  };

  it('should add songs correctly', () => {
    useLibraryStore.getState().addSongs([mockSong]);
    expect(useLibraryStore.getState().songs).toHaveLength(1);
    expect(useLibraryStore.getState().songs[0].id).toBe('1');
  });

  it('should handle song deletion', () => {
    useLibraryStore.getState().addSongs([mockSong]);
    useLibraryStore.getState().handleDelete(['1']);
    expect(useLibraryStore.getState().songs).toHaveLength(0);
  });

  it('should handle group deletion', () => {
    const song1 = { ...mockSong, id: '1' };
    const song2 = { ...mockSong, id: '2' }; // Same metadata, different ID
    const groupKey = 'Test Song|Pop|Lalala';

    useLibraryStore.getState().addSongs([song1, song2]);
    expect(useLibraryStore.getState().songs).toHaveLength(2);

    useLibraryStore.getState().handleDelete([groupKey]);
    expect(useLibraryStore.getState().songs).toHaveLength(0);
  });

  it('should rename a single song title', () => {
    useLibraryStore.getState().addSongs([mockSong]);
    useLibraryStore.getState().handleRenameSong('1', 'New Title', true);
    
    expect(useLibraryStore.getState().songs[0].title).toBe('New Title');
  });

  it('should rename a group and update all songs in that group', () => {
    const song1 = { ...mockSong, id: '1' };
    const song2 = { ...mockSong, id: '2' };
    const oldGroupKey = 'Test Song|Pop|Lalala';
    
    useLibraryStore.getState().addSongs([song1, song2]);
    useUIStore.getState().toggleGroup(undefined, oldGroupKey); // Expand group
    
    expect(useUIStore.getState().expandedGroups.has(oldGroupKey)).toBe(true);

    useLibraryStore.getState().handleRenameSong(oldGroupKey, 'Modern Pop');
    
    const songs = useLibraryStore.getState().songs;
    expect(songs[0].title).toBe('Modern Pop');
    expect(songs[1].title).toBe('Modern Pop');
    
    // Check UI store cross-update
    const newGroupKey = 'Modern Pop|Pop|Lalala';
    expect(useUIStore.getState().expandedGroups.has(oldGroupKey)).toBe(false);
    expect(useUIStore.getState().expandedGroups.has(newGroupKey)).toBe(true);
  });

  it('should handle favorites across group rename', () => {
    const oldGroupKey = 'Test Song|Pop|Lalala';
    const newGroupKey = 'Renamed|Pop|Lalala';
    
    useLibraryStore.getState().addSongs([mockSong]);
    useLibraryStore.getState().handleSetFavorite(oldGroupKey, '1');
    
    expect(useLibraryStore.getState().groupFavorites[oldGroupKey]).toBe('1');

    useLibraryStore.getState().handleRenameSong(oldGroupKey, 'Renamed');
    
    expect(useLibraryStore.getState().groupFavorites[oldGroupKey]).toBeUndefined();
    expect(useLibraryStore.getState().groupFavorites[newGroupKey]).toBe('1');
  });

  it('should toggle like status for a group using the favorite song', () => {
    const song1 = { ...mockSong, id: '1', isLiked: false };
    const song2 = { ...mockSong, id: '2', isLiked: false };
    const groupKey = 'Test Song|Pop|Lalala';

    useLibraryStore.getState().addSongs([song1, song2]);
    useLibraryStore.getState().handleSetFavorite(groupKey, '2');

    useLibraryStore.getState().handleToggleLike(groupKey);
    
    const songs = useLibraryStore.getState().songs;
    expect(songs.find(s => s.id === '2')?.isLiked).toBe(true);
    expect(songs.find(s => s.id === '1')?.isLiked).toBe(false);
  });
});
