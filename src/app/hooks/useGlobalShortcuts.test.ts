import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGlobalShortcuts } from './useGlobalShortcuts';
import { useUIStore } from '@/app/store/useUIStore';
import { useLibraryStore } from '@/app/store/useLibraryStore';

vi.mock('@/app/store/useUIStore');
vi.mock('@/app/store/useLibraryStore');

describe('useGlobalShortcuts', () => {
  const mockCloseDetails = vi.fn();
  const mockClearItemSelection = vi.fn();
  const mockClearCheckedSongs = vi.fn();
  const mockHandleDelete = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useUIStore as any).mockReturnValue({
      viewMode: 'v1',
      closeDetails: mockCloseDetails,
      clearItemSelection: mockClearItemSelection,
      clearCheckedSongs: mockClearCheckedSongs,
      checkedSongIds: new Set(),
    });
    (useLibraryStore as any).mockReturnValue({
      handleDelete: mockHandleDelete,
    });
  });

  it('should call store actions when ESC is pressed in v1 mode', () => {
    renderHook(() => useGlobalShortcuts());

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(event);

    expect(mockCloseDetails).toHaveBeenCalled();
    expect(mockClearItemSelection).toHaveBeenCalled();
    expect(mockClearCheckedSongs).toHaveBeenCalled();
  });

  it('should call handleDelete when Delete is pressed with selected items', () => {
    (useUIStore as any).mockReturnValue({
      viewMode: 'v2',
      closeDetails: mockCloseDetails,
      clearItemSelection: mockClearItemSelection,
      clearCheckedSongs: mockClearCheckedSongs,
      checkedSongIds: new Set(['1', '2']),
    });

    renderHook(() => useGlobalShortcuts());

    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    window.dispatchEvent(event);

    expect(mockHandleDelete).toHaveBeenCalledWith(['1', '2']);
  });

  it('should NOT call handleDelete when Delete is pressed but nothing is selected', () => {
    (useUIStore as any).mockReturnValue({
      viewMode: 'v2',
      closeDetails: mockCloseDetails,
      clearItemSelection: mockClearItemSelection,
      clearCheckedSongs: mockClearCheckedSongs,
      checkedSongIds: new Set(),
    });

    renderHook(() => useGlobalShortcuts());

    const event = new KeyboardEvent('keydown', { key: 'Delete' });
    window.dispatchEvent(event);

    expect(mockHandleDelete).not.toHaveBeenCalled();
  });

  it('should NOT trigger shortcuts if an INPUT is focused', () => {
    renderHook(() => useGlobalShortcuts());

    const input = document.createElement('input');
    document.body.appendChild(input);
    input.focus();

    const event = new KeyboardEvent('keydown', { 
      key: 'Delete',
      bubbles: true 
    });
    input.dispatchEvent(event);

    expect(mockHandleDelete).not.toHaveBeenCalled();
    document.body.removeChild(input);
  });

  it('should NOT call store actions when ESC is pressed in before mode', () => {
    (useUIStore as any).mockReturnValue({
      viewMode: 'before',
      closeDetails: mockCloseDetails,
      clearItemSelection: mockClearItemSelection,
      clearCheckedSongs: mockClearCheckedSongs,
    });
    
    renderHook(() => useGlobalShortcuts());

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    window.dispatchEvent(event);

    expect(mockCloseDetails).not.toHaveBeenCalled();
    expect(mockClearItemSelection).not.toHaveBeenCalled();
    expect(mockClearCheckedSongs).not.toHaveBeenCalled();
  });

  it('should not call store actions when other keys are pressed', () => {
    renderHook(() => useGlobalShortcuts());

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    window.dispatchEvent(event);

    expect(mockCloseDetails).not.toHaveBeenCalled();
    expect(mockClearItemSelection).not.toHaveBeenCalled();
    expect(mockClearCheckedSongs).not.toHaveBeenCalled();
  });
});
