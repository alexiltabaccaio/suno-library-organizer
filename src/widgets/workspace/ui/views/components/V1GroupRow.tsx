import React from 'react';
import { SongItem } from '@/entities/song/ui/SongItem';
import { SongGroup } from '@/features/library/hooks/useSongGrouping';
import { useUIStore } from '@/app/store/useUIStore';
import { useLibraryStore } from '@/app/store/useLibraryStore';
import { useGroupRowLogic } from '@/widgets/workspace/hooks/useGroupRowLogic';

interface V1GroupRowProps {
  group: SongGroup;
  songsWithTakeNumbers: Map<string, number>;
  visibleIds: string[];
  isExpanded: boolean;
  toggleGroup: (e: React.MouseEvent, key: string) => void;
}

export const V1GroupRow: React.FC<V1GroupRowProps> = ({
  group,
  songsWithTakeNumbers,
  visibleIds,
  isExpanded,
  toggleGroup
}) => {
  const { handleQuickGenerate, toggleCheck, toggleGroupCheck, handleSelectItem } = useUIStore();
  const { groupFavorites, handleRenameSong, handleSetFavorite } = useLibraryStore();
  
  const groupFavoriteId = groupFavorites[group.key];
  const { 
    favoriteSong, 
    allGroupSongsChecked, 
    paginatedSubSongs, 
    subPage, 
    totalSubPages, 
    setGroupPage 
  } = useGroupRowLogic(group, groupFavoriteId);

  return (
    <div className="space-y-1">
      <SongItem 
        id={group.key}
        title={favoriteSong.title}
        styles={favoriteSong.styles}
        lyrics={favoriteSong.lyrics}
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
        onClick={(e) => {
          if (e.ctrlKey || e.metaKey) {
            toggleGroupCheck(group.songs);
          } else {
            handleSelectItem(group.key, favoriteSong.id, e.shiftKey, false, visibleIds);
          }
        }}
        onRename={(newTitle) => handleRenameSong(group.key, newTitle)}
        isGroupHeader={true}
        groupCount={group.songs.length}
        isExpanded={isExpanded}
        onToggleExpand={(e) => toggleGroup(e, group.key)}
        subPage={subPage}
        totalSubPages={totalSubPages}
        onSubPageChange={(page) => setGroupPage(group.key, page)}
        onQuickGenerate={(e) => {
          e.stopPropagation();
          handleQuickGenerate(favoriteSong);
          if (!isExpanded) toggleGroup(e, group.key);
        }}
      />
      
      {isExpanded && (
        <div className="pl-8 relative mt-1">
          <div className="absolute left-[26px] top-0 bottom-4 w-[1px] bg-zinc-800" />
          <div className="space-y-1 max-h-[650px] overflow-y-auto pr-2 scrollbar-hide">
            {paginatedSubSongs.map((song) => (
              <SongItem 
                key={song.id}
                id={song.id}
                title={song.title}
                styles={song.styles}
                lyrics={song.lyrics}
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
                onClick={(e) => {
                  if (e.ctrlKey || e.metaKey) {
                    toggleCheck(song.id);
                  } else {
                    handleSelectItem(song.id, song.id, e.shiftKey, false, visibleIds);
                  }
                }}
                onRename={(newTitle) => handleRenameSong(song.id, newTitle)}
                isChild={true}
                createdAt={song.createdAt}
                isFavorite={groupFavoriteId === song.id}
                onSetFavorite={() => handleSetFavorite(group.key, song.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
