import { useState, useEffect, type MouseEvent } from 'react';
import type { Article } from '../types';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';

interface BookmarkButtonProps {
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  isSaved: boolean;
}

function BookmarkButton({ onClick, isSaved }: BookmarkButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`absolute top-2 right-2 p-2 rounded-full shadow-md z-10 transition-colors ${
        isSaved
          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
          : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700 hover:text-white'
      }`}
      aria-label={isSaved ? 'Видалити зі збережених' : 'Зберегти'}
      title={isSaved ? 'Видалити зі збережених' : 'Зберегти'}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill={isSaved ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-5 h-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
        />
      </svg>
    </button>
  );
}

interface NewsCardProps {
  article: Article;
  variant?: 'hero' | 'grid' | 'list';
  onBookmarkToggle?: () => void;
}

export default function NewsCard({ article, variant = 'grid', onBookmarkToggle }: NewsCardProps) {
  const placeholderImage = 'https://placehold.co/600x400/1e293b/ffffff?text=News';
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (user) {
      const saved = localStorage.getItem(`bookmarks_${user.id}`);
      if (saved) {
        try {
          const bookmarks = JSON.parse(saved);
          setIsSaved(bookmarks.some((a: Article) => a.url === article.url));
        } catch {
          // ignore
        }
      }
    }
  }, [user, article.url]);

  const handleSaveToggle = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent navigating to the article link
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    const key = `bookmarks_${user.id}`;
    const saved = localStorage.getItem(key);
    let bookmarks: Article[] = saved ? JSON.parse(saved) : [];

    if (isSaved) {
      bookmarks = bookmarks.filter((a) => a.url !== article.url);
    } else {
      bookmarks.push(article);
    }

    localStorage.setItem(key, JSON.stringify(bookmarks));
    setIsSaved(!isSaved);
    onBookmarkToggle?.();
  };

  const articleLink = `/article/${encodeURIComponent(article.url)}`;

  if (variant === 'hero') {
    return (
      <div className="relative group block w-full h-[400px] rounded-lg overflow-hidden shadow-2xl">
        <Link to={articleLink} state={{ article }} className="absolute inset-0 z-0">
          <img
            src={article.image || placeholderImage}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent"></div>
        </Link>
        <div className="absolute bottom-0 left-0 p-6 pointer-events-none z-10 w-full pr-16">
          <span className="text-sm font-semibold text-indigo-300 uppercase tracking-wider">
            {article.source.name}
          </span>
          <h2 className="text-3xl font-extrabold text-white mt-2 line-clamp-3">{article.title}</h2>
        </div>
        {user && <BookmarkButton onClick={handleSaveToggle} isSaved={isSaved} />}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="relative group flex items-center gap-4 p-2 rounded-lg hover:bg-gray-800/50 transition-colors">
        <Link
          to={articleLink}
          state={{ article }}
          className="flex items-center gap-4 w-full h-full"
        >
          <img
            src={article.image || placeholderImage}
            alt={article.title}
            className="w-24 h-24 object-cover rounded-md flex-shrink-0"
          />
          <div className="flex-grow pr-8">
            <h3 className="text-base font-bold text-white line-clamp-2 group-hover:text-indigo-400">
              {article.title}
            </h3>
            <span className="text-xs text-gray-400 mt-1 block">
              {formatDate(article.publishedAt)}
            </span>
          </div>
        </Link>
        {user && <BookmarkButton onClick={handleSaveToggle} isSaved={isSaved} />}
      </div>
    );
  }

  // Default 'grid' variant
  return (
    <div className="relative group block rounded-lg overflow-hidden bg-gray-800 shadow-lg hover:shadow-indigo-500/20 transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col">
      <Link to={articleLink} state={{ article }} className="flex flex-col h-full">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={article.image || placeholderImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex flex-col flex-grow">
          <span className="text-xs font-semibold text-indigo-400 uppercase">
            {article.source.name}
          </span>
          <h2 className="text-lg font-bold text-white mt-2 mb-2 flex-grow line-clamp-3">
            {article.title}
          </h2>
          <p className="text-sm text-gray-400 line-clamp-3 mb-4">{article.description}</p>
          <div className="text-xs text-gray-500 mt-auto pt-2 border-t border-gray-700 pr-8">
            {formatDate(article.publishedAt)}
          </div>
        </div>
      </Link>
      {user && <BookmarkButton onClick={handleSaveToggle} isSaved={isSaved} />}
    </div>
  );
}
