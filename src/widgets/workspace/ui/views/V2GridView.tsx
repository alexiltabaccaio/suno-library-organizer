import React from 'react';
import { ThumbsUp, ThumbsDown, Pin } from 'lucide-react';
import { SongItem } from '../../../../entities/song/ui/SongItem';
import { SongCard } from '../../../../entities/song/ui/SongCard';
import { Song } from '../../../../entities/song/model/types';
import { SongGroup } from '../../../../features/library/hooks/useSongGrouping';
import { HorizontalScrollContainer } from '../../../../shared/ui/HorizontalScrollContainer';
import { useLibrary } from '../../../../features/library/model/LibraryContext';
import { useUI } from '../../../../features/ui/model/UIContext';

interface V2GridViewProps {
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

export const V2GridView: React.FC<V2GridViewProps> = ({
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
  const { handleToggleLike, handleToggleDislike, handleTogglePin } = useLibrary();
  const { selectedItemIds, subFilters, groupPages, setGroupPage } = useUI();
  const SUB_ITEMS_PER_PAGE = 15;

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

        const filteredSubSongs = group.songs.filter(s => {
          if (subFilters.liked && !s.isLiked) return false;
          if (subFilters.disliked && !s.isDisliked) return false;
          if (subFilters.hideDisliked && s.isDisliked) return false;
          return true;
        });

        const totalSubPages = Math.ceil(filteredSubSongs.length / SUB_ITEMS_PER_PAGE);
        const subPage = Math.min(groupPages[group.key] || 1, totalSubPages || 1);
        const start = (subPage - 1) * SUB_ITEMS_PER_PAGE;
        const paginatedSubSongs = filteredSubSongs.slice(start, start + SUB_ITEMS_PER_PAGE);

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
              subPage={subPage}
              totalSubPages={totalSubPages}
              onSubPageChange={(page) => setGroupPage(group.key, page)}
            />
            
            {isExpanded && (
              <div className="pl-8 relative mt-1 flex items-start group/actions">
                <div className="absolute left-[26px] top-0 bottom-4 w-[1px] bg-zinc-800" />
                
                {/* Fixed Dynamic Action Column */}
                <div className={`flex flex-col items-center gap-3 py-2 mr-2 w-6 shrink-0 z-10 transition-opacity duration-200 ${
                  paginatedSubSongs.some(s => selectedItemIds.has(s.id)) 
                    ? 'opacity-100' 
                    : 'opacity-0 group-hover/actions:opacity-100 pointer-events-none group-hover/actions:pointer-events-auto'
                }`}>
                  {(() => {
                    const activeSong = paginatedSubSongs.find(s => selectedItemIds.has(s.id)) || favoriteSong;
                    return (
                      <>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleLike(activeSong.id); }}
                          className={`transition-colors ${activeSong.isLiked ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
                        >
                          <ThumbsUp className="w-3.5 h-3.5" fill={activeSong.isLiked ? "currentColor" : "none"} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleDislike(activeSong.id); }}
                          className={`transition-colors ${activeSong.isDisliked ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
                        >
                          <ThumbsDown className="w-3.5 h-3.5" fill={activeSong.isDisliked ? "currentColor" : "none"} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleTogglePin(activeSong.id); }}
                          className={`transition-colors ${activeSong.isPinned ? 'text-zinc-100' : 'text-zinc-600 hover:text-zinc-300'}`}
                        >
                          <Pin className="w-3.5 h-3.5" fill={activeSong.isPinned ? "currentColor" : "none"} />
                        </button>
                      </>
                    );
                  })()}
                </div>

                <div className="flex-1 min-w-0">
                  <HorizontalScrollContainer className="pl-1 gap-2">
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
                        onClick={(e) => handleSelectItem(song.id, song.id, e.shiftKey, e.ctrlKey || e.metaKey, visibleIds)}
                        isFavorite={groupFavorites[group.key] === song.id}
                        onSetFavorite={() => handleSetFavorite(group.key, song.id)}
                      />
                    ))}
                  </HorizontalScrollContainer>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
};
