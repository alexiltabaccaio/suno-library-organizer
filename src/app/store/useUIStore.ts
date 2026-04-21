import React from 'react';
import { create } from 'zustand';
import { Song } from '@/entities/song/model/types';
import { COVER_GRADIENTS } from '@/shared/lib/constants';
import { useLibraryStore } from '@/app/store/useLibraryStore';
import { useEditorStore } from '@/app/store/useEditorStore';

export interface Filters {
  liked: boolean;
  disliked: boolean;
  hideDisliked: boolean;
}

interface UIState {
  viewMode: 'before' | 'v1' | 'v2';
  isMobileEditorOpen: boolean;
  selectedSongId: string | null;
  selectedItemId: string | null;
  checkedSongIds: Set<string>;
  lastClickedId: string | null;
  expandedGroups: Set<string>;
  
  filters: Filters;
  groupSubFilters: Record<string, Filters>;
  groupPages: Record<string, number>;

  // Actions
  setViewMode: (val: 'before' | 'v1' | 'v2') => void;
  setIsMobileEditorOpen: (val: boolean) => void;
  
  // Selection Actions
  handleSelectItem: (itemId: string, songId: string, shiftKey?: boolean, ctrlKey?: boolean, visibleIds?: string[]) => void;
  toggleCheck: (id: string) => void;
  toggleGroupCheck: (songsInGroup: Song[]) => void;
  handleBulkToggleSelection: (ids: string[], ctrlKey?: boolean) => void;
  setCheckedSongIds: (ids: Set<string> | ((prev: Set<string>) => Set<string>)) => void;
  clearCheckedSongs: () => void;
  closeDetails: () => void;
  clearItemSelection: () => void;

  // Group Expansion
  toggleGroup: (e: React.MouseEvent | undefined, key: string) => void;
  updateExpandedGroupKey: (oldKey: string, newKey: string) => void;

  // Filter Actions
  setFilters: (filters: Filters) => void;
  setGroupSubFilters: (groupKey: string, filters: Filters) => void;
  toggleFilter: (key: keyof Filters) => void;
  toggleGroupSubFilter: (groupKey: string, key: keyof Filters) => void;
  setGroupPage: (groupKey: string, page: number) => void;

  // Action Logic
  handleCreate: () => void;
  handleQuickGenerate: (baseSong: Song) => void;

  // Calculated
  selectedSong: () => Song | null;
}

export const useUIStore = create<UIState>((set, get) => ({
  viewMode: 'before',
  isMobileEditorOpen: false,
  selectedSongId: null,
  selectedItemId: null,
  checkedSongIds: new Set(),
  lastClickedId: null,
  expandedGroups: new Set(),
  
  filters: { liked: false, disliked: false, hideDisliked: false },
  groupSubFilters: {},
  groupPages: {},

  setViewMode: (val) => set({ viewMode: val }),
  setIsMobileEditorOpen: (val) => set({ isMobileEditorOpen: val }),

  selectedSong: () => {
    const songs = useLibraryStore.getState().songs;
    return songs.find(s => s.id === get().selectedSongId) || null;
  },

  setCheckedSongIds: (ids) => set((state) => ({
    checkedSongIds: typeof ids === 'function' ? ids(state.checkedSongIds) : ids
  })),

  handleSelectItem: (itemId, songId, shiftKey, ctrlKey, visibleIds) => set((state) => {
    const next: Partial<UIState> = { selectedItemId: itemId, selectedSongId: songId };

    if (shiftKey && state.lastClickedId && visibleIds) {
      const lastIndex = visibleIds.indexOf(state.lastClickedId);
      const currentIndex = visibleIds.indexOf(itemId);
      
      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        const rangeIds = visibleIds.slice(start, end + 1);
        next.checkedSongIds = new Set(rangeIds);
      } else {
        next.checkedSongIds = new Set([itemId]);
        next.lastClickedId = itemId;
      }
    } else if (ctrlKey) {
      const nextChecked = new Set(state.checkedSongIds);
      if (nextChecked.has(itemId)) {
        nextChecked.delete(itemId);
      } else {
        nextChecked.add(itemId);
      }
      next.checkedSongIds = nextChecked;
      next.lastClickedId = itemId;
    } else {
      next.lastClickedId = itemId;
    }

    return next;
  }),

  toggleCheck: (id) => set((state) => {
    const nextChecked = new Set(state.checkedSongIds);
    const next: Partial<UIState> = {};

    if (nextChecked.has(id)) {
      nextChecked.delete(id);
      
      const song = useLibraryStore.getState().songs.find(s => s.id === id);
      if (song) {
        const groupKey = `${song.title}|${song.styles}|${song.lyrics}`;
        nextChecked.delete(groupKey);
      }

      if (state.selectedItemId === id) {
        next.selectedItemId = null;
        next.lastClickedId = null;
      }
    } else {
      nextChecked.add(id);
    }
    
    next.checkedSongIds = nextChecked;
    return next;
  }),

  toggleGroupCheck: (songsInGroup) => set((state) => {
    const nextChecked = new Set(state.checkedSongIds);
    const allChecked = songsInGroup.every(s => nextChecked.has(s.id));
    const groupKey = `${songsInGroup[0].title}|${songsInGroup[0].styles}|${songsInGroup[0].lyrics}`;
    
    const next: Partial<UIState> = {};

    if (allChecked) {
      songsInGroup.forEach(s => nextChecked.delete(s.id));
      nextChecked.delete(groupKey);
      if (state.selectedItemId === groupKey) {
        next.selectedItemId = null;
        next.lastClickedId = null;
      }
    } else {
      songsInGroup.forEach(s => nextChecked.add(s.id));
      nextChecked.add(groupKey);
    }

    next.checkedSongIds = nextChecked;
    return next;
  }),

  handleBulkToggleSelection: (ids, ctrlKey) => set((state) => {
    const nextChecked = new Set(state.checkedSongIds);
    const songs = useLibraryStore.getState().songs;

    ids.forEach(id => {
      if (ctrlKey) {
        if (nextChecked.has(id)) {
          nextChecked.delete(id);
          const song = songs.find(s => s.id === id);
          if (song) {
            const groupKey = `${song.title}|${song.styles}|${song.lyrics}`;
            nextChecked.delete(groupKey);
          }
        } else {
          nextChecked.add(id);
          if (id.includes('|')) {
            const groupSongs = songs.filter(s => `${s.title}|${s.styles}|${s.lyrics}` === id);
            groupSongs.forEach(s => nextChecked.add(s.id));
          }
        }
      } else {
        if (!nextChecked.has(id)) {
          nextChecked.add(id);
          if (id.includes('|')) {
            const groupSongs = songs.filter(s => `${s.title}|${s.styles}|${s.lyrics}` === id);
            groupSongs.forEach(s => nextChecked.add(s.id));
          }
        }
      }
    });

    return { checkedSongIds: nextChecked };
  }),

  clearCheckedSongs: () => set({ checkedSongIds: new Set() }),
  closeDetails: () => set({ selectedSongId: null }),
  clearItemSelection: () => set({ selectedItemId: null, lastClickedId: null }),

  toggleGroup: (e, key) => {
    e?.stopPropagation();
    set((state) => {
      const next = new Set(state.expandedGroups);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return { expandedGroups: next };
    });
  },

  updateExpandedGroupKey: (oldKey, newKey) => set((state) => {
    if (state.expandedGroups.has(oldKey)) {
      const next = new Set(state.expandedGroups);
      next.delete(oldKey);
      next.add(newKey);
      return { expandedGroups: next };
    }
    return state;
  }),

  setFilters: (filters) => set({ filters }),
  
  setGroupSubFilters: (groupKey, filters) => set((state) => ({
    groupSubFilters: { ...state.groupSubFilters, [groupKey]: filters }
  })),

  toggleFilter: (key) => set((state) => ({
    filters: { ...state.filters, [key]: !state.filters[key] }
  })),

  toggleGroupSubFilter: (groupKey, key) => set((state) => {
    const currentFilters = state.groupSubFilters[groupKey] || { liked: false, disliked: false, hideDisliked: false };
    return {
      groupSubFilters: {
        ...state.groupSubFilters,
        [groupKey]: { ...currentFilters, [key]: !currentFilters[key] }
      }
    };
  }),

  setGroupPage: (groupKey, page) => set((state) => ({
    groupPages: { ...state.groupPages, [groupKey]: page }
  })),

  handleCreate: () => {
    const editor = useEditorStore.getState();
    const { lyrics, styles, title, version } = editor;
    
    if (!lyrics.trim() && !styles.trim()) return;

    let finalTitle = title.trim();
    
    if (finalTitle.toLowerCase() === "never gonna give you up") {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1", "_blank");
      return;
    }

    if (!finalTitle && lyrics.trim()) {
      const lines = lyrics.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('[') && !trimmed.startsWith('(')) {
          finalTitle = trimmed;
          break;
        }
      }
    }

    const now = Date.now();
    const groupKey = `${finalTitle || 'Untitled Song'}|${styles.trim() || 'No styles specified'}|${lyrics.trim() || '[Instrumental]'}`;
    
    const libraryStore = useLibraryStore.getState();
    const groupSongs = libraryStore.songs.filter(s => {
      const sKey = `${s.title}|${s.styles}|${s.lyrics}`;
      return sKey === groupKey;
    });
    
    const maxTake = groupSongs.reduce((max, s) => Math.max(max, s.takeNumber || 0), 0);

    const createSong = (index: number, timestamp: number, takeNum: number): Song => {
      const randomMinutes = Math.floor(Math.random() * 4) + 2;
      const randomSeconds = Math.floor(Math.random() * 60);
      const randomDuration = `${randomMinutes}:${randomSeconds.toString().padStart(2, '0')}`;
      
      return {
        id: `${timestamp}-${index}`,
        title: finalTitle || 'Untitled Song',
        styles: styles.trim() || 'No styles specified',
        lyrics: lyrics.trim() || '[Instrumental]',
        duration: randomDuration,
        version: version,
        createdAt: new Date(timestamp),
        coverColor: COVER_GRADIENTS[Math.floor(Math.random() * COVER_GRADIENTS.length)],
        takeNumber: takeNum
      };
    };

    const song1 = createSong(1, now, maxTake + 1);
    const song2 = createSong(2, now + 1, maxTake + 2);

    libraryStore.addSongs([song2, song1]);
    set({ isMobileEditorOpen: false });
  },

  handleQuickGenerate: (baseSong) => {
    if (baseSong.title.toLowerCase() === "never gonna give you up") {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1", "_blank");
      return;
    }

    const now = Date.now();
    const groupKey = `${baseSong.title}|${baseSong.styles}|${baseSong.lyrics}`;
    
    const libraryStore = useLibraryStore.getState();
    const groupSongs = libraryStore.songs.filter(s => {
      const sKey = `${s.title}|${s.styles}|${s.lyrics}`;
      return sKey === groupKey;
    });
    
    const maxTake = groupSongs.reduce((max, s) => Math.max(max, s.takeNumber || 0), 0);

    const createSong = (index: number, timestamp: number, takeNum: number): Song => {
      const randomMinutes = Math.floor(Math.random() * 4) + 2;
      const randomSeconds = Math.floor(Math.random() * 60);
      const randomDuration = `${randomMinutes}:${randomSeconds.toString().padStart(2, '0')}`;
      
      return {
        id: `${timestamp}-${index}`,
        title: baseSong.title,
        styles: baseSong.styles,
        lyrics: baseSong.lyrics,
        duration: randomDuration,
        version: baseSong.version,
        createdAt: new Date(timestamp),
        coverColor: COVER_GRADIENTS[Math.floor(Math.random() * COVER_GRADIENTS.length)],
        takeNumber: takeNum
      };
    };

    const song1 = createSong(1, now, maxTake + 1);
    const song2 = createSong(2, now + 1, maxTake + 2);

    libraryStore.addSongs([song2, song1]);
  }
}));
