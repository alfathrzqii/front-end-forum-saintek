import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [prodi, setProdi] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await api.post('/users', { 
        username, 
        email, 
        password,
        fullName,
        prodi 
      });
      navigate('/login');
    } catch (err) {
      if (err.response) {
        // Error yang dikirim dari server (misal: validasi gagal)
        setError(err.response.data?.message || `Terjadi kesalahan pada server (${err.response.status}).`);
      } else if (err.request) {
        // Tidak ada respon dari server
        setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      } else {
        // Kesalahan lainnya
        setError('Maaf, terjadi kesalahan saat memproses pendaftaran Anda.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-plm-cream px-4 py-12 bg-grid">
      <div className="max-w-md w-full bg-white border-2 border-plm-charcoal rounded-[40px] shadow-[12px_12px_0px_0px_rgba(33,33,33,1)] p-10 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-4 right-8 text-2xl opacity-20 select-none">✨</div>

        <h2 className="text-4xl font-serif font-bold text-center text-plm-charcoal mb-10 lowercase tracking-tight">join the club<span className="text-plm-olive">.</span></h2>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-plm-charcoal text-[10px] uppercase tracking-widest font-bold mb-2 ml-1" htmlFor="fullName">
              Full Name
            </label>
            <input
              id="fullName"
              type="text"
              className="w-full px-4 py-3 border-2 border-plm-charcoal rounded-2xl focus:outline-none focus:bg-plm-cream transition-colors font-medium text-sm"
              placeholder="Your full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-plm-charcoal text-[10px] uppercase tracking-widest font-bold mb-2 ml-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className="w-full px-4 py-3 border-2 border-plm-charcoal rounded-2xl focus:outline-none focus:bg-plm-cream transition-colors font-medium text-sm"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-plm-charcoal text-[10px] uppercase tracking-widest font-bold mb-2 ml-1" htmlFor="prodi">
                Prodi
              </label>
              <input
                id="prodi"
                type="text"
                className="w-full px-4 py-3 border-2 border-plm-charcoal rounded-2xl focus:outline-none focus:bg-plm-cream transition-colors font-medium text-sm"
                placeholder="Sains Data"
                value={prodi}
                onChange={(e) => setProdi(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-plm-charcoal text-[10px] uppercase tracking-widest font-bold mb-2 ml-1" htmlFor="email">
              Email (University Domain)
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-3 border-2 border-plm-charcoal rounded-2xl focus:outline-none focus:bg-plm-cream transition-colors font-medium text-sm"
              placeholder="227611001@mhs.uinsaid.ac.id"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-plm-charcoal text-[10px] uppercase tracking-widest font-bold mb-2 ml-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-3 border-2 border-plm-charcoal rounded-2xl focus:outline-none focus:bg-plm-cream transition-colors font-medium text-sm"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-plm-light-green border-2 border-plm-charcoal text-plm-charcoal font-bold py-4 px-4 rounded-full uppercase tracking-[0.2em] text-xs hover:bg-plm-charcoal hover:text-white transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Hold on...' : 'Register'}
          </button>
        </form>

        <p className="mt-8 text-center text-plm-charcoal/60 text-[10px] uppercase tracking-widest font-bold">
          Already a member?{' '}
          <Link to="/login" className="text-plm-charcoal hover:text-plm-olive underline underline-offset-4 decoration-2 decoration-plm-pink">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}
