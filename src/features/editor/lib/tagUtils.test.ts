import { describe, it, expect } from 'vitest';
import { isStructureTag, isInstrumentTag, getNextTag, getSuggestedNextTag } from './tagUtils';

describe('tagUtils', () => {
  describe('isStructureTag', () => {
    it('should identify valid structure tags', () => {
      expect(isStructureTag('[Verse]')).toBe(true);
      expect(isStructureTag('[Chorus]')).toBe(true);
      expect(isStructureTag('[BRIDGE]')).toBe(true);
      expect(isStructureTag('[Slow Chorus]')).toBe(true);
    });

    it('should reject non-structure tags or malformed tags', () => {
      expect(isStructureTag('Verse')).toBe(false); // missing brackets
      expect(isStructureTag('[Guitar]')).toBe(false);
      expect(isStructureTag('[Universe]')).toBe(false); // contains 'verse' but not a tag
    });
  });

  describe('isInstrumentTag', () => {
    it('should identify valid instrument tags', () => {
      expect(isInstrumentTag('[Guitar]')).toBe(true);
      expect(isInstrumentTag('[Piano Solo]')).toBe(true);
      expect(isInstrumentTag('[Drums]')).toBe(true);
    });

    it('should reject non-instrument tags', () => {
      expect(isInstrumentTag('[Chorus]')).toBe(false);
    });
  });

  describe('getNextTag', () => {
    it('should cycle through tags correctly', () => {
      expect(getNextTag('[Intro]', 'next')).toBe('[Verse]');
      expect(getNextTag('[Verse]', 'next')).toBe('[Pre-Chorus]');
      expect(getNextTag('[Outro]', 'next')).toBe('[Intro]'); // Loop back
    });

    it('should cycle backwards correctly', () => {
      expect(getNextTag('[Intro]', 'prev')).toBe('[Outro]');
    });

    it('should handle custom content and return base tag', () => {
      expect(getNextTag('[Epic Chorus]', 'next')).toBe('[Post-Chorus]');
    });
  });

  describe('getSuggestedNextTag', () => {
    it('should suggest Verse as first tag', () => {
      expect(getSuggestedNextTag([])).toBe('Verse');
    });

    it('should suggest Chorus after Verse', () => {
      expect(getSuggestedNextTag(['[Verse]'])).toBe('Chorus');
    });

    it('should suggest Bridge after 2 Verses and 2 Choruses', () => {
      const history = ['[Verse]', '[Chorus]', '[Verse]', '[Chorus]'];
      expect(getSuggestedNextTag(history)).toBe('Bridge');
    });
  });
});
