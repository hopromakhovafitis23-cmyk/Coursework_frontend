import type { Article } from '../types';

export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return '';
    }

    return new Intl.DateTimeFormat('uk-UA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return '';
  }
};

// TODO: Refactor for articles
export const filterMedia = (articles: Article[], _typeFilter?: string): Article[] => {
  if (!articles || articles.length === 0) return [];

  const result = articles;

  // if (_typeFilter && _typeFilter !== 'all') {
  //   result = result.filter((m) => m.type.toLowerCase() === _typeFilter.toLowerCase());
  // }

  return result;
};

// TODO: Refactor for articles
export const sortMedia = (articles: Article[], sortBy: string): Article[] => {
  if (!articles || articles.length === 0) return [];

  const result = [...articles];

  result.sort((a, b) => {
    if (sortBy === 'year-desc' || sortBy === 'year-asc') {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return sortBy === 'year-desc' ? dateB - dateA : dateA - dateB;
    }

    if (sortBy === 'alpha-asc') {
      return a.title.localeCompare(b.title);
    }

    if (sortBy === 'alpha-desc') {
      return b.title.localeCompare(a.title);
    }

    return 0;
  });

  return result;
};
