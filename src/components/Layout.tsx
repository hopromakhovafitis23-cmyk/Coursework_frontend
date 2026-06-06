import { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo.png';

const pageTitles: Record<string, string> = {
  '/': 'Головна - Новинний Портал',
  '/news': 'Стрічка новин - Новинний Портал',
  '/saved': 'Збережене - Новинний Портал',
  '/blog': 'Колонки - Новинний Портал',
  '/contacts': 'Контакти - Новинний Портал',
  '/login': 'Вхід - Новинний Портал',
  '/register': 'Реєстрація - Новинний Портал',
};

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (location.pathname.startsWith('/article/')) {
      document.title = 'Стаття - Новинний Портал';
    } else {
      document.title = pageTitles[location.pathname] || 'Новинний Портал';
    }
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <header className="bg-gray-800 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center flex-wrap gap-4">
          <Link to="/">
            <img src={logo} alt="Logo" className="h-10 md:h-12 object-contain" />
          </Link>
          <nav>
            <ul className="flex flex-wrap items-center space-x-6">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition-colors">
                  Головна
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-indigo-400 transition-colors">
                  Стрічка новин
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/saved" className="hover:text-indigo-400 transition-colors">
                    Збережене
                  </Link>
                </li>
              )}
              <li>
                <Link to="/blog" className="hover:text-indigo-400 transition-colors">
                  Колонки
                </Link>
              </li>
              <li>
                <Link to="/contacts" className="hover:text-indigo-400 transition-colors">
                  Контакти
                </Link>
              </li>
            </ul>
          </nav>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="font-medium text-gray-200">Вітаємо, {user.nickname}!</span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-900/20 text-red-300 hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  Вийти
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-indigo-400 hover:underline">
                  Вхід
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
                >
                  Реєстрація
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="bg-gray-800 text-center py-4 text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} Новинний Портал. Усі права захищені.</p>
      </footer>
    </div>
  );
}
