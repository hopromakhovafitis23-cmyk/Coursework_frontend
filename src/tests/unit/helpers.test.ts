import { validateEmail, formatDate, filterMedia, sortMedia } from '../../utils/helpers';
import type { Article } from '../../types';

describe('Helpers', () => {
  describe('validateEmail', () => {
    it('should return true for valid emails', () => {
      expect(validateEmail('test@email.com')).toBe(true);
      expect(validateEmail('user.name+tag@example.co.uk')).toBe(true);
    });

    it('should return false for invalid emails', () => {
      expect(validateEmail('test@.com')).toBe(false);
      expect(validateEmail('plainaddress')).toBe(false);
      expect(validateEmail('@missinguser.com')).toBe(false);
      expect(validateEmail('spaces in@email.com')).toBe(false);
    });
  });

  describe('formatDate', () => {
    it('should format ISO date string correctly', () => {
      const dateString = '2023-10-26T14:30:00Z';
      const formatted = formatDate(dateString);
      expect(formatted).toMatch(/2023/);
      expect(formatted).toMatch(/жовт/i); // "жовтня"
    });

    it('should handle invalid date string gracefully', () => {
      expect(formatDate('invalid-date')).toBe('');
      expect(formatDate('')).toBe('');
    });
  });

  describe('filterMedia and sortMedia for Articles', () => {
    const mockArticles: Article[] = [
      {
        url: '1',
        title: 'Article B',
        publishedAt: '2023-01-01T12:00:00Z',
        description: '',
        content: '',
        source: { name: '', url: '' },
        image: '',
      },
      {
        url: '2',
        title: 'Article A',
        publishedAt: '2023-10-01T12:00:00Z',
        description: '',
        content: '',
        source: { name: '', url: '' },
        image: '',
      },
      {
        url: '3',
        title: 'Article C',
        publishedAt: '2022-05-01T12:00:00Z',
        description: '',
        content: '',
        source: { name: '', url: '' },
        image: '',
      },
    ];

    it('filterMedia should be a placeholder and return all items', () => {
      // Current implementation of filterMedia is a passthrough
      const result = filterMedia(mockArticles, 'Технології');
      expect(result.length).toBe(3);
    });

    it('sortMedia should sort by date descending (year-desc)', () => {
      const result = sortMedia(mockArticles, 'year-desc');
      expect(result[0].url).toBe('2');
      expect(result[2].url).toBe('3');
    });

    it('sortMedia should sort by date ascending (year-asc)', () => {
      const result = sortMedia(mockArticles, 'year-asc');
      expect(result[0].url).toBe('3');
      expect(result[2].url).toBe('2');
    });

    it('sortMedia should sort by title ascending (alpha-asc)', () => {
      const result = sortMedia(mockArticles, 'alpha-asc');
      expect(result[0].title).toBe('Article A');
      expect(result[2].title).toBe('Article C');
    });
  });
});
