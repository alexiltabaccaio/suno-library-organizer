import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { TopBar } from './TopBar';
import { CreateButton } from './CreateButton';
import { WorkspaceArea } from '@/widgets/workspace/ui/WorkspaceArea';
import { SongDetailsPanel } from '@/widgets/workspace/ui/SongDetailsPanel';
import { EditorPanel } from '@/widgets/editor/ui/EditorPanel';
import { useEditorStore } from '@/app/store/useEditorStore';
import { useUIStore } from '@/app/store/useUIStore';

export const DesktopLayout: React.FC = () => {
  const { lyrics, styles } = useEditorStore();
  const { handleCreate, closeDetails, selectedSong: getSelectedSong } = useUIStore();
  const selectedSong = getSelectedSong();

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
      <div className="flex-1 h-full min-w-0 overflow-hidden">
        <WorkspaceArea />
      </div>

      {/* Right Column: Details */}
      <AnimatePresence>
        {selectedSong && (
          <motion.div 
            key="details-panel"
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 380, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="h-full flex flex-col shrink-0 border-l border-zinc-800/50 bg-[#101012] overflow-hidden"
          >
            <div className="w-[380px] h-full">
              <SongDetailsPanel 
                song={selectedSong} 
                onClose={closeDetails} 
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
