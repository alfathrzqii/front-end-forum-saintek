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
    <div className="flex items-center justify-center py-16 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 transition-colors duration-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-gray-100 mb-8">Login</h2>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-800/50 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-4 transition-colors duration-200" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="identifier">
              Email or Username
            </label>
            <input
              id="identifier"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              placeholder="Email or username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-colors duration-200"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 dark:text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline font-medium">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}
