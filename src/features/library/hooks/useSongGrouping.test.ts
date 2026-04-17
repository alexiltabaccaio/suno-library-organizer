import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useSongGrouping } from './useSongGrouping';
import { Song } from '@/entities/song/model/types';

describe('useSongGrouping', () => {
  const now = new Date();
  const oneHourAgo = new Date(now.getTime() - 3600000);
  const twoHoursAgo = new Date(now.getTime() - 7200000);

  const songs: Song[] = [
    { 
      id: '1', title: 'Song A', styles: 'Pop', lyrics: 'L1', 
      createdAt: oneHourAgo, duration: '3:00', version: 'v1', takeNumber: 1, coverColor: '#0' 
    },
    { 
      id: '2', title: 'Song A', styles: 'Pop', lyrics: 'L1', 
      createdAt: now, duration: '3:05', version: 'v1', takeNumber: 2, coverColor: '#0' 
    },
    { 
      id: '3', title: 'Song B', styles: 'Rock', lyrics: 'L2', 
      createdAt: twoHoursAgo, duration: '4:00', version: 'v1', takeNumber: 1, coverColor: '#0' 
    }
  ];

  it('should group songs by metadata (title, styles, lyrics)', () => {
    const { result } = renderHook(() => useSongGrouping(songs, {}));
    
    expect(result.current.groupedSongs).toHaveLength(2); // Song A group and Song B group
    const groupA = result.current.groupedSongs.find(g => g.key.includes('Song A'));
    expect(groupA?.songs).toHaveLength(2);
  });

  it('should maintain chronological order within groups (newest first)', () => {
    const { result } = renderHook(() => useSongGrouping(songs, {}));
    const groupA = result.current.groupedSongs.find(g => g.key.includes('Song A'));
    
    expect(groupA?.songs[0].id).toBe('2'); // Most recent first
    expect(groupA?.songs[1].id).toBe('1');
  });

  it('should prioritize pinned songs at the top level', () => {
    const songsWithPin = [
      ...songs,
      { ...songs[2], id: '3-pinned', isPinned: true } // Song B pinned
    ];
    
    const { result } = renderHook(() => useSongGrouping(songsWithPin, {}));
    
    // Group with pinned song should be first
    expect(result.current.groupedSongs[0].songs.some(s => s.id === '3-pinned')).toBe(true);
  });

  it('should correctly calculate take numbers', () => {
    const { result } = renderHook(() => useSongGrouping(songs, {}));
    
    expect(result.current.songsWithTakeNumbers.get('1')).toBe(1);
    expect(result.current.songsWithTakeNumbers.get('2')).toBe(2);
    expect(result.current.songsWithTakeNumbers.get('3')).toBe(1);
  });

  it('should fallback to index-based take numbers if not provided', () => {
    const songsNoTake = songs.map(({ takeNumber, ...rest }) => rest as Song);
    const { result } = renderHook(() => useSongGrouping(songsNoTake, {}));
    
    // Sorted by date: 1 is older than 2
    // So 1 gets take 1, 2 gets take 2
    expect(result.current.songsWithTakeNumbers.get('1')).toBe(1);
    expect(result.current.songsWithTakeNumbers.get('2')).toBe(2);
  });
});
