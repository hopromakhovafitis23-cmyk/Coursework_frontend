import { useState, useEffect } from 'react';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface Comment {
  id: string;
  author: string;
  text: string;
  date: string;
}

interface CommentsSectionProps {
  articleId: string; // Now using URL or title as ID
}

export default function CommentsSection({ articleId }: CommentsSectionProps) {
  const storageKey = `comments_${encodeURIComponent(articleId)}`;
  const { user } = useAuth();

  const [comments, setComments] = useState<Comment[]>([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const storedComments = localStorage.getItem(storageKey);
    if (storedComments) {
      try {
        setComments(JSON.parse(storedComments));
      } catch (e) {
        console.error('Failed to parse comments from localStorage', e);
        setComments([]);
      }
    } else {
      setComments([]);
    }
  }, [storageKey]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Увійдіть, щоб залишити коментар.');
      return;
    }
    if (!text.trim()) {
      setError('Коментар не може бути порожнім.');
      return;
    }

    const newComment: Comment = {
      id: crypto.randomUUID(),
      author: user.nickname,
      text: text.trim(),
      date: new Date().toISOString(),
    };

    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem(storageKey, JSON.stringify(updatedComments));
    setText('');
    setError('');
  };

  return (
    <div className="mt-12 bg-gray-800/50 p-6 rounded-lg shadow-inner">
      <h3 className="text-2xl font-bold mb-6 text-white font-sans">Обговорення</h3>

      {user ? (
        <form onSubmit={handleSubmit} className="mb-8 space-y-4">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full px-4 py-2 border border-gray-700 rounded-lg bg-gray-900 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-serif"
            placeholder="Напишіть ваш коментар..."
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Відправити
          </button>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-indigo-900/20 text-indigo-300 rounded-lg border border-indigo-800 text-center">
          <Link to="/login" className="font-bold underline hover:text-white">
            Увійдіть
          </Link>
          , щоб залишити коментар.
        </div>
      )}

      <div className="space-y-6">
        {comments.length > 0 ? (
          comments
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((comment) => (
              <div
                key={comment.id}
                className="p-4 bg-gray-900 rounded-lg border border-gray-700/50"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-white font-sans">{comment.author}</span>
                  <span className="text-xs text-gray-400">{formatDate(comment.date)}</span>
                </div>
                <p className="text-gray-300 whitespace-pre-wrap font-serif">{comment.text}</p>
              </div>
            ))
        ) : (
          <p className="text-gray-400 text-center">Коментарів ще немає. Будьте першим!</p>
        )}
      </div>
    </div>
  );
}
