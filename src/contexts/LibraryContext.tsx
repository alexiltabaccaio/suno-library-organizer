import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Song } from '../lib/types';
import { getSongGroupKey, buildGroupKey } from '../lib/songUtils';
import { COVER_GRADIENTS } from '../lib/constants';

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

interface LibraryContextType {
  songs: Song[];
  groupFavorites: Record<string, string>;
  addSongs: (newSongs: Song[]) => void;
  handleDelete: (itemIds: string[]) => void;
  handleRenameSong: (id: string, newTitle: string, isTitleRename?: boolean) => void;
  handleSetFavorite: (groupKey: string, songId: string) => void;
  handleToggleLike: (id: string) => void;
  handleToggleDislike: (id: string) => void;
  handleTogglePin: (id: string) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [songs, setSongs] = useState<Song[]>(INITIAL_SONGS);
  const [groupFavorites, setGroupFavorites] = useState<Record<string, string>>({});

  const addSongs = (newSongs: Song[]) => {
    setSongs(prev => [...newSongs, ...prev]);
  };

  const handleDelete = (itemIds: string[]) => {
    setSongs(prev => {
      return prev.filter(song => {
        if (itemIds.includes(song.id)) return false;
        const groupKey = getSongGroupKey(song);
        if (itemIds.includes(groupKey)) return false;
        return true;
      });
    });
  };

  const handleRenameSong = (id: string, newTitle: string, isTitleRename: boolean = false) => {
    const isGroup = id.includes('|');

    if (isGroup) {
      const oldGroupKey = id;
      const [, styles, lyrics] = oldGroupKey.split('|');
      const newGroupKey = buildGroupKey(newTitle, styles, lyrics);

      setSongs(prev => prev.map(song => {
        if (getSongGroupKey(song) === oldGroupKey) {
          return { ...song, title: newTitle };
        }
        return song;
      }));

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

  return (
    <LibraryContext.Provider value={{
      songs, groupFavorites, addSongs, handleDelete, handleRenameSong, 
      handleSetFavorite, handleToggleLike, handleToggleDislike, handleTogglePin
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within LibraryProvider');
  return context;
};
