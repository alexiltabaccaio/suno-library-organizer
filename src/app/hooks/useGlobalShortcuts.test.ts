import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useGlobalShortcuts } from './useGlobalShortcuts';
import { useUIStore } from '@/app/store/useUIStore';

vi.mock('@/app/store/useUIStore');

describe('useGlobalShortcuts', () => {
  const mockCloseDetails = vi.fn();
  const mockClearItemSelection = vi.fn();
  const mockClearCheckedSongs = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useUIStore as any).mockReturnValue({
      viewMode: 'v1',
      closeDetails: mockCloseDetails,
      clearItemSelection: mockClearItemSelection,
      clearCheckedSongs: mockClearCheckedSongs,
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
