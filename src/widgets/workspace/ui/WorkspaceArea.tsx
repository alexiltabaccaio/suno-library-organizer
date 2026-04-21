import React, { useState, useRef, useEffect } from 'react';
import { useLibraryStore } from '@/app/store/useLibraryStore';
import { useUIStore } from '@/app/store/useUIStore';
import { useEditorStore } from '@/app/store/useEditorStore';
import { Song } from '@/entities/song/model/types';
import { useSongGrouping } from '@/features/library/hooks/useSongGrouping';
import { useWorkspaceFilters } from '@/widgets/workspace/hooks/useWorkspaceFilters';
import { useWorkspacePagination } from '@/widgets/workspace/hooks/useWorkspacePagination';
import { useVisibleIds } from '@/widgets/workspace/hooks/useVisibleIds';
import { WorkspaceHeader } from './components/WorkspaceHeader';
import { WorkspaceToolbar } from './components/WorkspaceToolbar';
import { WorkspaceContent } from './components/WorkspaceContent';
import { WorkspaceFooter } from './components/WorkspaceFooter';

interface WorkspaceAreaProps {
  hideFooter?: boolean;
}

export const WorkspaceArea: React.FC<WorkspaceAreaProps> = ({ hideFooter = false }) => {
  const { songs, groupFavorites } = useLibraryStore();
  const { 
    viewMode, setViewMode, filters, toggleFilter, subFilters, 
    clearItemSelection, expandedGroups, toggleGroup, selectedSong: getSelectedSong 
  } = useUIStore();
  const selectedSong = getSelectedSong();
  const { formattingMode, setFormattingMode } = useEditorStore();

  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const ITEMS_PER_PAGE = 12;

  // Hooks for logic extraction
  const { sortedSongs, groupedSongs, songsWithTakeNumbers } = useSongGrouping(songs, groupFavorites);
  const { filteredGroupedSongs, filteredSortedSongs } = useWorkspaceFilters(groupedSongs, sortedSongs, filters, subFilters, groupFavorites);
  const { currentPage, setCurrentPage, paginatedData } = useWorkspacePagination(viewMode, filteredSortedSongs, filteredGroupedSongs, ITEMS_PER_PAGE);
  const visibleIds = useVisibleIds(viewMode, paginatedData.items, expandedGroups, subFilters);

  // Close filters when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div 
      className="flex-1 h-full flex flex-col bg-[#101012] overflow-hidden"
      onClick={() => clearItemSelection()}
    >
      <WorkspaceHeader />

      <WorkspaceToolbar 
        filters={filters}
        toggleFilter={toggleFilter}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        filterRef={filterRef}
        currentPage={currentPage}
        totalPages={paginatedData.totalPages}
        onPageChange={setCurrentPage}
      />

      <WorkspaceContent 
        viewMode={viewMode}
        items={paginatedData.items}
        songsWithTakeNumbers={songsWithTakeNumbers}
        visibleIds={visibleIds}
        expandedGroups={expandedGroups}
        toggleGroup={toggleGroup}
      />

      {!hideFooter && (
        <WorkspaceFooter 
          hasSelectedSong={!!selectedSong}
          formattingMode={formattingMode}
          setFormattingMode={setFormattingMode}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
      )}
    </div>
  );
};

