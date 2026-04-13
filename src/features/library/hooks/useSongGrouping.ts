import { useMemo } from 'react';
import { Song } from '../../../entities/song/model/types';
import { getSongGroupKey } from '../../../entities/song/lib/songUtils';

export interface SongGroup {
  key: string;
  songs: Song[];
}

export const useSongGrouping = (songs: Song[]) => {
  // 1. Sort all songs by date (newest first)
  const sortedSongs = useMemo(() => {
    return [...songs].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }, [songs]);

  // 2. Group songs by metadata
  const groupedSongs = useMemo(() => {
    const groups: Record<string, Song[]> = {};
    
    // We iterate over sorted songs to maintain order within groups
    sortedSongs.forEach(song => {
      const key = getSongGroupKey(song);
      if (!groups[key]) groups[key] = [];
      groups[key].push(song);
    });

    return Object.entries(groups).map(([key, songs]) => ({
      key,
      songs
    }));
  }, [sortedSongs]);

  // 3. Calculate take numbers for each song within its group
  const songsWithTakeNumbers = useMemo(() => {
    const takeMap = new Map<string, number>();
    
    groupedSongs.forEach(group => {
      // Sort group songs by date (oldest first) to assign take numbers chronologically for legacy songs
      const chronoSongs = [...group.songs].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
      chronoSongs.forEach((song, index) => {
        // Use stored takeNumber if available, otherwise fallback to index-based
        takeMap.set(song.id, song.takeNumber || (index + 1));
      });
    });
    
    return takeMap;
  }, [groupedSongs]);

  return {
    sortedSongs,
    groupedSongs,
    songsWithTakeNumbers
  };
};
