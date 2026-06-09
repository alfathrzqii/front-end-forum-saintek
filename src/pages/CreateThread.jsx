import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function CreateThread() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subforumSlug, setSubforumSlug] = useState('');
  const [subforums, setSubforums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prefilledSubforum = searchParams.get('subforum');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchSubforums = async () => {
      try {
        const response = await api.get('/subforums');
        const subforumsData = response.data?.data || [];
        setSubforums(subforumsData);

        if (prefilledSubforum && subforumsData.some(s => s.slug === prefilledSubforum)) {
          setSubforumSlug(prefilledSubforum);
        } else if (subforumsData.length > 0) {
          setSubforumSlug(subforumsData[0].slug);
        }
      } catch (err) {
        console.error('Failed to fetch subforums:', err);
        setError('Failed to load subforums. Please refresh the page.');
      }
    };

    fetchSubforums();
  }, [token, navigate, prefilledSubforum]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError('Title is required and cannot be empty.');
      return;
    }

    if (!content.trim()) {
      setError('Content is required and cannot be empty.');
      return;
    }

    if (!subforumSlug) {
      setError('Please select a subforum.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/threads', {
        title: title.trim(),
        content: content.trim(),
        subforumSlug: subforumSlug,
      });

      const newThreadId = response.data?.data?.id;

      if (newThreadId) {
        navigate(`/threads/${newThreadId}`);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create thread. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white border-2 border-plm-charcoal rounded-[40px] shadow-[12px_12px_0px_0px_rgba(33,33,33,1)] p-10 relative overflow-hidden">
        {/* Decorative element */}
        <div className="absolute top-4 right-8 text-3xl opacity-20 select-none">✍️</div>

        <h1 className="text-4xl font-serif font-bold mb-10 text-plm-charcoal lowercase italic tracking-tight">create a new thread<span className="text-plm-pink">.</span></h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label htmlFor="subforum" className="block text-[10px] uppercase tracking-widest font-bold text-plm-charcoal mb-3 ml-1">
              Choose a club
            </label>
            <select
              id="subforum"
              value={subforumSlug}
              onChange={(e) => setSubforumSlug(e.target.value)}
              className="w-full px-5 py-4 border-2 border-plm-charcoal rounded-2xl focus:outline-none focus:bg-plm-cream appearance-none bg-white transition-colors font-medium text-sm"
              required
            >
              <option value="" disabled>Select a subforum</option>
              {subforums.map((subforum) => (
                <option key={subforum.id} value={subforum.slug}>
                  s/{subforum.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-[10px] uppercase tracking-widest font-bold text-plm-charcoal mb-3 ml-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-5 py-4 border-2 border-plm-charcoal rounded-2xl focus:outline-none focus:bg-plm-cream transition-colors font-medium text-sm"
              required
              maxLength={255}
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-[10px] uppercase tracking-widest font-bold text-plm-charcoal mb-3 ml-1">
              Content
            </label>
            <textarea
              id="content"
              rows="8"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-5 py-4 border-2 border-plm-charcoal rounded-2xl focus:outline-none focus:bg-plm-cream transition-colors font-medium text-sm"
              required
            ></textarea>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-8 py-3 text-[10px] font-bold uppercase tracking-widest text-plm-charcoal/60 hover:text-plm-charcoal transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`bg-plm-pink border-2 border-plm-charcoal text-plm-charcoal px-10 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-plm-charcoal hover:text-white transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Hold on...' : 'Post Thread'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
