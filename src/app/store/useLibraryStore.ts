import { create } from 'zustand';
import { Song } from '@/entities/song/model/types';
import { getSongGroupKey, buildGroupKey } from '@/entities/song/lib/songUtils';
import { INITIAL_SONGS } from '@/app/store/mockData';
import { useUIStore } from '@/app/store/useUIStore';

interface LibraryState {
  songs: Song[];
  groupFavorites: Record<string, string>;
  
  // Actions
  addSongs: (newSongs: Song[]) => void;
  handleDelete: (itemIds: string[]) => void;
  handleRenameSong: (id: string, newTitle: string, isTitleRename?: boolean) => void;
  handleSetFavorite: (groupKey: string, songId: string) => void;
  handleToggleLike: (idOrIds: string | string[], forceState?: boolean) => void;
  handleToggleDislike: (idOrIds: string | string[], forceState?: boolean) => void;
  handleTogglePin: (idOrIds: string | string[], forceState?: boolean) => void;
}

export const useLibraryStore = create<LibraryState>((set) => ({
  songs: INITIAL_SONGS,
  groupFavorites: {},

  addSongs: (newSongs) => set((state) => ({
    songs: [...newSongs, ...state.songs]
  })),

  handleDelete: (itemIds) => {
    set((state) => {
      const nextSongs = state.songs.filter(song => {
        if (itemIds.includes(song.id)) return false;
        const groupKey = getSongGroupKey(song);
        if (itemIds.includes(groupKey)) return false;
        return true;
      });

      const nextFavs = { ...state.groupFavorites };
      const groupCounts: Record<string, number> = {};
      
      nextSongs.forEach(s => {
        const key = getSongGroupKey(s);
        groupCounts[key] = (groupCounts[key] || 0) + 1;
      });

      Object.keys(nextFavs).forEach(key => {
        if (!groupCounts[key] || groupCounts[key] <= 1) {
          delete nextFavs[key];
        }
      });

      return {
        songs: nextSongs,
        groupFavorites: nextFavs
      };
    });

    // Clear deleted items from selection
    const uiStore = useUIStore.getState();
    uiStore.setCheckedSongIds(prev => {
      const next = new Set(prev);
      itemIds.forEach(id => next.delete(id));
      return next;
    });
  },

  handleRenameSong: (id, newTitle, isTitleRename = false) => set((state) => {
    const isGroup = id.includes('|');

    if (isGroup) {
      const oldGroupKey = id;
      const [, styles, lyrics] = oldGroupKey.split('|');
      const newGroupKey = buildGroupKey(newTitle, styles, lyrics);

      const nextSongs = state.songs.map(song => {
        if (getSongGroupKey(song) === oldGroupKey) {
          return { ...song, title: newTitle };
        }
        return song;
      });

      const nextFavs = { ...state.groupFavorites };
      if (nextFavs[oldGroupKey]) {
        nextFavs[newGroupKey] = nextFavs[oldGroupKey];
        delete nextFavs[oldGroupKey];
      }

      // Update expanded state in UI store directly
      useUIStore.getState().updateExpandedGroupKey(oldGroupKey, newGroupKey);

      return {
        songs: nextSongs,
        groupFavorites: nextFavs
      };
    } else {
      const nextSongs = state.songs.map(song => {
        if (song.id === id) {
          if (isTitleRename) {
            return { ...song, title: newTitle };
          } else {
            const isEmpty = !newTitle.trim();
            return { 
              ...song, 
              notes: isEmpty ? undefined : newTitle,
              isRenamed: !isEmpty 
            };
          }
        }
        return song;
      });

      return { songs: nextSongs };
    }
  }),

  handleSetFavorite: (groupKey, songId) => set((state) => {
    const next = { ...state.groupFavorites };
    if (next[groupKey] === songId) {
      delete next[groupKey];
    } else {
      next[groupKey] = songId;
    }
    return { groupFavorites: next };
  }),

  handleToggleLike: (idOrIds, forceState) => set((state) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const targetIds = new Set<string>();
    
    ids.forEach(id => {
      if (id.includes('|')) {
        const groupSongs = state.songs.filter(s => getSongGroupKey(s) === id);
        const targetId = state.groupFavorites[id] || groupSongs[0]?.id;
        if (targetId) targetIds.add(targetId);
      } else {
        targetIds.add(id);
      }
    });

    const nextSongs = state.songs.map(song => {
      if (targetIds.has(song.id)) {
        const newState = forceState !== undefined ? forceState : !song.isLiked;
        return { 
          ...song, 
          isLiked: newState, 
          isDisliked: newState ? false : song.isDisliked 
        };
      }
      return song;
    });

    return { songs: nextSongs };
  }),

  handleToggleDislike: (idOrIds, forceState) => set((state) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const targetIds = new Set<string>();
    
    ids.forEach(id => {
      if (id.includes('|')) {
        const groupSongs = state.songs.filter(s => getSongGroupKey(s) === id);
        const targetId = state.groupFavorites[id] || groupSongs[0]?.id;
        if (targetId) targetIds.add(targetId);
      } else {
        targetIds.add(id);
      }
    });

    const nextSongs = state.songs.map(song => {
      if (targetIds.has(song.id)) {
        const newState = forceState !== undefined ? forceState : !song.isDisliked;
        return { 
          ...song, 
          isDisliked: newState, 
          isLiked: newState ? false : song.isLiked 
        };
      }
      return song;
    });

    return { songs: nextSongs };
  }),

  handleTogglePin: (idOrIds, forceState) => set((state) => {
    const ids = Array.isArray(idOrIds) ? idOrIds : [idOrIds];
    const targetIds = new Set<string>();
    
    ids.forEach(id => {
      if (id.includes('|')) {
        const groupSongs = state.songs.filter(s => getSongGroupKey(s) === id);
        const targetId = state.groupFavorites[id] || groupSongs[0]?.id;
        if (targetId) targetIds.add(targetId);
      } else {
        targetIds.add(id);
      }
    });

    const nextSongs = state.songs.map(song => {
      if (targetIds.has(song.id)) {
        const newState = forceState !== undefined ? forceState : !song.isPinned;
        return { ...song, isPinned: newState };
      }
      return song;
    });

    return { songs: nextSongs };
  })
}));
