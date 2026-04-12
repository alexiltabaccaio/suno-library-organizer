import React from 'react';
import { TopBar } from './TopBar';
import { CreateButton } from './CreateButton';
import { WorkspaceArea } from '../workspace/WorkspaceArea';
import { SongDetailsPanel } from '../workspace/SongDetailsPanel';
import { EditorPanel } from '../editor/EditorPanel';
import { useEditor } from '../../contexts/EditorContext';
import { useUI } from '../../contexts/UIContext';

export const DesktopLayout: React.FC = () => {
  const { lyrics, styles, formattingMode, setFormattingMode } = useEditor();
  const { selectedSong, handleCreate, closeDetails } = useUI();

  return (
    <div className="h-screen w-full bg-[#101012] text-zinc-100 flex font-sans overflow-hidden">
      {/* Left Column: Editor */}
      <div className="w-[450px] bg-[#101012] h-full flex flex-col shrink-0 border-r border-zinc-800/50">
        <TopBar />
        <EditorPanel />
        <CreateButton 
          isActive={lyrics.trim().length > 0 || styles.trim().length > 0} 
          onClick={handleCreate}
        />
      </div>

      {/* Middle Column: Workspace */}
      <WorkspaceArea />

      {/* Right Column: Details */}
      {selectedSong ? (
        <SongDetailsPanel 
          song={selectedSong} 
          formattingMode={formattingMode}
          setFormattingMode={setFormattingMode}
          onClose={closeDetails} 
        />
      ) : (
        <div className="w-[380px] bg-[#101012] h-full flex flex-col shrink-0 border-l border-zinc-800/50 items-center justify-center text-zinc-600">
          Select a song to view details
        </div>
      )}
    </div>
  );
};
