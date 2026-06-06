import { useState, useEffect } from 'react';
import { getTopHeadlines } from '../api';
import type { Article } from '../types';
import NewsCard from '../components/NewsCard';
import NewsSkeleton from '../components/NewsSkeleton'; // Assuming this is also refactored
import { Link } from 'react-router-dom';

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const data = await getTopHeadlines();
        setArticles(data);
      } catch (err: any) {
        setError(err.message || 'Не вдалося завантажити головні новини.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchNews();
  }, []);

  const mainArticle = articles[0];
  const sideArticles = articles.slice(1, 5);
  const popularArticles = articles.slice(5, 9);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <NewsSkeleton />
        </div>
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <NewsSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-400 text-lg">{error}</div>;
  }

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <h1 className="text-3xl font-extrabold text-white mb-4 font-sans">Головна новина</h1>
          {mainArticle && <NewsCard article={mainArticle} variant="hero" />}
        </div>

        {/* Side Column */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-4 font-sans">Стрічка новин</h2>
          <div className="space-y-4">
            {sideArticles.map((article) => (
              <NewsCard key={article.url} article={article} variant="list" />
            ))}
          </div>
        </div>
      </div>

      {/* Popular Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-white font-sans">Популярне</h2>
          <Link to="/news" className="text-indigo-400 hover:underline font-medium">
            Дивитись усі &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularArticles.map((article) => (
            <NewsCard key={article.url} article={article} variant="grid" />
          ))}
        </div>
      </div>
    </div>
  );
}
