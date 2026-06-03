import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ThreadDetail from './pages/ThreadDetail';
import SubforumDetail from './pages/SubforumDetail';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/subforums/:slug" element={<SubforumDetail />} />
        <Route path="/threads/:id" element={<ThreadDetail />} />
      </Routes>
    </Router>
  );
}

export default App;
