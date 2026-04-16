import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useIsMobile } from '../../../shared/hooks/useMediaQuery';
import { useLibrary } from '../../library/model/LibraryContext';
import { useEditor } from '../../editor/model/EditorContext';
import { Song } from '../../../entities/song/model/types';
import { useSelectionLogic } from './useSelectionLogic';
import { useFilterLogic, Filters } from './useFilterLogic';
import { useActionLogic } from './useActionLogic';

interface UIContextType {
  selectedSongId: string | null;
  selectedItemId: string | null;
  checkedSongIds: Set<string>;
  viewMode: 'before' | 'v1' | 'v2';
  setViewMode: (val: 'before' | 'v1' | 'v2') => void;
  isMobileEditorOpen: boolean;
  setIsMobileEditorOpen: (val: boolean) => void;
  handleCreate: () => void;
  handleQuickGenerate: (song: Song) => void;
  handleSelectItem: (itemId: string, songId: string, shiftKey?: boolean, ctrlKey?: boolean, visibleIds?: string[]) => void;
  toggleCheck: (id: string) => void;
  toggleGroupCheck: (songsInGroup: Song[]) => void;
  handleBulkToggleSelection: (ids: string[], ctrlKey?: boolean) => void;
  setCheckedSongIds: React.Dispatch<React.SetStateAction<Set<string>>>;
  clearCheckedSongs: () => void;
  closeDetails: () => void;
  clearItemSelection: () => void;
  selectedSong: Song | null;
  filters: Filters;
  subFilters: Filters;
  setFilters: (filters: Filters) => void;
  setSubFilters: (filters: Filters) => void;
  toggleFilter: (key: keyof Filters) => void;
  toggleSubFilter: (key: keyof Filters) => void;
  groupPages: Record<string, number>;
  setGroupPage: (groupKey: string, page: number) => void;
}

export type { Filters };

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const { songs, addSongs } = useLibrary();
  const { lyrics, styles, title, version } = useEditor();
  
  const [viewMode, setViewMode] = useState<'before' | 'v1' | 'v2'>('before');
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(false);

  const selectionLogic = useSelectionLogic(songs, isMobile);
  const filterLogic = useFilterLogic();
  const actionLogic = useActionLogic(
    songs, 
    addSongs, 
    { lyrics, styles, title, version }, 
    setIsMobileEditorOpen
  );

  const selectedSong = useMemo(
    () => songs.find(s => s.id === selectionLogic.selectedSongId) || null, 
    [songs, selectionLogic.selectedSongId]
  );

  return (
    <UIContext.Provider value={{
      viewMode, setViewMode,
      isMobileEditorOpen, setIsMobileEditorOpen,
      selectedSong,
      ...selectionLogic,
      ...filterLogic,
      ...actionLogic
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
};
