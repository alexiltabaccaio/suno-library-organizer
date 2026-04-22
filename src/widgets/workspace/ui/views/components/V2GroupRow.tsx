import React from 'react';
import { SongItem } from '@/entities/song/ui/SongItem';
import { SongCard } from '@/entities/song/ui/SongCard';
import { SongGroup } from '@/features/library/hooks/useSongGrouping';
import { HorizontalScrollContainer } from '@/shared/ui/HorizontalScrollContainer';
import { GroupActionPanel } from './GroupActionPanel';
import { useLibraryStore } from '@/app/store/useLibraryStore';
import { useUIStore } from '@/app/store/useUIStore';
import { useGroupRowLogic } from '@/widgets/workspace/hooks/useGroupRowLogic';

interface V2GroupRowProps {
  group: SongGroup;
  songsWithTakeNumbers: Map<string, number>;
  visibleIds: string[];
  isExpanded: boolean;
  toggleGroup: (e: React.MouseEvent, key: string) => void;
  hoveredSongId: string | null;
  setHoveredSongId: (id: string | null) => void;
  hoveredActionsGroupKey: string | null;
  setHoveredActionsGroupKey: (key: string | null) => void;
}

export const V2GroupRow: React.FC<V2GroupRowProps> = ({
  group,
  songsWithTakeNumbers,
  visibleIds,
  isExpanded,
  toggleGroup,
  hoveredSongId,
  setHoveredSongId,
  hoveredActionsGroupKey,
  setHoveredActionsGroupKey
}) => {
  const { handleToggleLike, handleToggleDislike, handleTogglePin, groupFavorites, handleRenameSong, handleSetFavorite, handleDelete } = useLibraryStore();
  const { checkedSongIds, selectedSongId, selectedItemId, handleQuickGenerate, toggleCheck, toggleGroupCheck, handleSelectItem, clearCheckedSongs } = useUIStore();
  
  const groupFavoriteId = groupFavorites[group.key];
  const { 
    favoriteSong, 
    allGroupSongsChecked, 
    paginatedSubSongs, 
    subPage, 
    totalSubPages, 
    setGroupPage 
  } = useGroupRowLogic(group, groupFavoriteId);

  const hasGroupSelection = group.songs.some(s => checkedSongIds.has(s.id)) || group.songs.some(s => s.id === selectedItemId);

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
        <div className="pl-8 relative mt-1 flex items-start group/actions min-h-[98px]">
          <div className="absolute left-[26px] top-0 bottom-4 w-[1px] bg-zinc-800" />
          
          <GroupActionPanel 
            groupKey={group.key}
            paginatedSubSongs={paginatedSubSongs}
            checkedSongIds={checkedSongIds}
            hoveredSongId={hoveredSongId}
            hoveredActionsGroupKey={hoveredActionsGroupKey}
            selectedSongId={selectedSongId}
            selectedItemId={selectedItemId}
            favoriteSong={favoriteSong}
            onHoverActions={setHoveredActionsGroupKey}
            onToggleLike={handleToggleLike}
            onToggleDislike={handleToggleDislike}
            onTogglePin={handleTogglePin}
            onDelete={handleDelete}
            onClearSelection={clearCheckedSongs}
          />

          <div className="flex-1 min-w-0">
            <HorizontalScrollContainer className={`pl-0 gap-0 has-[.song-card:hover]:[&_.song-card:not(:hover):not(.is-selected)]:opacity-25 ${hasGroupSelection ? '[&_.song-card:not(:hover):not(.is-selected)]:opacity-25' : ''}`}>
              {paginatedSubSongs.map((song) => (
                <SongCard 
                  key={song.id}
                  id={song.id}
                  duration={song.duration}
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
                  isFavorite={groupFavoriteId === song.id}
                  onSetFavorite={() => handleSetFavorite(group.key, song.id)}
                  onMouseEnter={() => setHoveredSongId(song.id)}
                  onMouseLeave={() => setHoveredSongId(null)}
                />
              ))}
            </HorizontalScrollContainer>
          </div>
        </div>
      )}
    </div>
  );
};
