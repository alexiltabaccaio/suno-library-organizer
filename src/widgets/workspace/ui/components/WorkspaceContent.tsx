import React from 'react';
import { Song } from '@/entities/song/model/types';
import { BeforeView } from '../views/BeforeView';
import { V1ListView } from '../views/V1ListView';
import { V2GridView } from '../views/V2GridView';

interface WorkspaceContentProps {
  viewMode: 'before' | 'v1' | 'v2';
  items: any[];
  songsWithTakeNumbers: Map<string, number>;
  visibleIds: string[];
  expandedGroups: Set<string>;
  toggleGroup: (e: React.MouseEvent | undefined, key: string) => void;
}

export const WorkspaceContent: React.FC<WorkspaceContentProps> = ({
  viewMode,
  items,
  songsWithTakeNumbers,
  visibleIds,
  expandedGroups,
  toggleGroup
}) => {
  return (
    <div 
      className="flex-1 overflow-y-auto px-4 py-4 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <div className="relative pl-0 min-h-full flex flex-col">
        {viewMode === 'before' ? (
          <div className="space-y-1">
            <BeforeView 
              songs={items as Song[]}
              songsWithTakeNumbers={songsWithTakeNumbers}
              visibleIds={visibleIds}
            />
          </div>
        ) : viewMode === 'v1' ? (
          <div className="space-y-1">
            <V1ListView 
              groupedSongs={items as any[]}
              songsWithTakeNumbers={songsWithTakeNumbers}
              visibleIds={visibleIds}
              expandedGroups={expandedGroups}
              toggleGroup={toggleGroup}
            />
          </div>
        ) : (
          <V2GridView 
            groupedSongs={items as any[]}
            songsWithTakeNumbers={songsWithTakeNumbers}
            visibleIds={visibleIds}
            expandedGroups={expandedGroups}
            toggleGroup={toggleGroup}
          />
        )}
      </div>
    </div>
  );
};
