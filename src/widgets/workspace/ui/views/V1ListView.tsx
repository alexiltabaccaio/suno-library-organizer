import React from 'react';
import { SongItem } from '../../../../entities/song/ui/SongItem';
import { SongGroup } from '../../../../features/library/hooks/useSongGrouping';
import { V1GroupRow } from './components/V1GroupRow';
import { useUI } from '../../../../features/ui/model/UIContext';
import { useLibrary } from '../../../../features/library/model/LibraryContext';

interface V1ListViewProps {
  groupedSongs: SongGroup[];
  songsWithTakeNumbers: Map<string, number>;
  visibleIds: string[];
  expandedGroups: Set<string>;
  toggleGroup: (e: React.MouseEvent, key: string) => void;
}

export const V1ListView: React.FC<V1ListViewProps> = ({
  groupedSongs,
  songsWithTakeNumbers,
  visibleIds,
  expandedGroups,
  toggleGroup
}) => {
  const { toggleCheck, handleSelectItem, handleQuickGenerate } = useUI();
  const { handleRenameSong } = useLibrary();

  return (
    <>
      {groupedSongs.map(group => {
        if (group.songs.length === 1) {
          const song = group.songs[0];
          return (
            <SongItem 
              key={song.id}
              id={song.id}
              title={song.title}
              styles={song.styles}
              lyrics={song.lyrics}
              duration={song.duration}
              version={song.version}
              coverColor={song.coverColor}
              isLiked={song.isLiked}
              isDisliked={song.isDisliked}
              isPinned={song.isPinned}
              takeNumber={songsWithTakeNumbers.get(song.id)}
              onCheck={() => toggleCheck(song.id)}
              onClick={(e) => {
                if (e.ctrlKey || e.metaKey) {
                  toggleCheck(song.id);
                } else {
                  handleSelectItem(song.id, song.id, e.shiftKey, false, visibleIds);
                }
              }}
              onRename={(newTitle) => handleRenameSong(song.id, newTitle, true)}
              onQuickGenerate={(e) => {
                e.stopPropagation();
                handleQuickGenerate(song);
              }}
            />
          );
        }

        const isExpanded = expandedGroups.has(group.key);

        return (
          <V1GroupRow 
            key={group.key}
            group={group}
            songsWithTakeNumbers={songsWithTakeNumbers}
            visibleIds={visibleIds}
            isExpanded={isExpanded}
            toggleGroup={toggleGroup}
          />
        );
      })}
    </>
  );
};
