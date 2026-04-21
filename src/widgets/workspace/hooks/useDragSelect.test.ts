import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useDragSelect } from './useDragSelect';
import { useUIStore } from '@/app/store/useUIStore';
import { useLibraryStore } from '@/app/store/useLibraryStore';

vi.mock('@/app/store/useUIStore');
vi.mock('@/app/store/useLibraryStore');

describe('useDragSelect', () => {
  const mockSetCheckedSongIds = vi.fn();
  const mockContainerRef = {
    current: document.createElement('div') as HTMLDivElement,
  };

  const mockSongs = [
    { id: 'song-1', title: 'A', styles: 'B', lyrics: 'C' },
    { id: 'song-2', title: 'A', styles: 'B', lyrics: 'C' }, // Same group as song-1
  ];

  beforeEach(() => {
    vi.clearAllMocks();

    (useUIStore as any).mockReturnValue({
      checkedSongIds: new Set(['existing-song']),
      setCheckedSongIds: mockSetCheckedSongIds,
    });

    (useLibraryStore as any).mockReturnValue({
      songs: mockSongs,
    });
    
    // Default rect for the container
    mockContainerRef.current.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0, top: 0, width: 1000, height: 1000,
    });
  });

  it('should initialize correctly', () => {
    const { result } = renderHook(() => useDragSelect(mockContainerRef as any));
    
    expect(result.current.isDragging).toBe(false);
    expect(result.current.startPos).toEqual({ x: 0, y: 0 });
  });

  it('should ignore non-left clicks and interactive elements (buttons)', () => {
    const { result } = renderHook(() => useDragSelect(mockContainerRef as any));
    
    // Right click (button: 2)
    act(() => {
      result.current.handleMouseDown({ button: 2 } as any);
    });
    expect(result.current.isDragging).toBe(false);

    // Clicking a button
    const mockButtonEvent = {
      button: 0,
      target: { closest: (selector: string) => selector === 'button, input, a, [role="button"]' }
    };
    act(() => {
      result.current.handleMouseDown(mockButtonEvent as any);
    });
    expect(result.current.isDragging).toBe(false);
  });

  it('should start dragging on valid mousedown', () => {
    const { result } = renderHook(() => useDragSelect(mockContainerRef as any));
    
    const mockEvent = {
      button: 0,
      clientX: 50,
      clientY: 100,
      target: { closest: () => null }
    };

    act(() => {
      result.current.handleMouseDown(mockEvent as any);
    });

    expect(result.current.isDragging).toBe(true);
    expect(result.current.startPos).toEqual({ x: 50, y: 100 });
  });

  it('should capture click to prevent propagation if a drag occurred', () => {
    const { result } = renderHook(() => useDragSelect(mockContainerRef as any));
    
    // Simulate mouse down
    act(() => {
      result.current.handleMouseDown({
        button: 0,
        clientX: 0,
        clientY: 0,
        target: { closest: () => null }
      } as any);
    });

    // Simulate mouse move to trigger dragOccurred
    const moveEvent = new MouseEvent('mousemove', { clientX: 200, clientY: 200 });
    act(() => {
      window.dispatchEvent(moveEvent);
    });

    // Now trigger click capture
    const mockClickEvent = {
      stopPropagation: vi.fn(),
      preventDefault: vi.fn()
    };
    
    act(() => {
      result.current.handleClickCapture(mockClickEvent as any);
    });

    expect(mockClickEvent.stopPropagation).toHaveBeenCalled();
    expect(mockClickEvent.preventDefault).toHaveBeenCalled();
  });
});
