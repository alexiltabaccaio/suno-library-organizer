import React, { useRef } from 'react';
import { ActionButtons } from './ActionButtons';
import { LyricsEditor } from './LyricsEditor';
import { StylesEditor } from './StylesEditor';
import { SongMetadata } from './SongMetadata';
import { useEditorStore } from '@/app/store/useEditorStore';
import { useSmartInsert } from '@/features/editor/hooks/useSmartInsert';
import { FormattedTextareaRef } from './FormattedTextarea';

interface EditorPanelProps {
  isMobile?: boolean;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({ isMobile }) => {
  const { 
    lyrics, setLyrics, 
    isLyricsExpanded, setIsLyricsExpanded,
    isLyricsCollapsed, setIsLyricsCollapsed,
    isStylesCollapsed, setIsStylesCollapsed,
    formattingMode, setFormattingMode,
    showInfo, setShowInfo,
    styles, setStyles,
    title, setTitle,
    handleGenerateSong: storeGenerateSong
  } = useEditorStore();

  const lyricsRef = useRef<FormattedTextareaRef>(null);

  const handleGenerateSong = () => {
    storeGenerateSong();
    if (lyricsRef.current) {
      lyricsRef.current.setCursorPos(0);
    }
  };

  const handleSmartInsert = useSmartInsert(lyrics, setLyrics, lyricsRef);

  return (
    <div className="p-4 space-y-4 overflow-y-auto flex-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {!isMobile && <ActionButtons />}

      <LyricsEditor 
        lyrics={lyrics}
        setLyrics={setLyrics}
        lyricsRef={lyricsRef}
        isExpanded={isLyricsExpanded}
        setIsExpanded={setIsLyricsExpanded}
        isCollapsed={isLyricsCollapsed}
        setIsCollapsed={setIsLyricsCollapsed}
        formattingMode={formattingMode}
        setFormattingMode={setFormattingMode}
        showInfo={showInfo}
        setShowInfo={setShowInfo}
        onGenerateSong={handleGenerateSong}
        onSmartInsert={handleSmartInsert}
      />

      <StylesEditor 
        styles={styles} 
        setStyles={setStyles} 
        isCollapsed={isStylesCollapsed}
        setIsCollapsed={setIsStylesCollapsed}
      />

      <SongMetadata title={title} setTitle={setTitle} />
    </div>
  );
};
