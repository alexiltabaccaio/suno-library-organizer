import React, { useState, useMemo } from 'react';
import { ChevronDown, Library, RefreshCw, Wand2, Trash2 } from 'lucide-react';
import { FormattedTextarea } from './FormattedTextarea';
import { SAMPLE_STYLES, STYLE_TAGS } from '../../../shared/lib/constants';

interface StylesEditorProps {
  styles: string;
  setStyles: (val: string) => void;
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
}

export const StylesEditor: React.FC<StylesEditorProps> = ({ 
  styles, 
  setStyles,
  isCollapsed,
  setIsCollapsed
}) => {
  const [lastIndex, setLastIndex] = useState(-1);
  const [tagSeed, setTagSeed] = useState(0);

  const visibleTags = useMemo(() => {
    // Shuffle and pick 3 tags
    return [...STYLE_TAGS]
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
  }, [tagSeed]);

  const handleGenerateStyles = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * SAMPLE_STYLES.length);
    } while (nextIndex === lastIndex);
    
    setLastIndex(nextIndex);
    setStyles(SAMPLE_STYLES[nextIndex]);
  };

  const handleAddTag = (tag: string) => {
    const currentStyles = styles.trim();
    if (!currentStyles) {
      setStyles(tag);
    } else {
      // Check if tag already exists to avoid duplicates
      const tags = currentStyles.split(',').map(t => t.trim().toLowerCase());
      if (!tags.includes(tag.toLowerCase())) {
        setStyles(`${currentStyles}, ${tag}`);
      }
    }
  };

  const handleRandomizeTags = () => {
    setTagSeed(prev => prev + 1);
  };

  return (
    <div className={`bg-[#19191b] rounded-xl p-4 flex flex-col transition-all duration-200 ${isCollapsed ? 'gap-0' : 'gap-3'} relative`}>
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center gap-2 font-medium text-[15px] text-zinc-100 hover:text-white transition-colors"
        >
          <ChevronDown className={`w-4 h-4 transition-transform ${isCollapsed ? '-rotate-90' : ''}`} />
          Styles
        </button>
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setStyles('')}
              disabled={styles.length === 0}
              className={`p-2 rounded-full ${
                styles.length > 0 
                  ? 'bg-zinc-800/80 text-zinc-400 hover:bg-red-500/20 hover:text-red-400' 
                  : 'bg-zinc-800/40 text-zinc-600 cursor-default'
              }`}
              title="Clear styles"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              onClick={handleGenerateStyles}
              className="p-2.5 bg-blue-600 rounded-full hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20 cursor-pointer"
              title="Generate styles"
            >
              <Wand2 className="w-4 h-4 text-white" />
            </button>
          </div>
        )}
      </div>
      
      {!isCollapsed && (
        <div className="relative flex flex-col min-h-[120px]">
          <FormattedTextarea 
            value={styles}
            onChange={setStyles}
            placeholder="hard rock, slowed, clear male vocal, 90-100 bpm, heavy guitar riffs"
            minHeight="120px"
          />
          <div className="flex items-center gap-2 mt-auto pt-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="text-zinc-500 shrink-0 mr-2">
              <Library className="w-4 h-4" />
            </div>
            <button 
              onClick={handleRandomizeTags}
              className="p-2 bg-zinc-800/80 rounded-full hover:bg-zinc-700 transition-colors shrink-0 mr-1"
              title="Randomize suggestions"
            >
              <RefreshCw className="w-4 h-4 text-zinc-300" />
            </button>
            {visibleTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleAddTag(tag)}
                className="bg-zinc-800/80 px-3.5 py-1.5 rounded-full text-[13px] font-medium shrink-0 text-zinc-200 hover:bg-zinc-700 hover:text-white transition-all active:scale-95"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
