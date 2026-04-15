import { useState, useMemo, useEffect } from 'react';
import { Song } from '../../../entities/song/model/types';
import { SongGroup } from '../../../features/library/hooks/useSongGrouping';

export const useWorkspacePagination = (
  viewMode: string,
  filteredSortedSongs: Song[],
  filteredGroupedSongs: SongGroup[],
  itemsPerPage: number
) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Reset page when view mode changes
  useEffect(() => {
    setCurrentPage(1);
  }, [viewMode]);

  const paginatedData = useMemo(() => {
    if (viewMode === 'before') {
      const totalPages = Math.ceil(filteredSortedSongs.length / itemsPerPage);
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return {
        items: filteredSortedSongs.slice(start, end),
        totalPages: Math.max(1, totalPages)
      };
    } else {
      const totalPages = Math.ceil(filteredGroupedSongs.length / itemsPerPage);
      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return {
        items: filteredGroupedSongs.slice(start, end),
        totalPages: Math.max(1, totalPages)
      };
    }
  }, [viewMode, filteredSortedSongs, filteredGroupedSongs, currentPage, itemsPerPage]);

  return {
    currentPage,
    setCurrentPage,
    paginatedData
  };
};
