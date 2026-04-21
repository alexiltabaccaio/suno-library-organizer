import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useGroupRowLogic } from './useGroupRowLogic';
import { useUIStore } from '@/app/store/useUIStore';
import { SongGroup } from '@/features/library/hooks/useSongGrouping';
import { Song } from '@/entities/song/model/types';

describe('useGroupRowLogic', () => {
  const songs: Song[] = [
    { id: '1', title: 'A', styles: 'S', lyrics: 'L', duration: '1', version: 'v', createdAt: new Date(), coverColor: '#0', takeNumber: 1, isLiked: true },
    { id: '2', title: 'A', styles: 'S', lyrics: 'L', duration: '1', version: 'v', createdAt: new Date(), coverColor: '#0', takeNumber: 2, isLiked: false },
    { id: '3', title: 'A', styles: 'S', lyrics: 'L', duration: '1', version: 'v', createdAt: new Date(), coverColor: '#0', takeNumber: 3, isDisliked: true }
  ];

  const group: SongGroup = {
    key: 'group-key',
    songs: songs
  };

  beforeEach(() => {
    useUIStore.setState({
      groupSubFilters: {},
      groupPages: {},
      checkedSongIds: new Set()
    });
  });

  it('should return all songs when no sub-filters are active', () => {
    const { result } = renderHook(() => useGroupRowLogic(group));
    expect(result.current.paginatedSubSongs).toHaveLength(3);
  });

  it('should filter sub-songs by liked status', () => {
    useUIStore.setState({ groupSubFilters: { 'group-key': { liked: true, disliked: false, hideDisliked: false } } });
    const { result } = renderHook(() => useGroupRowLogic(group));
    
    expect(result.current.paginatedSubSongs).toHaveLength(1);
    expect(result.current.paginatedSubSongs[0].id).toBe('1');
  });

  it('should hide disliked sub-songs when hideDisliked sub-filter is active', () => {
    useUIStore.setState({ groupSubFilters: { 'group-key': { liked: false, disliked: false, hideDisliked: true } } });
    const { result } = renderHook(() => useGroupRowLogic(group));
    
    expect(result.current.paginatedSubSongs).toHaveLength(2);
    expect(result.current.paginatedSubSongs.some(s => s.id === '3')).toBe(false);
  });

  it('should identify the favorite song correctly', () => {
    // Test default favorite (first song)
    const { result: res1 } = renderHook(() => useGroupRowLogic(group));
    expect(res1.current.favoriteSong.id).toBe('1');

    // Test explicit favorite
    const { result: res2 } = renderHook(() => useGroupRowLogic(group, '2'));
    expect(res2.current.favoriteSong.id).toBe('2');
  });

  it('should calculate pagination correctly for sub-songs', () => {
    // Create a group with many songs
    const manySongs = Array.from({ length: 20 }, (_, i) => ({ ...songs[0], id: `id-${i}` }));
    const largeGroup = { ...group, songs: manySongs };

    const { result } = renderHook(() => useGroupRowLogic(largeGroup));
    
    // Default 15 per page
    expect(result.current.paginatedSubSongs).toHaveLength(15);
    expect(result.current.totalSubPages).toBe(2);
  });
});
