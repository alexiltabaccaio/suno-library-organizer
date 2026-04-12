import React from 'react';
import { SongItem } from '../SongItem';
import { Song } from '../../../lib/types';

interface BeforeViewProps {
  songs: Song[];
  songsWithTakeNumbers: Map<string, number>;
  visibleIds: string[];
  toggleCheck: (id: string) => void;
  handleSelectItem: (itemId: string, songId: string, shiftKey?: boolean, ctrlKey?: boolean, visibleIds?: string[]) => void;
  handleRenameSong: (id: string, newTitle: string, isTitleRename?: boolean) => void;
}

export const BeforeView: React.FC<BeforeViewProps> = ({
  songs,
  songsWithTakeNumbers,
  visibleIds,
  toggleCheck,
  handleSelectItem,
  handleRenameSong
}) => {
  return (
    <>
      {songs.map(song => (
        <SongItem 
          key={song.id}
          id={song.id}
          title={song.title}
          styles={song.styles}
          duration={song.duration}
          version={song.version}
          coverColor={song.coverColor}
          isLiked={song.isLiked}
          isDisliked={song.isDisliked}
          isPinned={song.isPinned}
          takeNumber={songsWithTakeNumbers.get(song.id)}
          createdAt={song.createdAt}
          onCheck={() => toggleCheck(song.id)}
          onClick={(e) => handleSelectItem(song.id, song.id, e.shiftKey, e.ctrlKey || e.metaKey, visibleIds)}
          onRename={(newTitle) => handleRenameSong(song.id, newTitle, true)}
        />
      ))}
    </>
  );
};
