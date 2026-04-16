import React from 'react';

export interface SongItemProps {
  id: string;
  title: string;
  styles: string;
  lyrics: string;
  duration: string;
  version: string;
  coverColor: string;
  notes?: string;
  isRenamed?: boolean;
  takeNumber?: number;
  isChecked?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  onCheck?: (e: React.MouseEvent) => void;
  onRename?: (newTitle: string) => void;
  isGroupHeader?: boolean;
  groupCount?: number;
  isExpanded?: boolean;
  onToggleExpand?: (e: React.MouseEvent) => void;
  isChild?: boolean;
  isFavorite?: boolean;
  onSetFavorite?: (e: React.MouseEvent) => void;
  isLiked?: boolean;
  isDisliked?: boolean;
  isPinned?: boolean;
  createdAt?: Date;
  subPage?: number;
  totalSubPages?: number;
  onSubPageChange?: (page: number) => void;
  onQuickGenerate?: (e: React.MouseEvent) => void;
}
