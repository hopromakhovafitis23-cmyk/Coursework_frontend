import type { Article } from '../types';

// CORS proxies that can bypass GNews restrictions
const CORS_PROXIES = [
  'https://api.codetabs.com/v1/proxy?quest=',
  'https://api.allorigins.win/raw?url=',
];

const GNEWS_DATA_BASE = `${import.meta.env.BASE_URL}gnews/`;
const CACHED_HEADLINES_KEY = 'cached_top_headlines';
const CACHE_EXPIRY_KEY = 'gnews_cache_expiry';
const CACHE_EXPIRY_MS = 6 * 60 * 60 * 1000; // 6 hours

const FALLBACK_TOP_HEADLINES: Article[] = [
  {
    title: 'Місцева ініціатива змінює місто на краще',
    description: 'Громада запускає новий освітній простір для молоді.',
    content:
      'Локальні мешканці об'єдналися для відкриття нового простору, який підтримає молодіжні проєкти та бізнес-ініціативи.',
    url: 'https://example.com/local-initiative',
    image: 'https://placehold.co/600x400?text=%D0%9D%D0%BE%D0%B2%D0%B8%D0%BD%D0%B0',
    publishedAt: new Date().toISOString(),
    source: { name: 'Новини UA', url: 'https://example.com' },
  },
];

const isCacheValid = (): boolean => {
  try {
    const expiry = localStorage.getItem(CACHE_EXPIRY_KEY);
    if (!expiry) return false;
    return Date.now() < parseInt(expiry, 10);
  } catch {
    return false;
  }
};

const setCacheExpiry = () => {
  try {
    localStorage.setItem(CACHE_EXPIRY_KEY, String(Date.now() + CACHE_EXPIRY_MS));
  } catch (error) {
    console.warn('Failed to set cache expiry:', error);
  }
};

const loadCachedTopHeadlines = (): Article[] => {
  try {
    const cached = localStorage.getItem(CACHED_HEADLINES_KEY);
    return cached ? (JSON.parse(cached) as Article[]) : [];
  } catch (error) {
    console.warn('Failed to load cached top headlines:', error);
    return [];
  }
};

const cacheTopHeadlines = (articles: Article[]) => {
  try {
    localStorage.setItem(CACHED_HEADLINES_KEY, JSON.stringify(articles));
    setCacheExpiry();
  } catch (error) {
    console.warn('Failed to cache top headlines:', error);
  }
};

const getCategoryFileName = (category?: string) => {
  const normalized = !category || category === 'all' ? 'general' : category;
  return `${normalized}.json`;
};

const loadStaticHeadlines = async (category?: string): Promise<Article[]> => {
  const fileName = getCategoryFileName(category);
  const response = await fetch(`${GNEWS_DATA_BASE}${fileName}`);
  if (!response.ok) {
    throw new Error(`Failed to load static headlines: ${response.status}`);
  }
  return (await response.json()) as Article[];
};

// Try to fetch from GNews via CORS proxy as fallback
const fetchFromGNewsThroughProxy = async (category: string): Promise<Article[]> => {
  const API_KEY = 'fc7b88b8060f4ce1c43c9112b18d008d';
  const gnewsUrl = `https://gnews.io/api/v4/top-headlines?lang=uk&category=${category}&apikey=${API_KEY}`;

  for (const proxyBase of CORS_PROXIES) {
    try {
      const proxyUrl = proxyBase + encodeURIComponent(gnewsUrl);
      const response = await fetch(proxyUrl, { signal: AbortSignal.timeout(8000) });
      if (response.ok) {
        const data = await response.json();
        return data.articles || [];
      }
    } catch (error) {
      console.debug(`CORS proxy attempt failed (${proxyBase}):`, error);
    }
  }

  throw new Error('All CORS proxy attempts failed');
};

export const getTopHeadlines = async (category?: string): Promise<Article[]> => {
  try {
    const articles = await loadStaticHeadlines(category);
    cacheTopHeadlines(articles);
    return articles;
  } catch (error) {
    console.warn('Static GNews data request failed, trying live fetch:', error);

    // Try to fetch fresh data from GNews through CORS proxy if cache is expired
    if (!isCacheValid()) {
      try {
        const categoryName = !category || category === 'all' ? 'general' : category;
        const liveArticles = await fetchFromGNewsThroughProxy(categoryName);
        cacheTopHeadlines(liveArticles);
        return liveArticles;
      } catch (proxyError) {
        console.warn('Live fetch through CORS proxy failed:', proxyError);
      }
    }

    // Fall back to cached data
    const cachedArticles = loadCachedTopHeadlines();
    return cachedArticles.length ? cachedArticles : FALLBACK_TOP_HEADLINES;
  }
};

export const searchArticles = async (query: string): Promise<Article[]> => {
  if (!query.trim()) return [];

  try {
    const response = await fetch(`${GNEWS_DATA_BASE}all.json`);
    if (!response.ok) {
      throw new Error(`Failed to load search data: ${response.status}`);
    }
    const articles = (await response.json()) as Article[];
    return articles.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching articles:', error);
    const cachedArticles = loadCachedTopHeadlines();
    const fallbackArticles = cachedArticles.length ? cachedArticles : FALLBACK_TOP_HEADLINES;
    return fallbackArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query.toLowerCase()) ||
        article.description.toLowerCase().includes(query.toLowerCase()) ||
        article.content.toLowerCase().includes(query.toLowerCase())
    );
  }
};
