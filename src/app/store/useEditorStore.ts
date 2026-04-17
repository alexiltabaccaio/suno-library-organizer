import { create } from 'zustand';
import { SAMPLE_SONGS } from '@/shared/lib/constants';

interface EditorState {
  lyrics: string;
  styles: string;
  title: string;
  isLyricsExpanded: boolean;
  isLyricsCollapsed: boolean;
  isStylesCollapsed: boolean;
  formattingMode: 'none' | 'simple' | 'colored';
  version: string;
  showInfo: boolean;
  lastSongIndex: number;
  
  // Actions
  setLyrics: (val: string) => void;
  setStyles: (val: string) => void;
  setTitle: (val: string) => void;
  setIsLyricsExpanded: (val: boolean) => void;
  setIsLyricsCollapsed: (val: boolean) => void;
  setIsStylesCollapsed: (val: boolean) => void;
  setFormattingMode: (val: 'none' | 'simple' | 'colored') => void;
  setVersion: (val: string) => void;
  setShowInfo: (val: boolean) => void;
  handleGenerateSong: () => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  lyrics: '',
  styles: '',
  title: '',
  isLyricsExpanded: false,
  isLyricsCollapsed: false,
  isStylesCollapsed: false,
  formattingMode: 'none',
  version: 'v5.5',
  showInfo: false,
  lastSongIndex: -1,

  setLyrics: (val) => set({ lyrics: val }),
  setStyles: (val) => set({ styles: val }),
  setTitle: (val) => set({ title: val }),
  setIsLyricsExpanded: (val) => set({ isLyricsExpanded: val }),
  setIsLyricsCollapsed: (val) => set({ isLyricsCollapsed: val }),
  setIsStylesCollapsed: (val) => set({ isStylesCollapsed: val }),
  setFormattingMode: (val) => set({ formattingMode: val }),
  setVersion: (val) => set({ version: val }),
  setShowInfo: (val) => set({ showInfo: val }),
  
  handleGenerateSong: () => set((state) => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * SAMPLE_SONGS.length);
    } while (nextIndex === state.lastSongIndex);
    
    return {
      lastSongIndex: nextIndex,
      lyrics: SAMPLE_SONGS[nextIndex]
    };
  })
}));
