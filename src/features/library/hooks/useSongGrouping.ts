import { useMemo } from 'react';
import { Song } from '../../../entities/song/model/types';
import { getSongGroupKey } from '../../../entities/song/lib/songUtils';

export interface SongGroup {
  key: string;
  songs: Song[];
}

export const useSongGrouping = (songs: Song[], groupFavorites: Record<string, string>) => {
  // 1. Sort all songs by date (newest first), but put pinned songs first
  const sortedSongs = useMemo(() => {
    return [...songs].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
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

    return Object.entries(groups).map(([key, songs]) => {
      // Sort songs within the group: pinned first, then by date
      const sortedGroupSongs = [...songs].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return b.createdAt.getTime() - a.createdAt.getTime();
      });

      return {
        key,
        songs: sortedGroupSongs
      };
    }).sort((a, b) => {
      // Find the oldest record in each group to determine the group's "birth date"
      // This ensures stability: the group stays in its original chronological position 
      // even when new versions (takes) are generated.
      const oldestA = [...a.songs].sort((s1, s2) => s1.createdAt.getTime() - s2.createdAt.getTime())[0];
      const oldestB = [...b.songs].sort((s1, s2) => s1.createdAt.getTime() - s2.createdAt.getTime())[0];
      
      // For pinned status, we still look at the "favorite" (representative) song.
      const newestA = [...a.songs].sort((s1, s2) => s2.createdAt.getTime() - s1.createdAt.getTime())[0];
      const favIdA = groupFavorites[a.key] || newestA.id;
      const favSongA = a.songs.find(s => s.id === favIdA) || newestA;
      
      const newestB = [...b.songs].sort((s1, s2) => s2.createdAt.getTime() - s1.createdAt.getTime())[0];
      const favIdB = groupFavorites[b.key] || newestB.id;
      const favSongB = b.songs.find(s => s.id === favIdB) || newestB;

      // Priority 1: Pinned groups first
      if (favSongA.isPinned && !favSongB.isPinned) return -1;
      if (!favSongA.isPinned && favSongB.isPinned) return 1;
      
      // Priority 2: Stability based on the date of the first generation (Oldest)
      return oldestB.createdAt.getTime() - oldestA.createdAt.getTime();
    });
  }, [sortedSongs, groupFavorites]);

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
