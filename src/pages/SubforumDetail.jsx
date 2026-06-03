import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import ThreadCard from '../components/ThreadCard';
import SubforumSidebar from '../components/SubforumSidebar';

export default function SubforumDetail() {
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

        // Fetch subforum details and all subforums (for sidebar)
        const [subforumRes, subforumsRes, threadsRes] = await Promise.all([
          api.get(`/api/subforums/${slug}`),
          api.get('/api/subforums'),
          api.get('/api/threads')
        ]);

        const subforumData = subforumRes.data?.data?.subforum || subforumRes.data?.subforum || subforumRes.data;
        const subforumsListData = subforumsRes.data?.data?.subforums || subforumsRes.data?.subforums || (Array.isArray(subforumsRes.data) ? subforumsRes.data : []);
        const allThreadsData = threadsRes.data?.data?.threads || threadsRes.data?.threads || (Array.isArray(threadsRes.data) ? threadsRes.data : []);

        setSubforum(subforumData);
        setSubforums(subforumsListData);

        // Filter threads belonging to this subforum
        // We assume thread has subforum object or subforumId
        const filteredThreads = allThreadsData.filter(thread =>
          thread.subforum?.slug === slug || thread.subforumId === subforumData.id
        );

        setThreads(filteredThreads);
      } catch (err) {
        console.error('Failed to fetch subforum data:', err);
        setError('Failed to load subforum details. It may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubforumData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !subforum) {
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
      <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-8 overflow-hidden">
        <div className="h-24 bg-blue-600"></div>
        <div className="px-6 py-4 flex flex-col md:flex-row md:items-end -mt-12 md:-mt-8 gap-4">
          <div className="bg-white p-2 rounded-full border-4 border-white shadow-md inline-block">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
              s/
            </div>
          </div>
          <div className="mb-2">
            <h1 className="text-2xl font-extrabold text-gray-900">s/{subforum.name}</h1>
            <p className="text-gray-600">{subforum.description}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content: Thread List */}
        <div className="w-full lg:w-2/3">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-900">Threads in s/{subforum.name}</h2>
          </div>

          {threads.length > 0 ? (
            <div className="space-y-4">
              {threads.map((thread) => (
                <ThreadCard key={thread.id} thread={thread} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-md shadow text-center border border-gray-200">
              <p className="text-gray-500">No threads yet in this subforum. Why not start one?</p>
              <Link
                to="/create-thread"
                className="inline-block mt-4 text-blue-600 font-bold hover:underline"
              >
                Create the first thread
              </Link>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="w-full lg:w-1/3">
          <div className="sticky top-8">
            <SubforumSidebar subforums={subforums} />
            <div className="mt-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm">
              <h3 className="font-bold text-sm mb-2">About s/{subforum.name}</h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {subforum.description || `Welcome to the ${subforum.name} subforum!`}
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
