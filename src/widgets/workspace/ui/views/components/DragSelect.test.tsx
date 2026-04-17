import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DragSelect } from './DragSelect';
import { useUIStore } from '@/app/store/useUIStore';
import { useLibraryStore } from '@/app/store/useLibraryStore';

// Mock the stores
vi.mock('@/app/store/useUIStore');
vi.mock('@/app/store/useLibraryStore');

describe('DragSelect', () => {
  const mockSetCheckedSongIds = vi.fn();
  const mockContainerRef = {
    current: document.createElement('div')
  };

  const mockSongs = [
    { id: 'song-1', title: 'Song 1', styles: 'Pop', lyrics: 'Lyrics 1' },
    { id: 'song-2', title: 'Song 2', styles: 'Rock', lyrics: 'Lyrics 2' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock UI Store implementation
    (useUIStore as any).mockReturnValue({
      checkedSongIds: new Set(),
      setCheckedSongIds: mockSetCheckedSongIds
    });

    // Mock Library Store implementation
    (useLibraryStore as any).mockReturnValue({
      songs: mockSongs
    });

    // Mock getBoundingClientRect for elements to be zero by default
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      bottom: 0,
      right: 0,
      x: 0,
      y: 0,
      toJSON: () => {}
    } as any));
  });

  it('should render children correctly', () => {
    render(
      <DragSelect containerRef={mockContainerRef as any}>
        <div data-testid="child">Child Element</div>
      </DragSelect>
    );

    expect(screen.getByTestId('child')).toBeDefined();
  });

  it('should start dragging on mouse down', () => {
    const { container } = render(
      <DragSelect containerRef={mockContainerRef as any}>
        <div data-selectable-id="item-1" style={{ width: '50px', height: '50px' }}>Item 1</div>
      </DragSelect>
    );

    const dragContainer = container.firstChild as HTMLElement;
    
    // Mousedown at (0,0)
    fireEvent.mouseDown(dragContainer, { clientX: 0, clientY: 0, button: 0 });
    
    // Mousemove to (10,10) should show the selection box
    fireEvent.mouseMove(window, { clientX: 10, clientY: 10 });

    // The selection box is a div with specific styles
    const selectionBox = dragContainer.querySelector('div[style*="position: absolute"]');
    expect(selectionBox).not.toBeNull();
  });

  it('should select items that overlap with the selection box', () => {
    const mockSetCheckedSongIds = vi.fn();
    (useUIStore as any).mockReturnValue({
      checkedSongIds: new Set(),
      setCheckedSongIds: mockSetCheckedSongIds
    });

    const { container } = render(
      <DragSelect containerRef={mockContainerRef as any}>
        <div 
          data-selectable-id="song-1" 
          style={{ position: 'absolute', left: '20px', top: '20px', width: '10px', height: '10px' }}
          data-testid="item-1"
        >
          Item 1
        </div>
      </DragSelect>
    );

    const dragContainer = container.firstChild as HTMLElement;
    mockContainerRef.current = dragContainer;

    const item = screen.getByTestId('item-1');
    item.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 20, top: 20, width: 10, height: 10,
      bottom: 30, right: 30, x: 20, y: 20, toJSON: () => {}
    });

    dragContainer.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0, top: 0, width: 1000, height: 1000, 
      bottom: 1000, right: 1000, x: 0, y: 0, toJSON: () => {}
    });

    fireEvent.mouseDown(dragContainer, { clientX: 0, clientY: 0, button: 0 });
    fireEvent.mouseMove(window, { clientX: 50, clientY: 50 });

    expect(mockSetCheckedSongIds).toHaveBeenCalled();
    const lastCall = mockSetCheckedSongIds.mock.calls[mockSetCheckedSongIds.mock.calls.length - 1][0];
    expect(lastCall.has('song-1')).toBe(true);

    fireEvent.mouseUp(window);
  });

  it('should not select items outside the box', () => {
    const mockSetCheckedSongIds = vi.fn();
    (useUIStore as any).mockReturnValue({
      checkedSongIds: new Set(),
      setCheckedSongIds: mockSetCheckedSongIds
    });

    const { container } = render(
      <DragSelect containerRef={mockContainerRef as any}>
        <div 
          data-selectable-id="song-out" 
          style={{ position: 'absolute', left: '100px', top: '100px', width: '10px', height: '10px' }}
          data-testid="item-out"
        >
          Item Out
        </div>
      </DragSelect>
    );

    const dragContainer = container.firstChild as HTMLElement;
    mockContainerRef.current = dragContainer;

    const item = screen.getByTestId('item-out');
    item.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 100, top: 100, width: 10, height: 10,
      bottom: 110, right: 110, x: 100, y: 100, toJSON: () => {}
    });

    dragContainer.getBoundingClientRect = vi.fn().mockReturnValue({
      left: 0, top: 0, width: 1000, height: 1000, 
      bottom: 1000, right: 1000, x: 0, y: 0, toJSON: () => {}
    });

    fireEvent.mouseDown(dragContainer, { clientX: 0, clientY: 0, button: 0 });
    fireEvent.mouseMove(window, { clientX: 50, clientY: 50 });

    expect(mockSetCheckedSongIds).toHaveBeenCalled();
    const lastCall = mockSetCheckedSongIds.mock.calls[mockSetCheckedSongIds.mock.calls.length - 1][0];
    expect(lastCall.has('song-out')).toBe(false);

    fireEvent.mouseUp(window);
  });
});
