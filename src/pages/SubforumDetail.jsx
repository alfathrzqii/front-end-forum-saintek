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
        <div className="bg-plm-blue border-2 border-plm-charcoal rounded-[40px] shadow-[8px_8px_0px_0px_rgba(33,33,33,1)] mb-12 overflow-hidden bg-grid relative">
          <div className="absolute top-4 right-8 text-4xl select-none opacity-20 transform rotate-12">🏷️</div>
          <div className="px-8 py-10 flex flex-col md:flex-row md:items-center gap-6">
            <div className="bg-white border-2 border-plm-charcoal w-20 h-20 rounded-full flex items-center justify-center text-plm-charcoal text-3xl font-serif font-bold shadow-[4px_4px_0px_0px_rgba(33,33,33,1)]">
              {subforum.name.charAt(0).toLowerCase()}
            </div>
            <div>
              <h1 className="text-4xl font-serif font-bold text-plm-charcoal lowercase tracking-tight">s/{subforum.name}</h1>
              <p className="text-plm-charcoal/70 font-medium">{subforum.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main Content: Thread List */}
        <div className="w-full lg:w-2/3">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-serif font-bold text-plm-charcoal italic underline decoration-plm-pink decoration-8 underline-offset-4">
              {loading ? (
                "Loading..."
              ) : (
                `threads in ${subforum.name}`
              )}
            </h2>
            {!loading && token && (
              <Link
                to={`/create-thread?subforum=${subforum.slug}`}
                className="bg-plm-green border-2 border-plm-charcoal text-plm-charcoal px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-plm-charcoal hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center"
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
            <div className="bg-white p-8 rounded-md shadow text-center border border-gray-200">
              <p className="text-gray-500">No threads yet in this subforum. Why not start one?</p>
              <Link
                to={`/create-thread?subforum=${subforum.slug}`}
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
            {loading ? (
              <SubforumSidebarSkeleton />
            ) : (
              <>
                <SubforumSidebar subforums={subforums} />
                <div className="mt-6 p-6 bg-plm-light-green border-2 border-plm-charcoal rounded-[32px] shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] relative overflow-hidden">
                  <div className="absolute -top-2 -right-2 text-2xl opacity-20 transform rotate-12">🏷️</div>
                  <h3 className="font-serif font-bold text-lg mb-3 lowercase italic underline decoration-white decoration-4 underline-offset-2">About s/{subforum.name}</h3>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-plm-charcoal/70 leading-loose">
                    {subforum.description || `Welcome to the ${subforum.name} subforum!`}
                  </p>
                </div>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
