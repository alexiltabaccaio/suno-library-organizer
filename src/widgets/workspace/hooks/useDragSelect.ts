import React, { useState, useEffect, useCallback, RefObject } from 'react';
import { useUIStore } from '@/app/store/useUIStore';
import { useLibraryStore } from '@/app/store/useLibraryStore';

interface Position {
  x: number;
  y: number;
}

export const useDragSelect = (containerRef: RefObject<HTMLDivElement>) => {
  const { checkedSongIds, setCheckedSongIds } = useUIStore();
  const { songs } = useLibraryStore();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOccurred, setDragOccurred] = useState(false);
  const [startPos, setStartPos] = useState<Position>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<Position>({ x: 0, y: 0 });
  const [initialSelection, setInitialSelection] = useState<Set<string>>(new Set());

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    // Only left click
    if (e.button !== 0) return;

    // Don't start drag if clicking on a button, input, or other interactive element
    const target = e.target as HTMLElement;
    if (target.closest('button, input, a, [role="button"]')) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setIsDragging(true);
    setDragOccurred(false);
    setInitialSelection(new Set(checkedSongIds));
    
    const x = e.clientX - rect.left + (containerRef.current?.scrollLeft || 0);
    const y = e.clientY - rect.top + (containerRef.current?.scrollTop || 0);
    setStartPos({ x, y });
    setCurrentPos({ x, y });
  }, [containerRef, checkedSongIds]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left + (containerRef.current.scrollLeft || 0);
    const y = e.clientY - rect.top + (containerRef.current.scrollTop || 0);
    
    if (Math.abs(x - startPos.x) > 5 || Math.abs(y - startPos.y) > 5) {
      setDragOccurred(true);
    }
    
    setCurrentPos({ x, y });

    // Real-time selection calculation
    const left = Math.min(startPos.x, x);
    const top = Math.min(startPos.y, y);
    const width = Math.abs(startPos.x - x);
    const height = Math.abs(startPos.y - y);

    const selectableElements = containerRef.current.querySelectorAll('[data-selectable-id]');
    
    const itemsInBox = new Set<string>();
    selectableElements.forEach((el) => {
      const htmlEl = el as HTMLElement;
      const id = htmlEl.getAttribute('data-selectable-id');
      if (!id) return;

      const elRect = htmlEl.getBoundingClientRect();
      const relativeElRect = {
        left: elRect.left - rect.left + (containerRef.current?.scrollLeft || 0),
        top: elRect.top - rect.top + (containerRef.current?.scrollTop || 0),
        width: elRect.width,
        height: elRect.height
      };

      if (
        relativeElRect.left < left + width &&
        relativeElRect.left + relativeElRect.width > left &&
        relativeElRect.top < top + height &&
        relativeElRect.top + relativeElRect.height > top
      ) {
        itemsInBox.add(id);
        // If it's a group key, also add all its songs
        if (id.includes('|')) {
          const groupSongs = songs.filter(s => `${s.title}|${s.styles}|${s.lyrics}` === id);
          groupSongs.forEach(s => itemsInBox.add(s.id));
        }
      }
    });

    // Apply selection logic
    const nextSelection = new Set<string>(initialSelection);
    const isCtrlPressed = e.ctrlKey || e.metaKey;

    if (isCtrlPressed) {
      // XOR logic: toggle selection
      itemsInBox.forEach(id => {
        if (nextSelection.has(id)) {
          nextSelection.delete(id);
          const song = songs.find(s => s.id === id);
          if (song) {
            const groupKey = `${song.title}|${song.styles}|${song.lyrics}`;
            nextSelection.delete(groupKey);
          }
        } else {
          nextSelection.add(id);
        }
      });
    } else {
      // OR logic: only add to selection
      itemsInBox.forEach(id => {
        nextSelection.add(id);
      });
    }
    
    setCheckedSongIds(nextSelection);
  }, [isDragging, startPos, initialSelection, songs, containerRef, setCheckedSongIds]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleClickCapture = useCallback((e: React.MouseEvent) => {
    if (dragOccurred) {
      e.stopPropagation();
      e.preventDefault();
      setDragOccurred(false);
    }
  }, [dragOccurred]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return {
    isDragging,
    startPos,
    currentPos,
    handleMouseDown,
    handleClickCapture
  };
};
