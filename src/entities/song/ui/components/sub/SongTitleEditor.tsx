import React from 'react';
import { Check, X } from 'lucide-react';

interface SongTitleEditorProps {
  editTitle: string;
  setEditTitle: (title: string) => void;
  onConfirm: (e: React.MouseEvent | React.KeyboardEvent) => void;
  onCancel: (e: React.MouseEvent | React.KeyboardEvent) => void;
}

export const SongTitleEditor: React.FC<SongTitleEditorProps> = ({
  editTitle,
  setEditTitle,
  onConfirm,
  onCancel
}) => {
  return (
    <div className="flex items-center gap-1">
      <input
        type="text"
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onConfirm(e);
          if (e.key === 'Escape') onCancel(e);
        }}
        autoFocus
        onFocus={(e) => {
          e.currentTarget.select();
          e.currentTarget.setSelectionRange(0, e.currentTarget.value.length, 'backward');
        }}
        className="bg-[#0047ab] font-bold text-zinc-100 px-1.5 py-1 rounded-sm outline-none border-b border-white text-[15px] sm:text-[16px] w-[220px] sm:w-[250px]"
        placeholder="Enter title..."
      />
      <button 
        onClick={onConfirm}
        className="p-1.5 text-zinc-100 hover:text-white transition-colors shrink-0"
      >
        <Check className="w-4 h-4" />
      </button>
      <button 
        onClick={onCancel}
        className="p-1.5 text-zinc-500 hover:text-zinc-300 transition-colors shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
