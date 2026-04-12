import React, { useState, useMemo } from 'react';
import { ChevronRight, Pencil, Search, Filter, ChevronDown, ChevronLeft, ListFilter, Sparkles, Type, Highlighter, Palette } from 'lucide-react';
import { SongItem } from './SongItem';
import { Song } from '../../lib/types';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import { useEditor } from '../../contexts/EditorContext';

export const WorkspaceArea: React.FC = () => {
  const { 
    songs, selectedItemIds, handleSelectItem, handleRenameSong, handleSetFavorite, groupFavorites, viewMode, setViewMode 
  } = useWorkspace();
  const { formattingMode, setFormattingMode } = useEditor();

  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [checkedSongIds, setCheckedSongIds] = useState<Set<string>>(new Set());

  const groupedSongs = useMemo(() => {
    const groups: { key: string; songs: Song[] }[] = [];
    const map = new Map<string, number>();

    songs.forEach(song => {
      // Group by title, styles, and lyrics
      const key = `${song.title}|${song.styles}|${song.lyrics}`;
      if (map.has(key)) {
        groups[map.get(key)!].songs.push(song);
      } else {
        map.set(key, groups.length);
        groups.push({ key, songs: [song] });
      }
    });
    return groups;
  }, [songs]);

  const visibleIds = useMemo(() => {
    if (viewMode === 'before') return songs.map(s => s.id);
    
    const ids: string[] = [];
    groupedSongs.forEach(group => {
      if (group.songs.length === 1) {
        ids.push(group.songs[0].id);
      } else {
        ids.push(group.key);
        if (expandedGroups.has(group.key)) {
          group.songs.forEach(s => ids.push(s.id));
        }
      }
    });
    return ids;
  }, [viewMode, songs, groupedSongs, expandedGroups]);

  const toggleGroup = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleCheck = (id: string) => {
    setCheckedSongIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleGroupCheck = (songsInGroup: Song[]) => {
    setCheckedSongIds(prev => {
      const next = new Set(prev);
      const allChecked = songsInGroup.every(s => next.has(s.id));
      
      if (allChecked) {
        // If all are checked, uncheck them all
        songsInGroup.forEach(s => next.delete(s.id));
      } else {
        // Otherwise, check them all
        songsInGroup.forEach(s => next.add(s.id));
      }
      return next;
    });
  };

  return (
    <div className="flex-1 h-full flex flex-col bg-[#101012] overflow-hidden">
      {/* Header */}
      <div className="px-4 pt-6 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[15px] font-medium">
          <span className="text-zinc-100">Workspaces</span>
          <ChevronRight className="w-4 h-4 text-zinc-500" />
          <span className="text-zinc-400">Test</span>
          <button className="text-zinc-600 hover:text-zinc-400 ml-1">
            <Pencil className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-4 py-2 flex items-center justify-between gap-2 md:gap-4">
        {/* Desktop Search */}
        <div className="hidden md:block flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full bg-[#19191b] text-sm text-zinc-100 placeholder:text-zinc-500 rounded-full pl-9 pr-4 py-2 outline-none border border-transparent focus:border-zinc-800"
          />
        </div>

        {/* Mobile Search Button */}
        <button className="md:hidden w-10 h-10 rounded-full bg-[#19191b] flex items-center justify-center text-zinc-300 shrink-0">
          <Search className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 text-sm flex-1 md:flex-none justify-between md:justify-end">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 bg-[#19191b] hover:bg-zinc-800 transition-colors px-3 py-1.5 md:px-3 md:py-1.5 h-10 rounded-full text-zinc-300">
              <Filter className="w-4 h-4 md:w-3.5 md:h-3.5" />
              <span className="hidden md:inline">Filters (3)</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-zinc-500" />
            </button>
            <button className="flex items-center gap-1.5 bg-[#19191b] hover:bg-zinc-800 transition-colors px-3 py-1.5 md:px-3 md:py-1.5 h-10 rounded-full text-zinc-300">
              <ListFilter className="w-4 h-4 md:w-3.5 md:h-3.5" />
              <span className="hidden md:inline">Newest</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 text-zinc-500" />
            </button>
          </div>

          <div className="hidden md:flex items-center bg-[#19191b] rounded-full p-0.5 h-10">
            <button className="px-3 py-1 text-zinc-400 hover:text-zinc-200">Liked</button>
            <button className="px-3 py-1 text-zinc-400 hover:text-zinc-200">Public</button>
            <button className="px-3 py-1 text-zinc-400 hover:text-zinc-200">Uploads</button>
          </div>

          <div className="flex items-center gap-1 bg-[#19191b] rounded-full px-2 h-10">
            <button className="p-1 text-zinc-500 hover:text-zinc-300"><ChevronLeft className="w-4 h-4" /></button>
            <span className="text-zinc-300 text-xs font-medium px-1">1</span>
            <button className="p-1 text-zinc-500 hover:text-zinc-300"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      {/* Song List */}
      <div className="flex-1 overflow-y-auto px-4 py-4 select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="space-y-1 relative pl-0">
          {viewMode === 'before' ? (
            songs.map(song => (
              <SongItem 
                key={song.id}
                id={song.id}
                title={song.title}
                styles={song.styles}
                duration={song.duration}
                version={song.version}
                coverColor={song.coverColor}
                isSelected={selectedItemIds.has(song.id)}
                isChecked={checkedSongIds.has(song.id)}
                onCheck={() => toggleCheck(song.id)}
                onClick={(e) => handleSelectItem(song.id, song.id, e.shiftKey, e.ctrlKey || e.metaKey, visibleIds)}
                onRename={(newTitle) => handleRenameSong(song.id, newTitle)}
              />
            ))
          ) : (
            groupedSongs.map(group => {
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
                    isSelected={selectedItemIds.has(song.id)}
                    isChecked={checkedSongIds.has(song.id)}
                    onCheck={() => toggleCheck(song.id)}
                    onClick={(e) => handleSelectItem(song.id, song.id, e.shiftKey, e.ctrlKey || e.metaKey, visibleIds)}
                    onRename={(newTitle) => handleRenameSong(song.id, newTitle)}
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
                    isSelected={selectedItemIds.has(group.key)}
                    isChecked={allGroupSongsChecked}
                    onCheck={() => toggleGroupCheck(group.songs)}
                    onClick={(e) => handleSelectItem(group.key, favoriteSong.id, e.shiftKey, e.ctrlKey || e.metaKey, visibleIds)}
                    onRename={(newTitle) => {
                      group.songs.forEach(s => handleRenameSong(s.id, newTitle));
                    }}
                    isGroupHeader={true}
                    groupCount={group.songs.length}
                    isExpanded={isExpanded}
                    onToggleExpand={(e) => toggleGroup(e, group.key)}
                  />
                  
                  {isExpanded && (
                    <div className="pl-8 relative mt-1">
                      {/* Vertical line for the stack */}
                      <div className="absolute left-[26px] top-0 bottom-4 w-[1px] bg-zinc-800" />
                      <div className="space-y-1">
                        {group.songs.map(song => (
                          <SongItem 
                            key={song.id}
                            id={song.id}
                            title={song.title}
                            styles={song.styles}
                            duration={song.duration}
                            version={song.version}
                            coverColor={song.coverColor}
                            isSelected={selectedItemIds.has(song.id)}
                            isChecked={checkedSongIds.has(song.id)}
                            onCheck={() => toggleCheck(song.id)}
                            onClick={(e) => handleSelectItem(song.id, song.id, e.shiftKey, e.ctrlKey || e.metaKey, visibleIds)}
                            onRename={(newTitle) => handleRenameSong(song.id, newTitle)}
                            isChild={true}
                            isFavorite={groupFavorites[group.key] === song.id}
                            onSetFavorite={() => handleSetFavorite(group.key, song.id)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* New Footer */}
      <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 items-center px-6 py-8 border-t border-zinc-800/50 bg-[#101012] gap-8">
        {/* Left Spacer for centering */}
        <div className="hidden lg:block order-1"></div>

        {/* Center Content */}
        <div className="flex flex-col items-center gap-4 order-2">
          <h2 className="text-zinc-400 text-lg font-semibold tracking-tight uppercase opacity-50">
            Suno Library Organizer
          </h2>
          
          <div className="flex items-center bg-[#19191b] rounded-full p-1 border border-zinc-800/50">
            <button 
              onClick={() => setViewMode('before')}
              className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${
                viewMode === 'before' 
                  ? 'bg-zinc-100 text-black shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              Before
            </button>
            <button 
              onClick={() => setViewMode('after')}
              className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all ${
                viewMode === 'after' 
                  ? 'bg-zinc-100 text-black shadow-lg' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              After
            </button>
          </div>

          <p className="text-[10px] text-zinc-600 font-medium tracking-tight">
            Prototype developed by{' '}
            <a 
              href="https://www.linkedin.com/in/alexgiustizieri/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Alex Giustizieri
            </a>
          </p>
        </div>

        {/* Smart Lyrics Editor Badge - Right Aligned */}
        <div className="flex flex-col items-center lg:items-end gap-2 order-3">
          <a 
            href="https://github.com/alexiltabaccaio/suno-flow-editor"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-400 transition-colors cursor-pointer group"
          >
            <Sparkles className="w-3.5 h-3.5 text-pink-500/50 group-hover:text-pink-400 transition-colors" />
            <span className="text-[11px] font-medium tracking-widest uppercase">
              Smart Lyrics Editor
            </span>
          </a>
          
          <div className="flex items-center bg-zinc-900/50 rounded-lg p-0.5 border border-zinc-800/50">
            <button
              onClick={() => setFormattingMode('none')}
              className={`p-1 rounded-md transition-all ${formattingMode === 'none' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
              title="Plain text"
            >
              <Type className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFormattingMode('simple')}
              className={`p-1 rounded-md transition-all ${formattingMode === 'simple' ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
              title="B&W Formatting"
            >
              <Highlighter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setFormattingMode('colored')}
              className={`p-1 rounded-md transition-all ${formattingMode === 'colored' ? 'bg-cyan-500/20 text-cyan-400 shadow-sm' : 'text-zinc-600 hover:text-zinc-400'}`}
              title="Color formatting"
            >
              <Palette className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
