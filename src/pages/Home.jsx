import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ThreadCard from '../components/ThreadCard';
import SubforumSidebar from '../components/SubforumSidebar';
import useAuthStore from '../store/authStore';

export default function Home() {
  const { token } = useAuthStore();
  const [threads, setThreads] = useState([]);
  const [subforums, setSubforums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [threadsRes, subforumsRes] = await Promise.all([
          api.get('/api/threads'),
          api.get('/api/subforums'),
        ]);

        // Handling both possible response structures (direct array or data property)
        const threadsData = threadsRes.data?.data || [];
        const subforumsData = subforumsRes.data?.data || [];

        setThreads(threadsData);
        setSubforums(subforumsData);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content: Feed Thread */}
        <div className="w-full lg:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Recent Threads</h1>
            {token && (
              <Link
                to="/create-thread"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold transition duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Thread
              </Link>
            )}
          </div>
          {threads.length > 0 ? (
            <div className="space-y-4">
              {threads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-md shadow text-center">
              <p className="text-gray-500">No threads found. Be the first to start a conversation!</p>
            </div>
          )}
        </div>

        {/* Sidebar: Subforums */}
        <aside className="w-full lg:w-1/3">
          <div className="sticky top-8">
            <SubforumSidebar subforums={subforums} />
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
              <h3 className="font-bold text-sm mb-2">About Forum SAINTEK</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                Welcome to the SAINTEK community! A place to discuss Science, Technology, Engineering, and Mathematics.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
