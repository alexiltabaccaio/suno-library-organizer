import React, { createContext, useContext, useState, useRef, ReactNode } from 'react';
import { FormattedTextareaRef } from '../components/editor/FormattedTextarea';
import { SAMPLE_SONGS } from '../lib/constants';

interface EditorContextType {
  lyrics: string;
  setLyrics: (val: string) => void;
  styles: string;
  setStyles: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  isLyricsExpanded: boolean;
  setIsLyricsExpanded: (val: boolean) => void;
  formattingMode: 'none' | 'simple' | 'colored';
  setFormattingMode: (val: 'none' | 'simple' | 'colored') => void;
  showInfo: boolean;
  setShowInfo: (val: boolean) => void;
  lyricsRef: React.RefObject<FormattedTextareaRef>;
  handleGenerateSong: () => void;
}

const EditorContext = createContext<EditorContextType | undefined>(undefined);

export const EditorProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [lyrics, setLyrics] = useState('');
  const [styles, setStyles] = useState('');
  const [title, setTitle] = useState('');
  const [isLyricsExpanded, setIsLyricsExpanded] = useState(false);
  const [formattingMode, setFormattingMode] = useState<'none' | 'simple' | 'colored'>('none');
  const [showInfo, setShowInfo] = useState(false);
  const [lastSongIndex, setLastSongIndex] = useState(-1);
  const lyricsRef = useRef<FormattedTextareaRef>(null);

  const handleGenerateSong = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * SAMPLE_SONGS.length);
    } while (nextIndex === lastSongIndex);
    
    setLastSongIndex(nextIndex);
    setLyrics(SAMPLE_SONGS[nextIndex]);
    
    if (lyricsRef.current) {
      lyricsRef.current.setCursorPos(0);
    }
  };

  return (
    <EditorContext.Provider value={{
      lyrics, setLyrics, styles, setStyles, title, setTitle,
      isLyricsExpanded, setIsLyricsExpanded, formattingMode, setFormattingMode,
      showInfo, setShowInfo, lyricsRef, handleGenerateSong
    }}>
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);
  if (!context) throw new Error('useEditor must be used within EditorProvider');
  return context;
};
