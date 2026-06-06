import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import type { Article } from '../types';
import NewsCard from '../components/NewsCard';

export default function SavedArticles() {
  const { user } = useAuth();
  const [savedArticles, setSavedArticles] = useState<Article[]>([]);

  const loadSavedArticles = useCallback(() => {
    if (!user) {
      setSavedArticles([]);
      return;
    }

    const stored = localStorage.getItem(`bookmarks_${user.id}`);
    if (stored) {
      try {
        setSavedArticles(JSON.parse(stored));
        return;
      } catch (e) {
        console.error('Failed to parse saved articles', e);
      }
    }

    setSavedArticles([]);
  }, [user]);

  useEffect(() => {
    loadSavedArticles();
  }, [loadSavedArticles]);

  if (!user) {
    return (
      <div className="text-center py-16 text-gray-300">
        <h2 className="text-2xl font-bold text-white mb-4">Будь ласка, увійдіть у систему</h2>
        <p className="mb-6">Лише авторизовані користувачі можуть переглядати збережені статті.</p>
        <Link
          to="/login"
          className="inline-block px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
        >
          Увійти
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold text-white font-sans">Збережені статті</h1>

      {savedArticles.length === 0 ? (
        <div className="text-center py-12 text-gray-400 bg-gray-800 rounded-lg shadow-sm">
          <p className="text-lg mb-4">Ви ще не зберегли жодної статті.</p>
          <Link
            to="/news"
            className="inline-block px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
          >
            Читати новини
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedArticles.map((article) => (
            <NewsCard
              key={article.url}
              article={article}
              variant="grid"
              onBookmarkToggle={loadSavedArticles}
            />
          ))}
        </div>
      )}
    </div>
  );
}
