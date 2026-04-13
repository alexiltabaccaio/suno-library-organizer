import React, { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useIsMobile } from '../../../shared/hooks/useMediaQuery';
import { useLibrary } from '../../library/model/LibraryContext';
import { useEditor } from '../../editor/model/EditorContext';
import { Song } from '../../../entities/song/model/types';
import { COVER_GRADIENTS } from '../../../shared/lib/constants';

interface UIContextType {
  selectedSongId: string | null;
  selectedItemId: string | null;
  selectedItemIds: Set<string>;
  checkedSongIds: Set<string>;
  viewMode: 'before' | 'v1' | 'v2';
  setViewMode: (val: 'before' | 'v1' | 'v2') => void;
  isMobileEditorOpen: boolean;
  setIsMobileEditorOpen: (val: boolean) => void;
  handleCreate: () => void;
  handleSelectItem: (itemId: string, songId: string, shiftKey?: boolean, ctrlKey?: boolean, visibleIds?: string[]) => void;
  toggleCheck: (id: string) => void;
  toggleGroupCheck: (songsInGroup: Song[]) => void;
  closeDetails: () => void;
  selectedSong: Song | null;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const { songs, addSongs } = useLibrary();
  const { lyrics, styles, title, version } = useEditor();
  
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [checkedSongIds, setCheckedSongIds] = useState<Set<string>>(new Set());
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'before' | 'v1' | 'v2'>('v1');
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(false);

  // Handle group key changes to preserve selection state
  React.useEffect(() => {
    const handleGroupRenamed = (e: any) => {
      const { oldKey, newKey } = e.detail;
      
      setSelectedItemIds(prev => {
        if (prev.has(oldKey)) {
          const next = new Set(prev);
          next.delete(oldKey);
          next.add(newKey);
          return next;
        }
        return prev;
      });

      setSelectedItemId(prev => prev === oldKey ? newKey : prev);
      setLastClickedId(prev => prev === oldKey ? newKey : prev);
    };

    window.addEventListener('groupRenamed', handleGroupRenamed);
    return () => window.removeEventListener('groupRenamed', handleGroupRenamed);
  }, []);

  const handleCreate = () => {
    if (!lyrics.trim() && !styles.trim()) return;

    let finalTitle = title.trim();
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
    
    // Find the highest take number for this group
    const groupSongs = songs.filter(s => {
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

    addSongs([song2, song1]);
    
    setSelectedItemId(song2.id);
    setSelectedItemIds(new Set([song2.id]));
    setLastClickedId(song2.id);
    if (!isMobile) {
      setSelectedSongId(song2.id);
    }
    setIsMobileEditorOpen(false);
  };

  const handleSelectItem = (itemId: string, songId: string, shiftKey?: boolean, ctrlKey?: boolean, visibleIds?: string[]) => {
    setSelectedItemId(itemId);
    if (!isMobile) {
      setSelectedSongId(songId);
    }

    if (shiftKey && lastClickedId && visibleIds) {
      const lastIndex = visibleIds.indexOf(lastClickedId);
      const currentIndex = visibleIds.indexOf(itemId);
      
      if (lastIndex !== -1 && currentIndex !== -1) {
        const start = Math.min(lastIndex, currentIndex);
        const end = Math.max(lastIndex, currentIndex);
        const rangeIds = visibleIds.slice(start, end + 1);
        setSelectedItemIds(new Set(rangeIds));
      } else {
        setSelectedItemIds(new Set([itemId]));
        setLastClickedId(itemId);
      }
    } else if (ctrlKey) {
      setSelectedItemIds(prev => {
        const next = new Set(prev);
        if (next.has(itemId)) {
          next.delete(itemId);
        } else {
          next.add(itemId);
        }
        return next;
      });
      setLastClickedId(itemId);
    } else {
      setSelectedItemIds(new Set([itemId]));
      setLastClickedId(itemId);
    }
  };

  const toggleCheck = (id: string) => {
    setCheckedSongIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleGroupCheck = (songsInGroup: Song[]) => {
    setCheckedSongIds(prev => {
      const next = new Set(prev);
      const allChecked = songsInGroup.every(s => next.has(s.id));
      
      if (allChecked) {
        songsInGroup.forEach(s => next.delete(s.id));
      } else {
        songsInGroup.forEach(s => next.add(s.id));
      }
      return next;
    });
  };

  const closeDetails = () => {
    setSelectedSongId(null);
    setSelectedItemId(null);
    setSelectedItemIds(new Set());
    setLastClickedId(null);
  };

  const selectedSong = useMemo(() => songs.find(s => s.id === selectedSongId) || null, [songs, selectedSongId]);

  return (
    <UIContext.Provider value={{
      selectedSongId, selectedItemId, selectedItemIds, checkedSongIds, viewMode, setViewMode,
      isMobileEditorOpen, setIsMobileEditorOpen, handleCreate, handleSelectItem,
      toggleCheck, toggleGroupCheck, closeDetails, selectedSong
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
