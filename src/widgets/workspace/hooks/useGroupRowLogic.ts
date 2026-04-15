import { useMemo } from 'react';
import { useUI } from '../../../features/ui/model/UIContext';
import { SongGroup } from '../../../features/library/hooks/useSongGrouping';

export const useGroupRowLogic = (group: SongGroup, groupFavoriteId?: string) => {
  const { subFilters, groupPages, setGroupPage, checkedSongIds } = useUI();
  const SUB_ITEMS_PER_PAGE = 15;

  const favoriteSong = useMemo(() => {
    return group.songs.find(s => s.id === groupFavoriteId) || group.songs[0];
  }, [group.songs, groupFavoriteId]);

  const allGroupSongsChecked = useMemo(() => {
    return group.songs.every(s => checkedSongIds.has(s.id));
  }, [group.songs, checkedSongIds]);

  const filteredSubSongs = useMemo(() => {
    return group.songs.filter(s => {
      if (subFilters.liked && !s.isLiked) return false;
      if (subFilters.disliked && !s.isDisliked) return false;
      if (subFilters.hideDisliked && s.isDisliked) return false;
      return true;
    });
  }, [group.songs, subFilters]);

  const totalSubPages = Math.ceil(filteredSubSongs.length / SUB_ITEMS_PER_PAGE);
  const subPage = Math.min(groupPages[group.key] || 1, totalSubPages || 1);
  const start = (subPage - 1) * SUB_ITEMS_PER_PAGE;
  const paginatedSubSongs = filteredSubSongs.slice(start, start + SUB_ITEMS_PER_PAGE);

  return {
    favoriteSong,
    allGroupSongsChecked,
    paginatedSubSongs,
    subPage,
    totalSubPages,
    setGroupPage
  };
};
