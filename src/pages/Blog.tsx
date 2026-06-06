import { useState, useEffect } from 'react';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  authorId: string;
  authorName: string;
}

export default function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const { user } = useAuth();

  const STORAGE_KEY = 'blog_posts';

  useEffect(() => {
    const savedPosts = localStorage.getItem(STORAGE_KEY);
    if (savedPosts) {
      try {
        setPosts(JSON.parse(savedPosts));
      } catch (e) {
        console.error('Failed to load posts', e);
      }
    }
  }, []);

  const savePosts = (newPosts: BlogPost[]) => {
    setPosts(newPosts);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newPosts));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Ви повинні увійти, щоб створити колонку');
      return;
    }

    if (!title.trim() || !content.trim()) {
      setError('Назва та текст колонки не можуть бути порожніми');
      return;
    }

    const newPost: BlogPost = {
      id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
      title: title.trim(),
      content: content.trim(),
      date: new Date().toISOString(),
      authorId: user.id,
      authorName: user.nickname,
    };

    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);

    setTitle('');
    setContent('');
    setError('');
  };

  const handleDeletePost = (id: string) => {
    const updatedPosts = posts.filter((post) => post.id !== id);
    savePosts(updatedPosts);
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-4xl font-extrabold mb-8 text-white font-sans">Колонки читачів</h1>

      {user ? (
        <div className="bg-gray-800 p-6 rounded-lg shadow-sm mb-12">
          <h2 className="text-2xl font-bold mb-4 text-white font-sans">
            Опублікувати власну колонку
          </h2>
          <form onSubmit={handleCreatePost} className="space-y-4">
            {error && <div className="text-red-500 text-sm mb-2">{error}</div>}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                Назва
              </label>
              <input
                type="text"
                id="title"
                aria-label="Назва"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-sans"
                placeholder="Наприклад: Чому штучний інтелект не замінить журналістів"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-300 mb-1">
                Текст
              </label>
              <textarea
                id="content"
                aria-label="Текст"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-serif"
                placeholder="Напишіть ваші думки тут..."
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
            >
              Опублікувати
            </button>
          </form>
        </div>
      ) : (
        <div className="mb-12 p-4 bg-gray-800 text-gray-200 rounded-lg border border-gray-700">
          Увійдіть в акаунт, щоб мати можливість публікувати авторські колонки.{' '}
          <Link to="/login" className="font-bold underline hover:text-white text-indigo-400">
            Увійти
          </Link>
        </div>
      )}

      {posts.length > 0 ? (
        <div className="space-y-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="p-6 bg-gray-800 rounded-lg shadow-sm border border-gray-700"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1 font-sans">{post.title}</h3>
                  <div className="text-sm text-gray-500 space-x-2">
                    <span className="font-medium text-indigo-400">
                      {post.authorName || 'Анонім'}
                    </span>
                    <span>•</span>
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>
                {user && user.id === post.authorId && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-400 hover:text-red-300 text-sm font-medium px-3 py-1 bg-red-900/20 rounded transition-colors"
                    aria-label="Видалити пост"
                  >
                    Видалити
                  </button>
                )}
              </div>
              <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-wrap text-gray-300 font-serif leading-relaxed">
                  {post.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      ) : (
        user && (
          <p className="text-center text-gray-500 dark:text-gray-400 text-lg font-serif">
            Поки що немає постів. Будьте першим, хто напише авторську колонку!
          </p>
        )
      )}
    </div>
  );
}
