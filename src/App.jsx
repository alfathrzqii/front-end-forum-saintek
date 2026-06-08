import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateThread from './pages/CreateThread';
import ThreadDetail from './pages/ThreadDetail';
import SubforumDetail from './pages/SubforumDetail';
import Navbar from './components/Navbar';
import useThemeStore from './store/themeStore';
import { useEffect } from 'react';

function App() {
  const { theme } = useThemeStore();

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-thread" element={<CreateThread />} />
            <Route path="/subforums/:slug" element={<SubforumDetail />} />
            <Route path="/threads/:id" element={<ThreadDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
