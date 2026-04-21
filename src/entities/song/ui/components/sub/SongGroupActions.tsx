import React from 'react';
import { ThumbsUp, ThumbsDown, Pin, Share, Plus } from 'lucide-react';

interface SongGroupActionsProps {
  id: string;
  isLiked?: boolean;
  isDisliked?: boolean;
  isPinned?: boolean;
  onToggleLike: (id: string) => void;
  onToggleDislike: (id: string) => void;
  onTogglePin: (id: string) => void;
  onQuickGenerate?: (e: React.MouseEvent) => void;
}

export const SongGroupActions: React.FC<SongGroupActionsProps> = ({
  id,
  isLiked,
  isDisliked,
  isPinned,
  onToggleLike,
  onToggleDislike,
  onTogglePin,
  onQuickGenerate
}) => {
  return (
    <div className="flex items-center gap-4 h-8" onClick={(e) => e.stopPropagation()}>
      {onQuickGenerate && (
        <button 
          onClick={onQuickGenerate}
          className="text-zinc-600 hover:text-zinc-300 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      )}
      <button 
        onClick={() => onToggleLike(id)}
        className={`transition-colors ${isLiked ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
      >
        <ThumbsUp className="w-4 h-4" fill={isLiked ? "currentColor" : "none"} />
      </button>
      <button 
        onClick={() => onToggleDislike(id)}
        className={`transition-colors ${isDisliked ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
      >
        <ThumbsDown className="w-4 h-4" fill={isDisliked ? "currentColor" : "none"} />
      </button>
      <button 
        onClick={() => onTogglePin(id)}
        className={`transition-colors ${isPinned ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
      >
        <Pin className="w-4 h-4" fill={isPinned ? "currentColor" : "none"} />
      </button>
      <button className="text-zinc-600 hover:text-zinc-300 transition-colors">
        <Share className="w-4 h-4" />
      </button>
    </div>
  );
};
