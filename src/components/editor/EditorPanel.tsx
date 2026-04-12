import React from 'react';
import { ActionButtons } from './ActionButtons';
import { LyricsEditor } from './LyricsEditor';
import { StylesEditor } from './StylesEditor';
import { SongMetadata } from './SongMetadata';
import { useEditor } from '../../contexts/EditorContext';
import { useSmartInsert } from '../../hooks/useSmartInsert';

export const EditorPanel: React.FC = () => {
  const { 
    lyrics, setLyrics, lyricsRef, 
    isLyricsExpanded, setIsLyricsExpanded,
    formattingMode, setFormattingMode,
    showInfo, setShowInfo,
    styles, setStyles,
    title, setTitle,
    handleGenerateSong
  } = useEditor();

  const handleSmartInsert = useSmartInsert(lyrics, setLyrics, lyricsRef);

  return (
    <div className="p-4 space-y-4 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <ActionButtons />

      <LyricsEditor 
        lyrics={lyrics}
        setLyrics={setLyrics}
        lyricsRef={lyricsRef}
        isExpanded={isLyricsExpanded}
        setIsExpanded={setIsLyricsExpanded}
        formattingMode={formattingMode}
        setFormattingMode={setFormattingMode}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        onGenerateSong={handleGenerateSong}
        onSmartInsert={handleSmartInsert}
      />

      <StylesEditor styles={styles} setStyles={setStyles} />

      <SongMetadata title={title} setTitle={setTitle} />
    </div>
  );
};
