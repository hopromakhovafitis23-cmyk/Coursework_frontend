import type { Article } from '../types';

const GNEWS_DATA_BASE = `${import.meta.env.BASE_URL}gnews/`;
const CACHED_HEADLINES_KEY = 'cached_top_headlines';

const FALLBACK_TOP_HEADLINES: Article[] = [
  {
    title: 'Місцева ініціатива змінює місто на краще',
    description: 'Громада запускає новий освітній простір для молоді.',
    content:
      'Локальні мешканці об’єдналися для відкриття нового простору, який підтримає молодіжні проєкти та бізнес-ініціативи.',
    url: 'https://example.com/local-initiative',
    image: 'https://placehold.co/600x400?text=%D0%9D%D0%BE%D0%B2%D0%B8%D0%BD%D0%B0',
    publishedAt: new Date().toISOString(),
    source: { name: 'Новини UA', url: 'https://example.com' },
  },
  {
    title: 'Культура та мистецтво: новий фестиваль стартує цього тижня',
    description: 'Фестиваль обіцяє концерти, виставки та освітні події для всієї родини.',
    content:
      'У центрі міста стартує фестиваль, який приверне увагу митців і гостей з усієї країни.',
    url: 'https://example.com/culture-festival',
    image: 'https://placehold.co/600x400?text=%D0%9A%D1%83%D0%BB%D1%8C%D1%82%D1%83%D1%80%D0%B0',
    publishedAt: new Date().toISOString(),
    source: { name: 'Культура Онлайн', url: 'https://example.com' },
  },
  {
    title: 'Економіка: відновлення бізнесу після локдауну',
    description: 'Підприємства адаптуються до нових умов роботи та попиту.',
    content:
      'Аналітики відзначають зростання малого бізнесу у регіонах, де з’явилися нові програми підтримки.',
    url: 'https://example.com/economy-recovery',
    image:
      'https://placehold.co/600x400?text=%D0%95%D0%BA%D0%BE%D0%BD%D0%BE%D0%BC%D1%96%D0%BA%D0%B0',
    publishedAt: new Date().toISOString(),
    source: { name: 'Економічні Вісті', url: 'https://example.com' },
  },
  {
    title: 'Спорт: юні таланти готуються до чемпіонату',
    description: 'Команда підлітків тренується перед змаганнями національного рівня.',
    content:
      'Тренери розповіли про програму підготовки, яка має на меті виявити нові спортивні зірки.',
    url: 'https://example.com/sports-championship',
    image: 'https://placehold.co/600x400?text=%D0%A1%D0%BF%D0%BE%D1%80%D1%82',
    publishedAt: new Date().toISOString(),
    source: { name: 'Спортивний UA', url: 'https://example.com' },
  },
];

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

export const getTopHeadlines = async (category?: string): Promise<Article[]> => {
  try {
    const articles = await loadStaticHeadlines(category);
    cacheTopHeadlines(articles);
    return articles;
  } catch (error) {
    console.warn(
      'Static GNews data request failed, falling back to cached or static content:',
      error
    );
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
