import React from 'react';
import { Music, X, Type, Highlighter, Palette } from 'lucide-react';
import { CreateButton } from './CreateButton';
import { WorkspaceArea } from '../workspace/WorkspaceArea';
import { SongDetailsPanel } from '../workspace/SongDetailsPanel';
import { EditorPanel } from '../editor/EditorPanel';
import { useEditor } from '../../contexts/EditorContext';
import { useUI } from '../../contexts/UIContext';

export const MobileLayout: React.FC = () => {
  const { 
    lyrics, styles, formattingMode, setFormattingMode
  } = useEditor();
  
  const { 
    selectedSong, isMobileEditorOpen, setIsMobileEditorOpen, 
    handleCreate, closeDetails, viewMode, setViewMode
  } = useUI();

  return (
    <div className="h-screen w-full bg-[#101012] text-zinc-100 flex font-sans overflow-hidden relative">
      {/* Editor Panel (Slide up) */}
      <div className={`
        fixed inset-0 z-50 bg-[#101012] flex flex-col transition-transform duration-300
        ${isMobileEditorOpen ? 'translate-y-0' : 'translate-y-full'}
      `}>
        <div className="flex items-center justify-between p-4 border-b border-zinc-800/50">
          <span className="font-semibold">Create</span>
          <button onClick={() => setIsMobileEditorOpen(false)} className="p-2 bg-zinc-800/50 rounded-full text-zinc-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <EditorPanel />

        <CreateButton 
          isActive={lyrics.trim().length > 0 || styles.trim().length > 0} 
          onClick={handleCreate}
        />
      </div>

      {/* Workspace Area */}
      <div className="flex-1 w-full h-full pb-24 overflow-hidden flex flex-col">
        <WorkspaceArea />
      </div>

      {/* Details Panel (Slide in) */}
      {selectedSong && (
        <div className="fixed inset-0 z-40 bg-[#101012]">
          <SongDetailsPanel 
            song={selectedSong} 
            formattingMode={formattingMode}
            setFormattingMode={setFormattingMode}
            onClose={closeDetails} 
          />
        </div>
      )}

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#141417] border-t border-zinc-800/50 z-30 px-4 pt-3 pb-2">
        <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
          {/* Left: Library Organizer */}
          <div className="flex flex-col items-center gap-2 pb-1">
            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider leading-none">
              Library Organizer
            </span>
            <div className="flex items-center bg-zinc-900/80 rounded-full p-0.5 border border-zinc-800/50">
              <button 
                onClick={() => setViewMode('before')}
                className={`px-3 py-1.5 rounded-full text-[9px] font-bold transition-all ${
                  viewMode === 'before' 
                    ? 'bg-zinc-100 text-black' 
                    : 'text-zinc-500'
                }`}
              >
                Before
              </button>
              <div className="flex items-center ml-0.5 bg-zinc-800/30 rounded-full p-0.5">
                <button 
                  onClick={() => setViewMode('v1')}
                  className={`px-2.5 py-1 rounded-full text-[8px] font-black transition-all ${
                    viewMode === 'v1' 
                      ? 'bg-zinc-100 text-black' 
                      : 'text-zinc-500'
                  }`}
                >
                  V1
                </button>
                <button 
                  onClick={() => setViewMode('v2')}
                  className={`px-2.5 py-1 rounded-full text-[8px] font-black transition-all ${
                    viewMode === 'v2' 
                      ? 'bg-zinc-100 text-black' 
                      : 'text-zinc-500'
                  }`}
                >
                  V2
                </button>
              </div>
            </div>
            {/* Spacer to match credit height on the right */}
            <div className="h-[10px]" />
          </div>

          {/* Center: Create Button */}
          <div className="flex justify-center pb-4">
            <button 
              onClick={() => setIsMobileEditorOpen(true)}
              className="w-14 h-14 bg-[#ff4d6d] hover:bg-[#ff3b3b] rounded-full flex items-center justify-center border-4 border-[#101012] transition-transform active:scale-95 shadow-lg"
            >
              <Music className="w-6 h-6 text-white" />
            </button>
          </div>

          {/* Right: Smart Lyrics Editor & Credit */}
          <div className="flex flex-col items-center gap-2 pb-1">
            <a 
              href="https://github.com/alexiltabaccaio/suno-flow-editor"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[9px] font-bold text-zinc-500 hover:text-zinc-300 transition-colors uppercase tracking-wider leading-none"
            >
              Smart Lyrics Editor
            </a>
            <div className="flex items-center bg-zinc-900/80 rounded-lg p-0.5 border border-zinc-800/50">
              <button
                onClick={() => setFormattingMode('none')}
                className={`p-1.5 rounded-md transition-all ${formattingMode === 'none' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-600'}`}
              >
                <Type className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFormattingMode('simple')}
                className={`p-1.5 rounded-md transition-all ${formattingMode === 'simple' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-600'}`}
              >
                <Highlighter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setFormattingMode('colored')}
                className={`p-1.5 rounded-md transition-all ${formattingMode === 'colored' ? 'bg-cyan-500/20 text-cyan-400' : 'text-zinc-600'}`}
              >
                <Palette className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[9px] text-zinc-600 font-medium leading-none">
              Sviluppato da{' '}
              <a 
                href="https://www.linkedin.com/in/alexgiustizieri/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-white transition-colors"
              >
                Alex Giustizieri
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
