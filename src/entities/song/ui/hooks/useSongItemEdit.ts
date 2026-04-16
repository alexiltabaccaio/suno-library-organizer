import React, { useState } from 'react';

export const useSongItemEdit = (initialValue: string, onRename?: (newTitle: string) => void) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(initialValue);

  const handleStartEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
    setEditTitle(initialValue);
  };

  const handleConfirmEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim() !== initialValue) {
      onRename?.(editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleCancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(false);
    setEditTitle(initialValue);
  };

  return {
    isEditing,
    editTitle,
    setEditTitle,
    handleStartEdit,
    handleConfirmEdit,
    handleCancelEdit
  };
};
