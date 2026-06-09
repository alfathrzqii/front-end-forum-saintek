import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, LogIn, UserPlus } from 'lucide-react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

export default function Navbar() {
  const { token, refreshToken, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [subforums, setSubforums] = useState([]);

  useEffect(() => {
    const fetchSubforums = async () => {
      try {
        const res = await api.get('/subforums');
        setSubforums(res.data?.data || []);
      } catch (err) {
        console.error('Failed to fetch subforums:', err);
      }
    };
    fetchSubforums();
  }, []);

  // Close drawers on route change
  useEffect(() => {
    const closeDrawers = () => {
      setIsDrawerOpen(false);
      setIsProfileOpen(false);
    };
    closeDrawers();
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await api.delete('/authentications', { data: { refreshToken } });
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      logout();
      setIsProfileOpen(false);
      navigate('/login');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <>
      <nav className="bg-plm-cream border-b border-plm-charcoal/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              {/* Hamburger Menu - Mobile Only */}
              <button
                onClick={() => setIsDrawerOpen(true)}
                className="md:hidden mr-3 p-2 text-plm-charcoal hover:bg-plm-charcoal/5 rounded-full transition-colors"
                aria-label="Open subforums menu"
              >
                <Menu size={24} />
              </button>

              <Link to="/" className="text-2xl md:text-3xl font-serif font-bold text-plm-charcoal lowercase tracking-tight whitespace-nowrap">
                forum saintek<span className="text-plm-olive">.</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8 uppercase text-xs font-bold tracking-widest text-plm-charcoal/60">
              <Link to="/" className="hover:text-plm-charcoal transition-colors">Home</Link>
              <Link to="/subforums/saintekfess" className="hover:text-plm-charcoal transition-colors">Fess</Link>
            </div>

            {/* Desktop & Mobile Profile Action */}
            <div className="flex items-center">
              {/* Mobile Profile Icon */}
              <button
                onClick={() => setIsProfileOpen(true)}
                className="md:hidden flex items-center justify-center w-10 h-10 border-2 border-plm-charcoal bg-plm-pink rounded-full shadow-[4px_4px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all overflow-hidden"
              >
                {token && user ? (
                  <span className="text-xs font-bold text-plm-charcoal">{getInitials(user.fullName || user.username)}</span>
                ) : (
                  <User size={20} className="text-plm-charcoal" />
                )}
              </button>

              {/* Desktop Auth Buttons */}
              <div className="hidden md:flex items-center space-x-4">
                {token && user ? (
                  <>
                    <span className="text-sm font-medium">Hi, {user.username || user.name}</span>
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
        </div>
      </nav>

      {/* Mobile Subforum Drawer (Left Side) */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-plm-charcoal/40 backdrop-blur-sm"
            onClick={() => setIsDrawerOpen(false)}
          />
          {/* Drawer Content */}
          <div className="absolute top-0 left-0 bottom-0 w-4/5 max-w-xs bg-plm-cream border-r-4 border-plm-charcoal shadow-[10px_0px_0px_0px_rgba(33,33,33,0.1)] flex flex-col animate-slideRight">
            <div className="p-6 border-b-2 border-plm-charcoal flex justify-between items-center bg-plm-pink">
              <h2 className="text-xl font-serif font-bold text-plm-charcoal lowercase italic">popular clubs</h2>
              <button onClick={() => setIsDrawerOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {subforums.length > 0 ? (
                <ul className="space-y-2">
                  {subforums.map((subforum) => (
                    <li key={subforum.id}>
                      <Link
                        to={`/subforums/${subforum.slug}`}
                        className="flex items-center p-4 bg-white border-2 border-plm-charcoal rounded-2xl shadow-[4px_4px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                      >
                        <span className="text-plm-charcoal font-bold text-xs uppercase tracking-widest">{subforum.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-10 opacity-50 italic text-sm">
                  No subforums found
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Profile Bottom Sheet */}
      {isProfileOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-plm-charcoal/40 backdrop-blur-sm"
            onClick={() => setIsProfileOpen(false)}
          />
          {/* Bottom Sheet Content */}
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t-4 border-plm-charcoal rounded-t-[40px] shadow-[0px_-10px_0px_0px_rgba(33,33,33,0.1)] flex flex-col p-8 pb-12 animate-slideUp">
            <div className="w-12 h-1.5 bg-plm-charcoal/10 rounded-full mx-auto mb-8" />

            {token && user ? (
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-plm-light-green border-2 border-plm-charcoal rounded-[24px]">
                  <div className="w-16 h-16 bg-plm-pink border-2 border-plm-charcoal rounded-full flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(33,33,33,1)]">
                    <span className="text-xl font-bold text-plm-charcoal">{getInitials(user.fullName || user.username)}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-serif font-bold text-plm-charcoal">{user.fullName || user.name}</h3>
                    <p className="text-xs font-bold text-plm-charcoal/50 uppercase tracking-widest">@{user.username}</p>
                  </div>
                </div>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-3 border-2 border-plm-charcoal bg-plm-pink text-plm-charcoal px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-2xl font-serif font-bold text-plm-charcoal text-center mb-6 lowercase italic">Join the club<span className="text-plm-olive">.</span></h3>
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center space-x-3 border-2 border-plm-charcoal bg-white text-plm-charcoal px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  <LogIn size={18} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="w-full flex items-center justify-center space-x-3 border-2 border-plm-charcoal bg-plm-pink text-plm-charcoal px-6 py-4 rounded-full text-xs font-bold uppercase tracking-widest shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  <UserPlus size={18} />
                  <span>Join The Club</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
