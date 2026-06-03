import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';

export default function ThreadDetail() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/threads/${id}`);
        const threadData = response.data?.data?.thread || response.data?.thread || response.data;
        setThread(threadData);
      } catch (err) {
        console.error('Failed to fetch thread:', err);
        setError('Failed to load thread details. It may have been deleted or doesn\'t exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchThread();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !thread) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error || 'Thread not found.'}</span>
        </div>
        <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  const { title, body, createdAt, user, subforum } = thread;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          {/* Header Info */}
          <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
            {subforum && (
              <Link to={`/subforums/${subforum.slug}`} className="font-bold text-gray-900 hover:underline">
                s/{subforum.name}
              </Link>
            )}
            <span>•</span>
            <span>Posted by u/{user?.username || 'anonymous'}</span>
            <span>•</span>
            <span>{new Date(createdAt).toLocaleString()}</span>
          </div>

          {/* Thread Content */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{title}</h1>

          <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap mb-8">
            {body}
          </div>

          {/* Action Bar (Simple) */}
          <div className="flex items-center space-x-4 text-gray-500 text-sm border-t border-gray-100 pt-4">
             <div className="flex items-center space-x-1 bg-gray-100 p-1 px-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              <span className="font-bold">Vote</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            <div className="flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-bold">Comments</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comment Section Placeholder */}
      <div className="mt-6 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-900">Comments</h3>
        <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-10 text-center text-gray-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <p className="text-lg font-medium">Comment section is coming soon!</p>
          <p className="text-sm mt-2">You will be able to join the discussion in the next update.</p>
        </div>
      </div>
    </div>
  );
}
