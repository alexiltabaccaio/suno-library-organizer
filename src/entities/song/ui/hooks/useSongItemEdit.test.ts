import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useSongItemEdit } from './useSongItemEdit';

describe('useSongItemEdit', () => {
  const mockOnRename = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useSongItemEdit('Old Title', mockOnRename));
    
    expect(result.current.isEditing).toBe(false);
    expect(result.current.editTitle).toBe('Old Title');
  });

  it('should start editing and update title correctly', () => {
    const { result } = renderHook(() => useSongItemEdit('Old Title', mockOnRename));
    
    const mockEvent = { stopPropagation: vi.fn() };
    
    act(() => {
      result.current.handleStartEdit(mockEvent as any);
    });

    expect(result.current.isEditing).toBe(true);
    expect(mockEvent.stopPropagation).toHaveBeenCalled();

    act(() => {
      result.current.setEditTitle('New Awesome Title');
    });

    expect(result.current.editTitle).toBe('New Awesome Title');
  });

  it('should reset title and stop editing on cancel', () => {
    const { result } = renderHook(() => useSongItemEdit('Old Title', mockOnRename));
    
    act(() => {
      // Start
      result.current.handleStartEdit({ stopPropagation: vi.fn() } as any);
      // Type something
      result.current.setEditTitle('Oops mistake');
      // Cancel
      result.current.handleCancelEdit({ stopPropagation: vi.fn() } as any);
    });

    expect(result.current.isEditing).toBe(false);
    expect(result.current.editTitle).toBe('Old Title'); // Reverted back
    expect(mockOnRename).not.toHaveBeenCalled();
  });

  it('should call onRename (with trim) and stop editing on confirm if title changed', () => {
    const { result } = renderHook(() => useSongItemEdit('Old Title', mockOnRename));
    
    act(() => {
      result.current.handleStartEdit({ stopPropagation: vi.fn() } as any);
    });
    
    act(() => {
      result.current.setEditTitle('  Confirmed Title  ');
    });

    act(() => {
      result.current.handleConfirmEdit({ stopPropagation: vi.fn() } as any);
    });

    expect(result.current.isEditing).toBe(false);
    expect(mockOnRename).toHaveBeenCalledWith('Confirmed Title');
  });

  it('should NOT call onRename but stop editing if title is unchanged after trimming', () => {
    const { result } = renderHook(() => useSongItemEdit('Old Title', mockOnRename));
    
    act(() => {
      result.current.handleStartEdit({ stopPropagation: vi.fn() } as any);
    });
    
    act(() => {
      result.current.setEditTitle('   Old Title   '); // Kept same
    });

    act(() => {
      result.current.handleConfirmEdit({ stopPropagation: vi.fn() } as any);
    });

    expect(result.current.isEditing).toBe(false);
    expect(mockOnRename).not.toHaveBeenCalled();
  });

  it('should handle edge cases like empty string directly setting empty but still calling rename', () => {
    const { result } = renderHook(() => useSongItemEdit('Old Title', mockOnRename));
    
    act(() => {
      result.current.handleStartEdit({ stopPropagation: vi.fn() } as any);
    });

    act(() => {
      result.current.setEditTitle(''); 
    });

    act(() => {
      result.current.handleConfirmEdit({ stopPropagation: vi.fn() } as any);
    });

    expect(result.current.isEditing).toBe(false);
    expect(mockOnRename).toHaveBeenCalledWith('');
  });
});
