import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CreateThread from './pages/CreateThread';
import ThreadDetail from './pages/ThreadDetail';
import SubforumDetail from './pages/SubforumDetail';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
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
