import React from 'react';
import { SongItem } from '../SongItem';
import { Song } from '../../../lib/types';
import { SongGroup } from '../../../hooks/useSongGrouping';

interface V1ListViewProps {
  groupedSongs: SongGroup[];
  songsWithTakeNumbers: Map<string, number>;
  checkedSongIds: Set<string>;
  visibleIds: string[];
  expandedGroups: Set<string>;
  groupFavorites: Record<string, string>;
  toggleCheck: (id: string) => void;
  toggleGroupCheck: (songsInGroup: Song[]) => void;
  handleSelectItem: (itemId: string, songId: string, shiftKey?: boolean, ctrlKey?: boolean, visibleIds?: string[]) => void;
  handleRenameSong: (id: string, newTitle: string, isTitleRename?: boolean) => void;
  handleSetFavorite: (groupKey: string, songId: string) => void;
  toggleGroup: (e: React.MouseEvent, key: string) => void;
}

export const V1ListView: React.FC<V1ListViewProps> = ({
  groupedSongs,
  songsWithTakeNumbers,
  checkedSongIds,
  visibleIds,
  expandedGroups,
  groupFavorites,
  toggleCheck,
  toggleGroupCheck,
  handleSelectItem,
  handleRenameSong,
  handleSetFavorite,
  toggleGroup
}) => {
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
              duration={song.duration}
              version={song.version}
              coverColor={song.coverColor}
              isLiked={song.isLiked}
              isDisliked={song.isDisliked}
              isPinned={song.isPinned}
              takeNumber={songsWithTakeNumbers.get(song.id)}
              onCheck={() => toggleCheck(song.id)}
              onClick={(e) => handleSelectItem(song.id, song.id, e.shiftKey, e.ctrlKey || e.metaKey, visibleIds)}
              onRename={(newTitle) => handleRenameSong(song.id, newTitle, true)}
            />
          );
        }

        const isExpanded = expandedGroups.has(group.key);
        const favoriteId = groupFavorites[group.key] || group.songs[0].id;
        const favoriteSong = group.songs.find(s => s.id === favoriteId) || group.songs[0];
        const allGroupSongsChecked = group.songs.every(s => checkedSongIds.has(s.id));

        return (
          <div key={group.key} className="space-y-1">
            <SongItem 
              id={group.key}
              title={favoriteSong.title}
              styles={favoriteSong.styles}
              duration={favoriteSong.duration}
              version={favoriteSong.version}
              coverColor={favoriteSong.coverColor}
              isLiked={favoriteSong.isLiked}
              isDisliked={favoriteSong.isDisliked}
              isPinned={favoriteSong.isPinned}
              takeNumber={songsWithTakeNumbers.get(favoriteSong.id)}
              createdAt={favoriteSong.createdAt}
              isChecked={allGroupSongsChecked}
              onCheck={() => toggleGroupCheck(group.songs)}
              onClick={(e) => handleSelectItem(group.key, favoriteSong.id, e.shiftKey, e.ctrlKey || e.metaKey, visibleIds)}
              onRename={(newTitle) => handleRenameSong(group.key, newTitle)}
              isGroupHeader={true}
              groupCount={group.songs.length}
              isExpanded={isExpanded}
              onToggleExpand={(e) => toggleGroup(e, group.key)}
            />
            
            {isExpanded && (
              <div className="pl-8 relative mt-1">
                <div className="absolute left-[26px] top-0 bottom-4 w-[1px] bg-zinc-800" />
                <div className="space-y-1">
                  {group.songs.map((song) => (
                    <SongItem 
                      key={song.id}
                      id={song.id}
                      title={song.title}
                      styles={song.styles}
                      duration={song.duration}
                      version={song.version}
                      coverColor={song.coverColor}
                      notes={song.notes}
                      isRenamed={song.isRenamed}
                      isLiked={song.isLiked}
                      isDisliked={song.isDisliked}
                      isPinned={song.isPinned}
                      takeNumber={songsWithTakeNumbers.get(song.id)}
                      onCheck={() => toggleCheck(song.id)}
                      onClick={(e) => handleSelectItem(song.id, song.id, e.shiftKey, e.ctrlKey || e.metaKey, visibleIds)}
                      onRename={(newTitle) => handleRenameSong(song.id, newTitle)}
                      isChild={true}
                      createdAt={song.createdAt}
                      isFavorite={groupFavorites[group.key] === song.id}
                      onSetFavorite={() => handleSetFavorite(group.key, song.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
