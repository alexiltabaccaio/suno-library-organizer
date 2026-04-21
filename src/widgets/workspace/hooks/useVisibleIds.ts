import { useMemo } from 'react';
import { Song } from '@/entities/song/model/types';
import { SongGroup } from '@/features/library/hooks/useSongGrouping';

interface Filters {
  liked: boolean;
  disliked: boolean;
  hideDisliked: boolean;
}

export const useVisibleIds = (
  viewMode: string,
  paginatedItems: (Song | SongGroup)[],
  expandedGroups: Set<string>,
  groupSubFilters: Record<string, Filters>
) => {
  return useMemo(() => {
    if (viewMode === 'before') return (paginatedItems as Song[]).map(s => s.id);
    
    const ids: string[] = [];
    (paginatedItems as SongGroup[]).forEach(group => {
      if (group.songs.length === 1) {
        ids.push(group.songs[0].id);
      } else {
        ids.push(group.key);
        if (expandedGroups.has(group.key)) {
          const subFilters = groupSubFilters[group.key] || { liked: false, disliked: false, hideDisliked: false };
          const filteredSubSongs = group.songs.filter((s: Song) => {
            if (subFilters.liked && !s.isLiked) return false;
            if (subFilters.disliked && !s.isDisliked) return false;
            if (subFilters.hideDisliked && s.isDisliked) return false;
            return true;
          });
          filteredSubSongs.forEach((s: Song) => ids.push(s.id));
        }
      }
    });
    return ids;
  }, [viewMode, paginatedItems, expandedGroups, groupSubFilters]);
};
