import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import NewsFeed from './pages/NewsFeed';
import ArticlePage from './pages/ArticlePage';
import Blog from './pages/Blog';
import Contacts from './pages/Contacts';
import Login from './pages/Login';
import Register from './pages/Register';
import SavedArticles from './pages/SavedArticles';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="news" element={<NewsFeed />} />
        <Route path="article/:id" element={<ArticlePage />} />
        <Route path="blog" element={<Blog />} />
        <Route path="contacts" element={<Contacts />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route
          path="saved"
          element={
            <ProtectedRoute>
              <SavedArticles />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
