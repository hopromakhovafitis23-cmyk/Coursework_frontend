import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import type { Article } from '../types';
import CommentsSection from '../components/CommentsSection';

export default function ArticlePage() {
  const location = useLocation();
  const article = (location.state as { article?: Article })?.article ?? null;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!article) {
    return (
      <div className="text-center py-16 text-gray-300">
        <h2 className="text-2xl font-bold text-red-400 mb-4">Статтю не знайдено.</h2>
        <p>Будь ласка, поверніться на головну сторінку та виберіть новину.</p>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto font-serif">
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white font-sans">
          {article.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-gray-400">
          <span>
            Джерело:{' '}
            <a
              href={article.source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-indigo-400 hover:underline"
            >
              {article.source.name}
            </a>
          </span>
          <span>
            Дата:{' '}
            <span className="font-medium text-gray-300">
              {new Date(article.publishedAt).toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      <img
        src={article.image || 'https://placehold.co/1200x600/1e293b/ffffff?text=News'}
        alt={article.title}
        className="w-full h-auto max-h-[500px] object-cover rounded-lg shadow-lg mb-8"
      />

      <div className="prose dark:prose-invert max-w-none text-lg leading-relaxed text-gray-300 mb-8">
        <p>{article.description}</p>
        <p>{article.content}</p>
      </div>

      <a
        href={article.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block w-full text-center px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors text-lg"
      >
        Читати повну статтю на {article.source.name}
      </a>

      {/* Pass article URL as a unique key for comments */}
      <CommentsSection articleId={article.url} />
    </article>
  );
}
