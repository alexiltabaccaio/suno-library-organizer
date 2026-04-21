import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Type, Highlighter, Palette } from 'lucide-react';

interface WorkspaceFooterProps {
  hasSelectedSong: boolean;
  formattingMode: 'none' | 'simple' | 'colored';
  setFormattingMode: (mode: 'none' | 'simple' | 'colored') => void;
  viewMode: 'before' | 'v1' | 'v2';
  setViewMode: (mode: 'before' | 'v1' | 'v2') => void;
}

export const WorkspaceFooter: React.FC<WorkspaceFooterProps> = ({
  hasSelectedSong,
  formattingMode,
  setFormattingMode,
  viewMode,
  setViewMode
}) => {
  return (
    <motion.div 
      initial={false}
      animate={{ paddingRight: hasSelectedSong ? 24 : 404 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="hidden md:grid grid-cols-1 lg:grid-cols-3 items-center px-6 py-8 border-t border-zinc-800/50 bg-[#101012] gap-8 overflow-hidden"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Smart Lyrics Editor Badge - Left Aligned */}
      <div className="flex flex-col items-center lg:items-start gap-2 order-1">
        <a 
          href="https://github.com/alexiltabaccaio/suno-flow-editor"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer group"
        >
          <Sparkles className="w-3.5 h-3.5 text-pink-500/50 group-hover:text-pink-400 transition-colors" />
          <span className="text-[11px] font-medium tracking-widest uppercase">
            Smart Lyrics Editor
          </span>
        </a>
        
        <div className="flex items-center bg-zinc-900/50 rounded-lg p-0.5 border border-zinc-800/50">
          <button
            onClick={() => setFormattingMode('none')}
            className={`p-1 rounded-md transition-all ${formattingMode === 'none' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
            title="Plain text"
          >
            <Type className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setFormattingMode('simple')}
            className={`p-1 rounded-md transition-all ${formattingMode === 'simple' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
            title="B&W Formatting"
          >
            <Highlighter className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setFormattingMode('colored')}
            className={`p-1 rounded-md transition-all ${formattingMode === 'colored' ? 'bg-cyan-500/20 text-cyan-400 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
            title="Color formatting"
          >
            <Palette className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Center Content */}
      <div className="flex flex-col items-center gap-4 order-2">
        <h2 className="text-zinc-400 text-lg font-semibold tracking-tight uppercase opacity-50">
          Suno Library Organizer
        </h2>
        
        <div className="flex items-center bg-[#19191b] rounded-full p-1 border border-zinc-800/50">
          <button 
            onClick={() => setViewMode('before')}
            className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${
              viewMode === 'before' 
                ? 'bg-zinc-100 text-black shadow-lg' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Before
          </button>
          <div className="flex items-center ml-1 bg-zinc-800/30 rounded-full p-0.5">
            <button 
              onClick={() => setViewMode('v1')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                viewMode === 'v1' 
                  ? 'bg-zinc-100 text-black shadow-md' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              V1
            </button>
            <button 
              onClick={() => setViewMode('v2')}
              className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                viewMode === 'v2' 
                  ? 'bg-zinc-100 text-black shadow-md' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              V2
            </button>
          </div>
        </div>

        <p className="text-[10px] text-zinc-600 font-medium tracking-tight">
          Prototype developed by{' '}
          <a 
            href="https://www.linkedin.com/in/alexgiustizieri/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
          >
            Alex Giustizieri
          </a>
        </p>
      </div>

      {/* Right Spacer for centering */}
      <div className="hidden lg:block order-3"></div>
    </motion.div>
  );
};
