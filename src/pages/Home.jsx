import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ThreadCard from '../components/ThreadCard';
import SubforumSidebar from '../components/SubforumSidebar';
import { ThreadCardSkeleton, SubforumSidebarSkeleton } from '../components/Skeleton';
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
          api.get('/threads'),
          api.get('/subforums'),
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

  const handleDeleteThread = (deletedThreadId) => {
    setThreads((prevThreads) => prevThreads.filter((t) => t.id !== deletedThreadId));
  };

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
      {/* Hero Section */}
      <section className="relative mb-16 py-20 px-8 bg-plm-light-green border-2 border-plm-charcoal rounded-[40px] overflow-hidden bg-grid">
        {/* Decorative "Stickers" */}
        <div className="absolute top-10 left-10 text-4xl transform -rotate-12 select-none">🧪</div>
        <div className="absolute bottom-10 right-20 text-5xl transform rotate-12 select-none">💻</div>
        <div className="absolute top-20 right-40 text-3xl transform -rotate-6 select-none">🚀</div>
        <div className="absolute bottom-20 left-40 text-4xl transform rotate-3 select-none">🧬</div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1 bg-plm-charcoal text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full mb-6">
            Where Science Meets Tech
          </span>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-plm-charcoal leading-[1.1] mb-8">
            the community <br />
            for <span className="italic">saintek</span> students
          </h1>
          <div className="flex flex-wrap justify-center gap-4">
            {!token && (
              <Link
                to="/register"
                className="bg-plm-pink border-2 border-plm-charcoal text-plm-charcoal px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-plm-charcoal hover:text-white transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
              >
                Join The Club
              </Link>
            )}
            <a
              href="#recent-threads"
              className="bg-white border-2 border-plm-charcoal text-plm-charcoal px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-plm-charcoal hover:text-white transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1"
            >
              Explore Feed
            </a>
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-8" id="recent-threads">
        {/* Main Content: Feed Thread */}
        <div className="w-full lg:w-2/3">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-serif font-bold text-plm-charcoal italic underline decoration-plm-pink decoration-8 underline-offset-4">Recent Threads</h2>
            {!loading && token && (
              <Link
                to="/create-thread"
                className="bg-plm-blue border-2 border-plm-charcoal text-plm-charcoal px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-plm-charcoal hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1 flex items-center"
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
              {[1, 2, 3, 4, 5].map((i) => (
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
            <div className="bg-white p-8 rounded-md shadow text-center">
              <p className="text-gray-500">No threads found. Be the first to start a conversation!</p>
            </div>
          )}
        </div>

        {/* Sidebar: Subforums */}
        <aside className="w-full lg:w-1/3">
          <div className="sticky top-8">
            {loading ? (
              <SubforumSidebarSkeleton />
            ) : (
              <SubforumSidebar subforums={subforums} />
            )}
            <div className="mt-6 p-6 bg-plm-light-green border-2 border-plm-charcoal rounded-[32px] shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] relative overflow-hidden">
              <div className="absolute -top-2 -right-2 text-2xl opacity-20 transform rotate-12">🛰️</div>
              <h3 className="font-serif font-bold text-lg mb-3 lowercase italic underline decoration-white decoration-4 underline-offset-2">About Forum SAINTEK</h3>
              <p className="text-[10px] uppercase tracking-widest font-bold text-plm-charcoal/70 leading-loose">
                Welcome to the SAINTEK community! A place to discuss Science, Technology, Engineering, and Mathematics.
              </p>
            </div>

            <div className="mt-6 p-6 bg-white border-2 border-plm-charcoal rounded-[32px] shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] relative overflow-hidden">
              <div className="absolute -top-2 -right-2 text-2xl opacity-20 transform rotate-12">✨</div>
              <h3 className="font-serif font-bold text-lg mb-3 lowercase italic underline decoration-plm-pink decoration-4 underline-offset-2">Credits</h3>
              <p className="text-[10px] uppercase tracking-widest font-bold text-plm-charcoal/70 mb-4 leading-relaxed">
                Dikembangkan untuk memenuhi tugas akhir mata kuliah Komputasi Awan.
              </p>
              <ul className="space-y-2">
                <li>
                  <a href="https://instagram.com/izzanbcy" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest font-bold text-plm-charcoal hover:text-plm-pink transition-colors flex items-center">
                    <span className="mr-2">📸</span> @izzanbcy
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/khaillautami._" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest font-bold text-plm-charcoal hover:text-plm-pink transition-colors flex items-center">
                    <span className="mr-2">📸</span> @khaillautami._
                  </a>
                </li>
                <li>
                  <a href="https://instagram.com/alfathrzqii" target="_blank" rel="noopener noreferrer" className="text-[10px] uppercase tracking-widest font-bold text-plm-charcoal hover:text-plm-pink transition-colors flex items-center">
                    <span className="mr-2">📸</span> @alfathrzqii
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
