import React from 'react';
import { X, Play, ThumbsUp, MessageSquare, Share, Music, Copy } from 'lucide-react';
import { Song } from '../../../entities/song/model/types';
import { TagBackdrop } from '../../../entities/song/ui/TagBackdrop';
import { useEditor } from '../../../features/editor/model/EditorContext';

interface SongDetailsPanelProps {
  song: Song;
  onClose: () => void;
}

export const SongDetailsPanel: React.FC<SongDetailsPanelProps> = ({ 
  song, 
  onClose 
}) => {
  const { formattingMode } = useEditor();
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 flex justify-end shrink-0">
        <button 
          onClick={onClose}
          className="p-2 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Artwork */}
        <div className={`w-full aspect-[3/4] rounded-xl bg-gradient-to-tr ${song.coverColor} shadow-2xl mb-6 relative overflow-hidden`}>
          {/* Decorative sun/grid to simulate the synthwave art */}
          <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-yellow-300 rounded-full blur-[2px]" />
        </div>

        {/* Action Stats */}
        <div className="flex items-center justify-between mb-6 px-2">
          <button className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors">
            <Play className="w-4 h-4 fill-current" />
            <span className="text-sm font-medium">0</span>
          </button>
          <button className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span className="text-sm font-medium">0</span>
          </button>
          <button className="flex items-center gap-2 text-zinc-300 hover:text-white transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-medium">0</span>
          </button>
          <button className="text-zinc-300 hover:text-white transition-colors">
            <Share className="w-4 h-4" />
          </button>
        </div>

        {/* Title & Caption */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-zinc-100 mb-1">{song.title}</h2>
          <p className="text-sm text-zinc-500">Add a Caption</p>
        </div>

        {/* Remix Button */}
        <button className="w-full flex items-center justify-center gap-2 bg-[#19191b] rounded-full py-3.5 text-zinc-500 font-medium mb-6 opacity-40 grayscale pointer-events-none cursor-default">
          <Music className="w-4 h-4" />
          Remix/Edit
        </button>

        {/* Styles Box */}
        <div className="bg-[#19191b] rounded-xl p-4 mb-8 relative group">
          <p className="text-[13px] text-zinc-400 pr-8 leading-relaxed">
            {song.styles}
          </p>
          <button className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <Copy className="w-4 h-4" />
          </button>
        </div>

        {/* Lyrics */}
        <div className="relative group">
          <button className="absolute top-0 right-0 text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <Copy className="w-4 h-4" />
          </button>
          <div className="text-[15px] text-zinc-100 leading-[24px] whitespace-pre-wrap font-sans">
            <TagBackdrop 
              value={song.lyrics} 
              isFocused={false} 
              formattingMode={formattingMode} 
            />
          </div>
        </div>

      </div>
    </div>
  );
};
