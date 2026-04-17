import { describe, it, expect } from 'vitest';
import { getSongGroupKey, buildGroupKey } from './songUtils';

describe('songUtils', () => {
  const mockSong = {
    title: 'Song Title',
    styles: 'Style A, Style B',
    lyrics: '[Chorus] Hello world'
  };

  const expectedKey = 'Song Title|Style A, Style B|[Chorus] Hello world';

  it('should generate a correct group key from a song object', () => {
    const key = getSongGroupKey(mockSong);
    expect(key).toBe(expectedKey);
  });

  it('should build a correct group key from constituent parts', () => {
    const key = buildGroupKey(mockSong.title, mockSong.styles, mockSong.lyrics);
    expect(key).toBe(expectedKey);
  });

  it('should produce different keys for different metadata', () => {
    const key1 = buildGroupKey('Title 1', 'Style 1', 'Lyrics 1');
    const key2 = buildGroupKey('Title 2', 'Style 1', 'Lyrics 1');
    expect(key1).not.toBe(key2);
  });
});
