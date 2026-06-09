import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../services/api';

export default function Navbar() {
  const { token, refreshToken, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.delete('/authentications', { data: { refreshToken } });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      logout();
      navigate('/login');
    }
  };

  return (
    <nav className="bg-plm-cream border-b border-plm-charcoal/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center">
            <Link to="/" className="text-3xl font-serif font-bold text-plm-charcoal lowercase tracking-tight">
              saintek<span className="text-plm-olive">.</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8 uppercase text-xs font-bold tracking-widest text-plm-charcoal/60">
            <Link to="/" className="hover:text-plm-charcoal transition-colors">Home</Link>
            <Link to="/subforums/saintekfess" className="hover:text-plm-charcoal transition-colors">Fess</Link>
          </div>
          <div className="flex items-center space-x-4">
            {token && user ? (
              <>
                <span className="text-sm font-medium hidden sm:inline">Hi, {user.username || user.name}</span>
                <button
                  onClick={handleLogout}
                  className="border-2 border-plm-charcoal bg-plm-pink text-plm-charcoal px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-plm-charcoal hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-xs font-bold uppercase tracking-widest hover:text-plm-olive transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="border-2 border-plm-charcoal bg-plm-pink text-plm-charcoal px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-plm-charcoal hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
                >
                  Join The Club
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
