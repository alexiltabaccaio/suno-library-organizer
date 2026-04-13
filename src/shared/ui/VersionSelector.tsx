import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useEditor } from '../../features/editor/model/EditorContext';

interface VersionSelectorProps {
  className?: string;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({ className }) => {
  const { version, setVersion } = useEditor();
  const [isOpen, setIsOpen] = useState(false);
  const versions = ['v5.5', 'v5', 'v4.5', 'v4'];

  return (
    <div className={`relative ${className}`}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 bg-zinc-900/80 border border-zinc-800/80 rounded-full pl-3 pr-2 py-1.5 text-sm font-medium hover:bg-zinc-800 transition-colors"
      >
        {version}
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-24 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-[70] overflow-hidden">
            {versions.map((v) => (
              <button
                key={v}
                onClick={() => {
                  setVersion(v);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors ${
                  v === version ? 'bg-pink-500 text-white' : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
