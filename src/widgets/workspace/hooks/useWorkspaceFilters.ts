import { useMemo } from 'react';
import { Song } from '@/entities/song/model/types';
import { SongGroup } from '@/features/library/hooks/useSongGrouping';

interface Filters {
  liked: boolean;
  disliked: boolean;
  hideDisliked: boolean;
}

export const useWorkspaceFilters = (
  groupedSongs: SongGroup[],
  sortedSongs: Song[],
  filters: Filters,
  subFilters: Filters,
  groupFavorites: Record<string, string>
) => {
  const filteredGroupedSongs = useMemo(() => {
    const hasMainFilters = Object.values(filters).some(Boolean);

    if (!hasMainFilters) return groupedSongs;

    return groupedSongs.filter(group => {
      const favoriteId = groupFavorites[group.key] || group.songs[0].id;
      const favoriteSong = group.songs.find(s => s.id === favoriteId) || group.songs[0];

      // Check if favorite song matches main filters
      const matchesMain = (
        (!filters.liked || favoriteSong.isLiked) &&
        (!filters.disliked || favoriteSong.isDisliked) &&
        (!filters.hideDisliked || !favoriteSong.isDisliked)
      );

      return matchesMain;
    });
  }, [groupedSongs, filters, groupFavorites]);

  const filteredSortedSongs = useMemo(() => {
    return sortedSongs.filter(song => {
      if (filters.liked && !song.isLiked) return false;
      if (filters.disliked && !song.isDisliked) return false;
      if (filters.hideDisliked && song.isDisliked) return false;
      return true;
    });
  }, [sortedSongs, filters]);

  return { filteredGroupedSongs, filteredSortedSongs };
};
