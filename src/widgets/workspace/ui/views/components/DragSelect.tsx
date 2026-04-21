import React from 'react';
import { useDragSelect } from '@/widgets/workspace/hooks/useDragSelect';

interface DragSelectProps {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement>;
}

export const DragSelect: React.FC<DragSelectProps> = ({ children, containerRef }) => {
  const {
    isDragging,
    startPos,
    currentPos,
    handleMouseDown,
    handleClickCapture
  } = useDragSelect(containerRef);

  const boxStyle: React.CSSProperties = {
    position: 'absolute',
    left: Math.min(startPos.x, currentPos.x),
    top: Math.min(startPos.y, currentPos.y),
    width: Math.abs(startPos.x - currentPos.x),
    height: Math.abs(startPos.y - currentPos.y),
    backgroundColor: 'rgba(59, 130, 246, 0.2)',
    border: '1px solid rgba(59, 130, 246, 0.5)',
    borderRadius: '2px',
    pointerEvents: 'none',
    zIndex: 100,
  };

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onClickCapture={handleClickCapture}
      className={`relative w-full flex-1 min-h-full select-none ${isDragging ? 'cursor-crosshair' : ''}`}
    >
      {children}
      {isDragging && <div style={boxStyle} />}
    </div>
  );
};
