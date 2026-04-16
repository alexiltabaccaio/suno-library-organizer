import { Song } from '../../../entities/song/model/types';
import { COVER_GRADIENTS } from '../../../shared/lib/constants';

export const useActionLogic = (
  songs: Song[],
  addSongs: (songs: Song[]) => void,
  editorState: { lyrics: string; styles: string; title: string; version: string },
  setIsMobileEditorOpen: (val: boolean) => void
) => {
  const { lyrics, styles, title, version } = editorState;

  const handleCreate = () => {
    if (!lyrics.trim() && !styles.trim()) return;

    let finalTitle = title.trim();
    
    // Rickroll Easter Egg
    if (finalTitle.toLowerCase() === "never gonna give you up") {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1", "_blank");
      return;
    }

    if (!finalTitle && lyrics.trim()) {
      const lines = lyrics.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('[') && !trimmed.startsWith('(')) {
          finalTitle = trimmed;
          break;
        }
      }
    }

    const now = Date.now();
    const groupKey = `${finalTitle || 'Untitled Song'}|${styles.trim() || 'No styles specified'}|${lyrics.trim() || '[Instrumental]'}`;
    
    // Find the highest take number for this group
    const groupSongs = songs.filter(s => {
      const sKey = `${s.title}|${s.styles}|${s.lyrics}`;
      return sKey === groupKey;
    });
    
    const maxTake = groupSongs.reduce((max, s) => Math.max(max, s.takeNumber || 0), 0);

    const createSong = (index: number, timestamp: number, takeNum: number): Song => {
      const randomMinutes = Math.floor(Math.random() * 4) + 2;
      const randomSeconds = Math.floor(Math.random() * 60);
      const randomDuration = `${randomMinutes}:${randomSeconds.toString().padStart(2, '0')}`;
      
      return {
        id: `${timestamp}-${index}`,
        title: finalTitle || 'Untitled Song',
        styles: styles.trim() || 'No styles specified',
        lyrics: lyrics.trim() || '[Instrumental]',
        duration: randomDuration,
        version: version,
        createdAt: new Date(timestamp),
        coverColor: COVER_GRADIENTS[Math.floor(Math.random() * COVER_GRADIENTS.length)],
        takeNumber: takeNum
      };
    };

    const song1 = createSong(1, now, maxTake + 1);
    const song2 = createSong(2, now + 1, maxTake + 2);

    addSongs([song2, song1]);
    
    setIsMobileEditorOpen(false);
  };

  const handleQuickGenerate = (baseSong: Song) => {
    // Rickroll Easter Egg
    if (baseSong.title.toLowerCase() === "never gonna give you up") {
      window.open("https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1", "_blank");
      return;
    }

    const now = Date.now();
    const groupKey = `${baseSong.title}|${baseSong.styles}|${baseSong.lyrics}`;
    
    // Find the highest take number for this group
    const groupSongs = songs.filter(s => {
      const sKey = `${s.title}|${s.styles}|${s.lyrics}`;
      return sKey === groupKey;
    });
    
    const maxTake = groupSongs.reduce((max, s) => Math.max(max, s.takeNumber || 0), 0);

    const createSong = (index: number, timestamp: number, takeNum: number): Song => {
      const randomMinutes = Math.floor(Math.random() * 4) + 2;
      const randomSeconds = Math.floor(Math.random() * 60);
      const randomDuration = `${randomMinutes}:${randomSeconds.toString().padStart(2, '0')}`;
      
      return {
        id: `${timestamp}-${index}`,
        title: baseSong.title,
        styles: baseSong.styles,
        lyrics: baseSong.lyrics,
        duration: randomDuration,
        version: baseSong.version,
        createdAt: new Date(timestamp),
        coverColor: COVER_GRADIENTS[Math.floor(Math.random() * COVER_GRADIENTS.length)],
        takeNumber: takeNum
      };
    };

    const song1 = createSong(1, now, maxTake + 1);
    const song2 = createSong(2, now + 1, maxTake + 2);

    addSongs([song2, song1]);
  };

  return {
    handleCreate,
    handleQuickGenerate
  };
};
