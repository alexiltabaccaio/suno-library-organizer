import React from 'react';
import { SongItem } from '../../../../entities/song/ui/SongItem';
import { Song } from '../../../../entities/song/model/types';

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
          createdAt={song.createdAt}
          onCheck={() => toggleCheck(song.id)}
          onClick={(e) => {
            if (e.ctrlKey || e.metaKey) {
              toggleCheck(song.id);
            } else {
              handleSelectItem(song.id, song.id, e.shiftKey, false, visibleIds);
            }
          }}
          onRename={(newTitle) => handleRenameSong(song.id, newTitle, true)}
        />
      ))}
    </>
  );
};
