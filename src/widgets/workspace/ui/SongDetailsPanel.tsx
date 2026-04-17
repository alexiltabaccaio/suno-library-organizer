import React, { useState } from 'react';
import { X, Play, ThumbsUp, MessageSquare, Share, Music, Copy, ThumbsDown, Pencil, Check } from 'lucide-react';
import { Song } from '@/entities/song/model/types';
import { TagBackdrop } from '@/entities/song/ui/TagBackdrop';
import { useEditorStore } from '@/app/store/useEditorStore';
import { useLibraryStore } from '@/app/store/useLibraryStore';
import { useUIStore } from '@/app/store/useUIStore';

interface SongDetailsPanelProps {
  song: Song;
  onClose: () => void;
}

export const SongDetailsPanel: React.FC<SongDetailsPanelProps> = ({ 
  song, 
  onClose 
}) => {
  const { formattingMode } = useEditorStore();
  const { handleToggleLike, handleToggleDislike, handleRenameSong } = useLibraryStore();
  const { viewMode } = useUIStore();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editTitleValue, setEditTitleValue] = useState('');
  
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [editCaptionValue, setEditCaptionValue] = useState('');

  const likeCount = Math.max(0, (song.isLiked ? 1 : 0) - (song.isDisliked ? 1 : 0));

  const startEditTitle = () => {
    setEditTitleValue(song.title);
    setIsEditingTitle(true);
  };

  const saveTitle = () => {
    if (editTitleValue.trim()) {
      handleRenameSong(song.id, editTitleValue, true);
    }
    setIsEditingTitle(false);
  };

  const startEditCaption = () => {
    setEditCaptionValue(song.isRenamed && song.notes ? song.notes : '');
    setIsEditingCaption(true);
  };

  const saveCaption = () => {
    handleRenameSong(song.id, editCaptionValue, false);
    setIsEditingCaption(false);
  };

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
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => handleToggleLike(song.id)}
              className={`flex items-center gap-2 transition-colors ${song.isLiked ? 'text-zinc-100' : 'text-zinc-300 hover:text-white'}`}
            >
              <ThumbsUp className={`w-4 h-4 ${song.isLiked ? 'fill-current' : ''}`} />
            </button>
            <span className="text-sm font-medium text-zinc-300 w-4 text-center">
              {likeCount}
            </span>
            <button 
              onClick={() => handleToggleDislike(song.id)}
              className={`flex items-center gap-2 transition-colors ${song.isDisliked ? 'text-zinc-100' : 'text-zinc-300 hover:text-white'}`}
            >
              <ThumbsDown className={`w-4 h-4 ${song.isDisliked ? 'fill-current' : ''}`} />
            </button>
          </div>

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
          {isEditingTitle ? (
            <div className="flex items-center gap-2 mb-0.5">
              <input
                autoFocus
                value={editTitleValue}
                onChange={(e) => setEditTitleValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveTitle();
                  if (e.key === 'Escape') setIsEditingTitle(false);
                }}
                onFocus={(e) => {
                  e.currentTarget.select();
                  e.currentTarget.setSelectionRange(0, e.currentTarget.value.length, 'backward');
                }}
                className="flex-1 bg-[#0047ab] font-bold text-zinc-100 px-1.5 py-1 rounded-sm outline-none border-b border-white text-xl"
              />
              <button onClick={saveTitle} className="p-1 px-1.5 text-zinc-100 hover:text-white shrink-0">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setIsEditingTitle(false)} className="p-1 text-zinc-500 hover:text-zinc-300 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 mb-0.5 group/title">
              <h2 className="text-xl font-bold text-zinc-100 line-clamp-1 break-all">{song.title}</h2>
              <button 
                onClick={startEditTitle}
                className="opacity-0 group-hover/title:opacity-100 text-zinc-500 hover:text-zinc-300 transition-opacity p-1"
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {song.takeNumber && viewMode !== 'before' && (
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2">
              Take {song.takeNumber}
            </p>
          )}

          {isEditingCaption ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                autoFocus
                placeholder="Add a Caption"
                value={editCaptionValue}
                onChange={(e) => setEditCaptionValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') saveCaption();
                  if (e.key === 'Escape') setIsEditingCaption(false);
                }}
                onFocus={(e) => {
                  e.currentTarget.select();
                  e.currentTarget.setSelectionRange(0, e.currentTarget.value.length, 'backward');
                }}
                className="flex-1 bg-[#0047ab] text-sm text-zinc-100 px-1.5 py-1 rounded-sm outline-none border-b border-white"
              />
              <button onClick={saveCaption} className="p-1 px-1.5 text-zinc-100 hover:text-white shrink-0">
                <Check className="w-4 h-4" />
              </button>
              <button onClick={() => setIsEditingCaption(false)} className="p-1 text-zinc-500 hover:text-zinc-300 shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div 
              className="flex items-center gap-2 group/caption cursor-pointer mt-1"
              onClick={startEditCaption}
            >
              <p className="text-sm text-zinc-500 hover:text-zinc-400 transition-colors line-clamp-2">
                {song.isRenamed && song.notes ? song.notes : 'Add a Caption'}
              </p>
              <button className="opacity-0 group-hover/caption:opacity-100 text-zinc-500 hover:text-zinc-300 transition-opacity p-1">
                <Pencil className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
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
