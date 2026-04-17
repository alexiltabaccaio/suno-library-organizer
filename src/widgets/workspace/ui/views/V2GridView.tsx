import React, { useState, useRef } from 'react';
import { SongItem } from '@/entities/song/ui/SongItem';
import { SongGroup } from '@/features/library/hooks/useSongGrouping';
import { V2GroupRow } from './components/V2GroupRow';
import { useUIStore } from '@/app/store/useUIStore';
import { useLibraryStore } from '@/app/store/useLibraryStore';
import { DragSelect } from './components/DragSelect';

interface V2GridViewProps {
  groupedSongs: SongGroup[];
  songsWithTakeNumbers: Map<string, number>;
  visibleIds: string[];
  expandedGroups: Set<string>;
  toggleGroup: (e: React.MouseEvent, key: string) => void;
}

export const V2GridView: React.FC<V2GridViewProps> = ({
  groupedSongs,
  songsWithTakeNumbers,
  visibleIds,
  expandedGroups,
  toggleGroup
}) => {
  const { toggleCheck, handleSelectItem, checkedSongIds, handleQuickGenerate } = useUIStore();
  const { handleRenameSong } = useLibraryStore();
  const [hoveredSongId, setHoveredSongId] = useState<string | null>(null);
  const [hoveredActionsGroupKey, setHoveredActionsGroupKey] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <DragSelect 
      containerRef={containerRef}
    >
      <div className="space-y-1 flex-1">
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
                isChecked={checkedSongIds.has(song.id)}
                onCheck={() => toggleCheck(song.id)}
                onClick={(e) => handleSelectItem(song.id, song.id, e.shiftKey, e.ctrlKey || e.metaKey, visibleIds)}
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
            <V2GroupRow 
              key={group.key}
              group={group}
              songsWithTakeNumbers={songsWithTakeNumbers}
              visibleIds={visibleIds}
              isExpanded={isExpanded}
              toggleGroup={toggleGroup}
              hoveredSongId={hoveredSongId}
              setHoveredSongId={setHoveredSongId}
              hoveredActionsGroupKey={hoveredActionsGroupKey}
              setHoveredActionsGroupKey={setHoveredActionsGroupKey}
            />
          );
        })}
      </div>
    </DragSelect>
  );
};
