import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useWorkspaceFilters } from './useWorkspaceFilters';
import { Song } from '@/entities/song/model/types';
import { SongGroup } from '@/features/library/hooks/useSongGrouping';

describe('useWorkspaceFilters', () => {
  const mockSongs: Song[] = [
    { 
      id: '1', title: 'Song 1', styles: 'Pop', lyrics: 'A', duration: '3:00', version: 'v1', 
      createdAt: new Date(), coverColor: '#000', takeNumber: 1, isLiked: true 
    },
    { 
      id: '2', title: 'Song 1', styles: 'Pop', lyrics: 'A', duration: '3:05', version: 'v1', 
      createdAt: new Date(), coverColor: '#000', takeNumber: 2, isLiked: false 
    },
    { 
      id: '3', title: 'Song 2', styles: 'Rock', lyrics: 'B', duration: '4:00', version: 'v1', 
      createdAt: new Date(), coverColor: '#000', takeNumber: 1, isLiked: false, isDisliked: true 
    }
  ];

  const mockGroups: SongGroup[] = [
    {
      key: 'Song 1|Pop|A',
      songs: [mockSongs[0], mockSongs[1]]
    },
    {
      key: 'Song 2|Rock|B',
      songs: [mockSongs[2]]
    }
  ];

  const defaultFilters = { liked: false, disliked: false, hideDisliked: false };

  it('should return all songs when no filters are active', () => {
    const { result } = renderHook(() => 
      useWorkspaceFilters(mockGroups, mockSongs, defaultFilters, defaultFilters, {})
    );
    expect(result.current.filteredSortedSongs).toHaveLength(3);
    expect(result.current.filteredGroupedSongs).toHaveLength(2);
  });

  it('should filter by liked status in flat list', () => {
    const filters = { ...defaultFilters, liked: true };
    const { result } = renderHook(() => 
      useWorkspaceFilters(mockGroups, mockSongs, filters, defaultFilters, {})
    );
    expect(result.current.filteredSortedSongs).toHaveLength(1);
    expect(result.current.filteredSortedSongs[0].id).toBe('1');
  });

  it('should filter groups based on favorite song status', () => {
    const filters = { ...defaultFilters, liked: true };
    // Favorite of Group 1 is song '1' (which is liked)
    // Favorite of Group 2 is song '3' (which is NOT liked)
    const { result } = renderHook(() => 
      useWorkspaceFilters(mockGroups, mockSongs, filters, defaultFilters, {
        'Song 1|Pop|A': '1'
      })
    );
    
    expect(result.current.filteredGroupedSongs).toHaveLength(1);
    expect(result.current.filteredGroupedSongs[0].key).toBe('Song 1|Pop|A');
  });

  it('should hide group if favorite song is NOT liked (even if other versions are liked)', () => {
    const filters = { ...defaultFilters, liked: true };
    // Set song '2' (unliked) as favorite for Group 1
    const { result } = renderHook(() => 
      useWorkspaceFilters(mockGroups, mockSongs, filters, defaultFilters, {
        'Song 1|Pop|A': '2'
      })
    );
    
    expect(result.current.filteredGroupedSongs).toHaveLength(0);
  });

  it('should hide disliked songs when hideDisliked is active', () => {
    const filters = { ...defaultFilters, hideDisliked: true };
    const { result } = renderHook(() => 
      useWorkspaceFilters(mockGroups, mockSongs, filters, defaultFilters, {})
    );
    
    // Song '3' is disliked, so it should be filtered out
    expect(result.current.filteredSortedSongs).toHaveLength(2);
    expect(result.current.filteredSortedSongs.some(s => s.id === '3')).toBe(false);
  });
});
