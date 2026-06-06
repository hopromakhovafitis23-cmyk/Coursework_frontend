import { useState, useEffect } from 'react';
import { getTopHeadlines, searchArticles } from '../api';
import type { Article, ArticleCategory } from '../types';
import NewsCard from '../components/NewsCard';
import NewsSkeleton from '../components/NewsSkeleton';

const categories: ArticleCategory[] = [
  'general',
  'world',
  'nation',
  'business',
  'technology',
  'entertainment',
  'sports',
  'science',
  'health',
];

const categoryLabels: Record<ArticleCategory, string> = {
  general: 'Головні',
  world: 'Світ',
  nation: 'Україна',
  business: 'Бізнес',
  technology: 'Технології',
  entertainment: 'Розваги',
  sports: 'Спорт',
  science: 'Наука',
  health: "Здоров'я",
};

export default function NewsFeed() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<ArticleCategory>('general');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = searchTerm
          ? await searchArticles(searchTerm)
          : await getTopHeadlines(activeCategory);
        setArticles(data);
      } catch (err: any) {
        setError(err.message || 'Не вдалося завантажити новини.');
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchNews, searchTerm ? 500 : 0);
    return () => clearTimeout(timer);
  }, [activeCategory, searchTerm]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-4xl font-extrabold text-white font-sans">Стрічка новин</h1>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Пошук за ключовим словом..."
          className="w-full md:w-1/3 px-4 py-2 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-700 pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setActiveCategory(cat);
              setSearchTerm(''); // Reset search on category change
            }}
            className={`px-4 py-2 font-semibold rounded-md text-sm transition-colors ${
              activeCategory === cat && !searchTerm
                ? 'bg-indigo-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            {categoryLabels[cat]}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <NewsSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center text-red-400 text-lg">{error}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.url} article={article} variant="grid" />
          ))}
        </div>
      )}
    </div>
  );
}
