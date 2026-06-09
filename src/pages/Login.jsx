import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);
  const setRefreshToken = useAuthStore((state) => state.setRefreshToken);
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Login to get token
      const loginResponse = await api.post('/authentications', { identifier, password });
      const { accessToken, refreshToken } = loginResponse.data.data;

      // 2. Save tokens to Zustand
      setToken(accessToken);
      setRefreshToken(refreshToken);

      // 3. Fetch user profile
      const userResponse = await api.get('/users/me');
      const userData = userResponse.data.data;

      // 4. Save user data to Zustand
      setUser(userData);

      // 5. Redirect to home
      navigate('/');
    } catch (err) {
      if (err.response) {
        // Error yang dikirim dari server
        setError(err.response.data?.message || `Gagal login. Server merespon dengan status ${err.response.status}.`);
      } else if (err.request) {
        // Tidak ada respon dari server
        setError('Tidak dapat terhubung ke server. Silakan periksa koneksi internet Anda.');
      } else {
        // Kesalahan lainnya
        setError('Maaf, terjadi kesalahan saat mencoba masuk.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-plm-cream px-4 bg-grid">
      <div className="max-w-md w-full bg-white border-2 border-plm-charcoal rounded-[40px] shadow-[12px_12px_0px_0px_rgba(33,33,33,1)] p-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-8 text-2xl opacity-20 select-none">🔑</div>

        <h2 className="text-4xl font-serif font-bold text-center text-plm-charcoal mb-10 lowercase tracking-tight">welcome back<span className="text-plm-olive">.</span></h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-plm-charcoal text-[10px] uppercase tracking-widest font-bold mb-3 ml-1" htmlFor="identifier">
              Email or Username
            </label>
            <input
              id="identifier"
              type="text"
              className="w-full px-5 py-4 border-2 border-plm-charcoal rounded-2xl focus:outline-none focus:bg-plm-cream transition-colors font-medium text-sm"
              placeholder="Your email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-plm-charcoal text-[10px] uppercase tracking-widest font-bold mb-3 ml-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-5 py-4 border-2 border-plm-charcoal rounded-2xl focus:outline-none focus:bg-plm-cream transition-colors font-medium text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-plm-pink border-2 border-plm-charcoal text-plm-charcoal font-bold py-4 px-4 rounded-full uppercase tracking-[0.2em] text-xs hover:bg-plm-charcoal hover:text-white transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Wait a sec...' : 'Login'}
          </button>
        </form>

        <p className="mt-10 text-center text-plm-charcoal/60 text-[10px] uppercase tracking-widest font-bold">
          New here?{' '}
          <Link to="/register" className="text-plm-charcoal hover:text-plm-olive underline underline-offset-4 decoration-2 decoration-plm-pink">
            Join The Club
          </Link>
        </p>
      </div>
    </div>
  );
}
