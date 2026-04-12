import { Song } from './types';

/**
 * Generates a unique grouping key for a song based on its core metadata.
 * Songs with the same title, styles, and lyrics are grouped together.
 */
export const getSongGroupKey = (song: Pick<Song, 'title' | 'styles' | 'lyrics'>): string => {
  return `${song.title}|${song.styles}|${song.lyrics}`;
};

/**
 * Builds a group key manually from its constituent parts.
 */
export const buildGroupKey = (title: string, styles: string, lyrics: string): string => {
  return `${title}|${styles}|${lyrics}`;
};
