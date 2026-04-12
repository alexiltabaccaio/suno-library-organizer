import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Song } from '../lib/types';
import { getSongGroupKey, buildGroupKey } from '../lib/songUtils';
import { useEditor } from './EditorContext';
import { useIsMobile } from '../hooks/useMediaQuery';

const COVER_GRADIENTS = [
  'from-pink-500 via-purple-500 to-orange-400',
  'from-blue-500 via-teal-500 to-green-400',
  'from-yellow-400 via-orange-500 to-red-500',
  'from-indigo-500 via-purple-600 to-pink-500',
  'from-cyan-400 via-blue-500 to-indigo-600',
  'from-emerald-400 via-teal-500 to-cyan-500',
  'from-rose-400 via-pink-500 to-purple-600'
];

const INITIAL_SONGS: Song[] = [
  {
    id: '1',
    title: 'Neon Morning Light',
    styles: 'Synthwave, 80s nostalgia, pulsing bass, gated reverb drums, neon aesthetic',
    lyrics: "[Atmospheric Intro]\n[Pulsing Synthesizer]\nCan you feel the energy?\n(Energy)\nIt's taking over you and me\n(You and me)\n\n[Instrumental Break]\n[Hard-hitting Drums]\n(Let's go!)\nDance until the morning light\n(Jump! Jump!)\n\n[Verse]\nNeon lights are flashing bright\nEverything is feeling right\n(So right)\nLose yourself inside the sound\nFeet are lifting off the ground\n\n[Pre-Chorus]\nHere it comes again\nWe're reaching for the end\n(Hold on tight)\n\n[Chorus]\n[Heavy Bass Drop]\n(Let's go!)\nDance until the morning light\n(Jump! Jump!)",
    duration: '2:06',
    version: 'v5.5',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    coverColor: COVER_GRADIENTS[0],
  },
  {
    id: '2',
    title: 'Neon Morning Light',
    styles: 'Synthwave, 80s nostalgia, pulsing bass, gated reverb drums, neon aesthetic',
    lyrics: "[Atmospheric Intro]\n[Pulsing Synthesizer]\nCan you feel the energy?\n(Energy)\nIt's taking over you and me\n(You and me)\n\n[Instrumental Break]\n[Hard-hitting Drums]\n(Let's go!)\nDance until the morning light\n(Jump! Jump!)\n\n[Verse]\nNeon lights are flashing bright\nEverything is feeling right\n(So right)\nLose yourself inside the sound\nFeet are lifting off the ground\n\n[Pre-Chorus]\nHere it comes again\nWe're reaching for the end\n(Hold on tight)\n\n[Chorus]\n[Heavy Bass Drop]\n(Let's go!)\nDance until the morning light\n(Jump! Jump!)",
    duration: '2:27',
    version: 'v5.5',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 - 10000),
    coverColor: COVER_GRADIENTS[3],
  }
];

interface WorkspaceContextType {
  songs: Song[];
  selectedSongId: string | null;
  selectedItemId: string | null;
  selectedItemIds: Set<string>;
  groupFavorites: Record<string, string>;
  viewMode: 'before' | 'v1' | 'v2';
  setViewMode: (val: 'before' | 'v1' | 'v2') => void;
  isMobileEditorOpen: boolean;
  setIsMobileEditorOpen: (val: boolean) => void;
  handleCreate: () => void;
  handleSelectItem: (itemId: string, songId: string, shiftKey?: boolean, ctrlKey?: boolean, visibleIds?: string[]) => void;
  handleDelete: (itemIds: string[]) => void;
  handleRenameSong: (id: string, newTitle: string, isTitleRename?: boolean) => void;
  handleSetFavorite: (groupKey: string, songId: string) => void;
  handleToggleLike: (id: string) => void;
  handleToggleDislike: (id: string) => void;
  handleTogglePin: (id: string) => void;
  closeDetails: () => void;
  selectedSong: Song | null;
}

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

export const WorkspaceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const isMobile = useIsMobile();
  const { lyrics, styles, title } = useEditor();
  
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [selectedSongId, setSelectedSongId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(new Set());
  const [groupFavorites, setGroupFavorites] = useState<Record<string, string>>({});
  const [lastClickedId, setLastClickedId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'before' | 'v1' | 'v2'>('v1');
  const [isMobileEditorOpen, setIsMobileEditorOpen] = useState(false);

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

    const createSong = (index: number): Song => {
      const randomMinutes = Math.floor(Math.random() * 4) + 2;
      const randomSeconds = Math.floor(Math.random() * 60);
      const randomDuration = `${randomMinutes}:${randomSeconds.toString().padStart(2, '0')}`;
      
      return {
        id: `${Date.now()}-${index}`,
        title: finalTitle || 'Untitled Song',
        styles: styles.trim() || 'No styles specified',
        lyrics: lyrics.trim() || '[Instrumental]',
        duration: randomDuration,
        version: 'v5.5',
        createdAt: new Date(),
        coverColor: COVER_GRADIENTS[Math.floor(Math.random() * COVER_GRADIENTS.length)],
      };
    };

    const song1 = createSong(1);
    const song2 = createSong(2);

    setSongs(prev => [song1, song2, ...prev]);
    setSelectedItemId(song1.id);
    setSelectedItemIds(new Set([song1.id]));
    setLastClickedId(song1.id);
    if (!isMobile) {
      setSelectedSongId(song1.id);
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

  const handleDelete = (itemIds: string[]) => {
    setSongs(prev => {
      // itemIds can be song IDs or group keys
      // We need to filter out songs that match these IDs or are part of these groups
      return prev.filter(song => {
        // If it's a direct song ID match
        if (itemIds.includes(song.id)) return false;
        
        // If it's a group key match (title|styles|lyrics)
        const groupKey = getSongGroupKey(song);
        if (itemIds.includes(groupKey)) return false;

        return true;
      });
    });

    // Clear selection if deleted items were selected
    setSelectedItemIds(prev => {
      const next = new Set(prev);
      itemIds.forEach(id => next.delete(id));
      return next;
    });

    if (selectedItemId && itemIds.includes(selectedItemId)) {
      setSelectedItemId(null);
      setSelectedSongId(null);
      setLastClickedId(null);
    }
  };

  const handleRenameSong = (id: string, newTitle: string, isTitleRename: boolean = false) => {
    const isGroup = id.includes('|');

    if (isGroup) {
      const oldGroupKey = id;
      const [, styles, lyrics] = oldGroupKey.split('|');
      const newGroupKey = buildGroupKey(newTitle, styles, lyrics);

      // Update songs titles
      setSongs(prev => prev.map(song => {
        if (getSongGroupKey(song) === oldGroupKey) {
          return { ...song, title: newTitle };
        }
        return song;
      }));

      // Update group favorites mapping
      setGroupFavorites(prev => {
        if (prev[oldGroupKey]) {
          const next = { ...prev };
          next[newGroupKey] = next[oldGroupKey];
          delete next[oldGroupKey];
          return next;
        }
        return prev;
      });
    } else {
      // Specific song rename (child card or Before mode)
      setSongs(prev => prev.map(song => {
        if (song.id === id) {
          if (isTitleRename) {
            return { ...song, title: newTitle };
          } else {
            return { 
              ...song, 
              notes: newTitle,
              isRenamed: true 
            };
          }
        }
        return song;
      }));
    }
  };

  const handleSetFavorite = (groupKey: string, songId: string) => {
    setGroupFavorites(prev => {
      const next = { ...prev };
      if (next[groupKey] === songId) {
        delete next[groupKey];
      } else {
        next[groupKey] = songId;
      }
      return next;
    });
  };

  const handleToggleLike = (id: string) => {
    setSongs(prev => {
      // Se id è un groupKey (contiene |), dobbiamo trovare la canzone favorita o la prima
      let targetId = id;
      if (id.includes('|')) {
        const groupSongs = prev.filter(s => getSongGroupKey(s) === id);
        targetId = groupFavorites[id] || groupSongs[0]?.id;
      }

      return prev.map(song => {
        if (song.id === targetId) {
          const isLiked = !song.isLiked;
          return { ...song, isLiked, isDisliked: isLiked ? false : song.isDisliked };
        }
        return song;
      });
    });
  };

  const handleToggleDislike = (id: string) => {
    setSongs(prev => {
      let targetId = id;
      if (id.includes('|')) {
        const groupSongs = prev.filter(s => getSongGroupKey(s) === id);
        targetId = groupFavorites[id] || groupSongs[0]?.id;
      }

      return prev.map(song => {
        if (song.id === targetId) {
          const isDisliked = !song.isDisliked;
          return { ...song, isDisliked, isLiked: isDisliked ? false : song.isLiked };
        }
        return song;
      });
    });
  };

  const handleTogglePin = (id: string) => {
    setSongs(prev => {
      let targetId = id;
      if (id.includes('|')) {
        const groupSongs = prev.filter(s => getSongGroupKey(s) === id);
        targetId = groupFavorites[id] || groupSongs[0]?.id;
      }

      return prev.map(song => 
        song.id === targetId ? { ...song, isPinned: !song.isPinned } : song
      );
    });
  };

  const closeDetails = () => {
    setSelectedSongId(null);
    setSelectedItemId(null);
    setSelectedItemIds(new Set());
    setLastClickedId(null);
  };

  const selectedSong = songs.find(s => s.id === selectedSongId) || null;

  return (
    <WorkspaceContext.Provider value={{
      songs, selectedSongId, selectedItemId, selectedItemIds, groupFavorites, viewMode, setViewMode,
      isMobileEditorOpen, setIsMobileEditorOpen, handleCreate,
      handleSelectItem, handleDelete, handleRenameSong, handleSetFavorite,
      handleToggleLike, handleToggleDislike, handleTogglePin,
      closeDetails, selectedSong
    }}>
      {children}
    </WorkspaceContext.Provider>
  );
};

export const useWorkspace = () => {
  const context = useContext(WorkspaceContext);
  if (!context) throw new Error('useWorkspace must be used within WorkspaceProvider');
  return context;
};
