import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HorizontalScrollContainer } from '@/shared/ui/HorizontalScrollContainer';
import { V2GroupRow } from './V2GroupRow';
import { useUIStore } from '@/app/store/useUIStore';
import { useLibraryStore } from '@/app/store/useLibraryStore';

// Mock the stores
vi.mock('@/app/store/useUIStore');
vi.mock('@/app/store/useLibraryStore');

describe('V2 Interaction Logic', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock store defaults
    (useUIStore as any).mockReturnValue({
      checkedSongIds: new Set(),
      selectedSongId: null,
      selectedItemId: null,
      expandedGroups: new Set(),
      groupSubFilters: {},
      groupPages: {},
      handleSelectItem: vi.fn(),
      toggleCheck: vi.fn(),
      toggleGroupCheck: vi.fn(),
      handleQuickGenerate: vi.fn(),
      clearCheckedSongs: vi.fn(),
      setGroupPage: vi.fn(),
    });

    (useLibraryStore as any).mockReturnValue({
      songs: [],
      groupFavorites: {},
      handleToggleLike: vi.fn(),
      handleToggleDislike: vi.fn(),
      handleTogglePin: vi.fn(),
      handleRenameSong: vi.fn(),
      handleSetFavorite: vi.fn(),
      handleDelete: vi.fn(),
    });
  });

  describe('HorizontalScrollContainer Rendering', () => {
    it('should render children correctly', () => {
      const { getByText } = render(
        <HorizontalScrollContainer>
          <div>Scroll Content</div>
        </HorizontalScrollContainer>
      );
      expect(getByText('Scroll Content')).toBeDefined();
    });
  });

  describe('V2 Selection Dimming Across Pages', () => {
    const mockGroup = {
      key: 'Group A',
      songs: [
        { id: '1', title: 'Song 1', styles: '', lyrics: '' },
        { id: '2', title: 'Song 2', styles: '', lyrics: '' }
      ]
    };

    it('should apply dimming class when a song in the group is selected even if not on current page', () => {
      // Mock that song '2' is selected (imagine it's on page 2)
      (useUIStore as any).mockReturnValue({
        checkedSongIds: new Set(['2']),
        selectedSongId: null,
        selectedItemId: null,
        groupSubFilters: {},
        groupPages: {},
        toggleGroupCheck: vi.fn(),
        handleSelectItem: vi.fn(),
      });

      const { container } = render(
        <V2GroupRow 
          group={mockGroup as any}
          songsWithTakeNumbers={new Map()}
          visibleIds={['Group A']}
          isExpanded={true}
          toggleGroup={vi.fn()}
          hoveredSongId={null}
          setHoveredSongId={vi.fn()}
          hoveredActionsGroupKey={null}
          setHoveredActionsGroupKey={vi.fn()}
        />
      );

      // even if only song '1' is rendered (due to pagination, though here we render all)
      // the container should have the dimming class
      const scrollContainer = container.querySelector('.overflow-x-auto');
      expect(scrollContainer?.className).toContain('[&_.song-card:not(:hover):not(.is-selected)]:opacity-25');
    });
  });
});
