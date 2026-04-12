import React, { useState } from 'react';
import { ChevronDown, Library, RefreshCw, Wand2, Trash2 } from 'lucide-react';
import { FormattedTextarea } from './FormattedTextarea';
import { SAMPLE_STYLES } from '../../lib/constants';

interface StylesEditorProps {
  styles: string;
  setStyles: (val: string) => void;
}

export const StylesEditor: React.FC<StylesEditorProps> = ({ styles, setStyles }) => {
  const [lastIndex, setLastIndex] = useState(-1);

  const handleGenerateStyles = () => {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * SAMPLE_STYLES.length);
    } while (nextIndex === lastIndex);
    
    setLastIndex(nextIndex);
    setStyles(SAMPLE_STYLES[nextIndex]);
  };

  return (
    <div className="bg-[#19191b] rounded-xl p-4 flex flex-col gap-3 relative">
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 font-medium text-[15px] cursor-default">
          <ChevronDown className="w-4 h-4 text-zinc-100" />
          Styles
        </button>
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
      </div>
      
      <div className="relative flex flex-col min-h-[120px]">
        <FormattedTextarea 
          value={styles}
          onChange={setStyles}
          placeholder="hard rock, slowed, clear male vocal, 90-100 bpm, heavy guitar riffs"
          minHeight="120px"
        />
        <div className="flex items-center gap-2 mt-auto pt-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <button className="text-zinc-500 cursor-default shrink-0 mr-2">
            <Library className="w-4 h-4" />
          </button>
          <button className="p-2 bg-zinc-800/80 rounded-full cursor-default shrink-0 mr-1">
            <RefreshCw className="w-4 h-4 text-zinc-300" />
          </button>
          <span className="bg-zinc-800/80 px-3.5 py-1.5 rounded-full text-[13px] font-medium shrink-0 text-zinc-200 cursor-default">
            hard rock
          </span>
          <span className="bg-zinc-800/80 px-3.5 py-1.5 rounded-full text-[13px] font-medium shrink-0 text-zinc-200 cursor-default">
            slowed
          </span>
          <span className="bg-zinc-800/80 px-3.5 py-1.5 rounded-full text-[13px] font-medium shrink-0 text-zinc-200 cursor-default">
            clear male vocal
          </span>
        </div>
      </div>
    </div>
  );
};
