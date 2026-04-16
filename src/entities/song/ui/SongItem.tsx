import React from 'react';
import { SongItemProps } from './types';
import { SongGroupHeader } from './components/SongGroupHeader';
import { SongListItem } from './components/SongListItem';

export const SongItem: React.FC<SongItemProps> = (props) => {
  if (props.isGroupHeader) {
    return <SongGroupHeader {...props} />;
  }
  return <SongListItem {...props} />;
};
