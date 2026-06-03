import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function CreateThread() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [subforumId, setSubforumId] = useState('');
  const [subforums, setSubforums] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { token } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchSubforums = async () => {
      try {
        const response = await api.get('/api/subforums');
        const subforumsData = response.data?.data?.subforums || response.data?.subforums || (Array.isArray(response.data) ? response.data : []);
        setSubforums(subforumsData);
        if (subforumsData.length > 0) {
          setSubforumId(subforumsData[0].id);
        }
      } catch (err) {
        console.error('Failed to fetch subforums:', err);
        setError('Failed to load subforums. Please refresh the page.');
      }
    };

    fetchSubforums();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subforumId) {
      setError('Please select a subforum.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/api/threads', {
        title,
        body,
        subforumId: Number(subforumId),
      });

      const newThreadId = response.data?.data?.threadId || response.data?.threadId || response.data?.id;

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
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-900">Create a New Thread</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="subforum" className="block text-sm font-medium text-gray-700 mb-1">
              Choose a subforum
            </label>
            <select
              id="subforum"
              value={subforumId}
              onChange={(e) => setSubforumId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>Select a subforum</option>
              {subforums.map((subforum) => (
                <option key={subforum.id} value={subforum.id}>
                  s/{subforum.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              maxLength={255}
            />
          </div>

          <div>
            <label htmlFor="body" className="block text-sm font-medium text-gray-700 mb-1">
              Content
            </label>
            <textarea
              id="body"
              rows="8"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Share your thoughts..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isLoading ? 'Posting...' : 'Post Thread'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
