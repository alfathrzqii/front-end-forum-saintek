import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ThreadCard from '../components/ThreadCard';
import SubforumSidebar from '../components/SubforumSidebar';
import { ThreadCardSkeleton, SubforumSidebarSkeleton, SubforumBannerSkeleton } from '../components/Skeleton';
import useAuthStore from '../store/authStore';

export default function SubforumDetail() {
  const { token } = useAuthStore();
  const { slug } = useParams();
  const [subforum, setSubforum] = useState(null);
  const [threads, setThreads] = useState([]);
  const [subforums, setSubforums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSubforumData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch subforum details, all subforums (for sidebar), and threads for this subforum
        const [subforumRes, subforumsRes, threadsRes] = await Promise.all([
          api.get(`/subforums/${slug}`),
          api.get('/subforums'),
          api.get('/threads', { params: { subforum: slug } })
        ]);

        const subforumData = subforumRes.data?.data;
        const subforumsListData = subforumsRes.data?.data || [];
        const threadsData = threadsRes.data?.data || [];

        setSubforum(subforumData);
        setSubforums(subforumsListData);
        setThreads(threadsData);
      } catch (err) {
        console.error('Failed to fetch subforum data:', err);
        if (err.response?.status === 404) {
          setError('Subforum tidak ditemukan.');
        } else {
          setError('Gagal memuat detail subforum. Silakan coba lagi nanti.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSubforumData();
  }, [slug]);

  const handleDeleteThread = (deletedThreadId) => {
    setThreads((prevThreads) => prevThreads.filter((t) => t.id !== deletedThreadId));
  };

  if (error || (!loading && !subforum)) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error || 'Subforum not found.'}</span>
        </div>
        <Link to="/" className="text-blue-600 hover:underline">Return to Home</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Subforum Banner */}
      {loading ? (
        <SubforumBannerSkeleton />
      ) : (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm mb-8 overflow-hidden transition-colors duration-200">
          <div className="h-24 bg-blue-600"></div>
          <div className="px-6 py-4 flex flex-col md:flex-row md:items-end -mt-12 md:-mt-8 gap-4">
            <div className="bg-white dark:bg-gray-800 p-2 rounded-full border-4 border-white dark:border-gray-800 shadow-md inline-block transition-colors duration-200">
              <div className="bg-blue-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold transition-colors duration-200">
                s/
              </div>
            </div>
            <div className="mb-2">
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">s/{subforum.name}</h1>
              <p className="text-gray-600 dark:text-gray-400">{subforum.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row-reverse gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/3 order-1 lg:order-2">
          <div className="sticky top-8">
            {loading ? (
              <SubforumSidebarSkeleton />
            ) : (
              <>
                <SubforumSidebar subforums={subforums} />
                <div className="hidden lg:block mt-4 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm transition-colors duration-200">
                  <h3 className="font-bold text-sm mb-2 dark:text-gray-100">About s/{subforum.name}</h3>
                  <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    {subforum.description || `Welcome to the ${subforum.name} subforum!`}
                  </p>
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Main Content: Thread List */}
        <div className="w-full lg:w-2/3 order-2 lg:order-1">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
              {loading ? (
                <div className="h-7 w-48 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                `Threads in s/${subforum.name}`
              )}
            </h2>
            {!loading && token && (
              <Link
                to={`/create-thread?subforum=${subforum.slug}`}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-bold transition duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Create Thread
              </Link>
            )}
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <ThreadCardSkeleton key={i} />
              ))}
            </div>
          ) : threads.length > 0 ? (
            <div className="space-y-4">
              {threads.map((thread) => (
                <ThreadCard
                  key={thread.id}
                  thread={thread}
                  onDelete={handleDeleteThread}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-800 p-8 rounded-md shadow text-center border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <p className="text-gray-500 dark:text-gray-400">No threads yet in this subforum. Why not start one?</p>
              <Link
                to={`/create-thread?subforum=${subforum.slug}`}
                className="inline-block mt-4 text-blue-600 dark:text-blue-400 font-bold hover:underline"
              >
                Create the first thread
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
