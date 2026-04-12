import React, { useEffect, useRef } from 'react';
import { ListMusic, Plus, ArrowRightLeft, Trash2 } from 'lucide-react';

interface SongContextMenuProps {
  onClose: () => void;
  onDelete: () => void;
  onDeleteExcludeFavorite?: () => void;
  anchorRect?: DOMRect | null;
  position?: { x: number; y: number } | null;
}

export const SongContextMenu: React.FC<SongContextMenuProps> = ({ 
  onClose, onDelete, onDeleteExcludeFavorite, anchorRect, position 
}) => {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!anchorRect && !position) return null;

  // Calculate position
  let top = 0;
  let left: number | undefined = undefined;
  let right: number | undefined = undefined;

  if (position) {
    top = position.y;
    left = position.x;
    
    // Adjust if menu goes off screen
    if (left + 256 > window.innerWidth) {
      left = undefined;
      right = window.innerWidth - position.x;
    }
  } else if (anchorRect) {
    top = anchorRect.bottom + 8;
    right = window.innerWidth - anchorRect.right;
  }

  return (
    <div 
      ref={menuRef}
      style={{ 
        top: `${top}px`, 
        left: left !== undefined ? `${left}px` : 'auto',
        right: right !== undefined ? `${right}px` : 'auto'
      }}
      className="fixed z-[100] w-64 bg-[#1e1e22] border border-zinc-800/50 rounded-xl shadow-sm py-1.5 overflow-hidden animate-in fade-in zoom-in duration-100"
    >
      <button 
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
          onClose();
        }}
        className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-zinc-800/50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <Trash2 className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
          <span className="text-[13px] font-medium text-zinc-300 group-hover:text-red-400">Move to Trash</span>
        </div>
      </button>

      {onDeleteExcludeFavorite && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onDeleteExcludeFavorite();
            onClose();
          }}
          className="w-full flex items-center justify-between px-3 py-2.5 hover:bg-zinc-800/50 transition-colors group border-t border-zinc-800/30"
        >
          <div className="flex items-center gap-3">
            <Trash2 className="w-4 h-4 text-zinc-400 group-hover:text-red-400" />
            <span className="text-[13px] font-medium text-zinc-300 group-hover:text-red-400">Move to Trash (excluding favorite)</span>
          </div>
        </button>
      )}
    </div>
  );
};
