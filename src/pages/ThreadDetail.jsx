import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { canDeleteThread } from '../utils/auth';
import VoteButton from '../components/VoteButton';
import CommentSection from '../components/CommentSection';
import { ThreadDetailSkeleton } from '../components/Skeleton';
import Modal from '../components/Modal';

export default function ThreadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/threads/${id}`);
        const threadData = response.data?.data;
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
    return <ThreadDetailSkeleton />;
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

  const { id: threadId, title, content, createdAt, author, subforum, _count } = thread;
  const upvotes = _count?.votes || 0;
  const downvotes = 0;
  const userVote = null;

  const canDelete = canDeleteThread(currentUser, thread);

  const handleShare = () => {
    const threadUrl = window.location.href;
    navigator.clipboard.writeText(threadUrl).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  const handleDelete = () => {
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await api.delete(`/threads/${id}`);
      setShowDeleteModal(false);
      navigate('/');
    } catch (err) {
      console.error('Failed to delete thread:', err);
      setDeleteError(err.response?.data?.message || 'Failed to delete thread. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const scrollToComments = () => {
    document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors duration-200">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back to Home
      </Link>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {deleteError && (
          <div className="bg-red-50 border-b border-red-100 p-3 text-sm text-red-600 flex justify-between items-center">
            <span>{deleteError}</span>
            <button onClick={() => setDeleteError(null)} className="text-red-400 hover:text-red-600 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-6">
          {/* Header Info */}
          <div className="flex items-center text-xs text-gray-500 mb-3 space-x-2">
            {subforum && (
              <Link to={`/subforums/${subforum.slug}`} className="font-bold text-gray-900 hover:underline">
                s/{subforum.name}
              </Link>
            )}
            <span>•</span>
            <span>Posted by u/{subforum?.slug === 'saintekfess' ? 'anonymous' : (author?.username || 'anonymous')}</span>
            <span>•</span>
            <span>{new Date(createdAt).toLocaleString()}</span>
          </div>

          {/* Thread Content */}
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">{title}</h1>

          <div className="text-lg leading-relaxed text-gray-800 whitespace-pre-wrap mb-8">
            {content}
          </div>

          {/* Action Bar */}
          <div className="flex items-center space-x-4 text-gray-500 text-sm border-t border-gray-100 pt-4">
            <VoteButton
              threadId={threadId}
              initialUpvotes={upvotes}
              initialDownvotes={downvotes}
              initialUserVote={userVote}
              className="rounded-full px-4"
            />

            <button
              onClick={scrollToComments}
              className="flex items-center space-x-2 hover:bg-gray-100 p-1 px-2 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="font-bold">{_count?.comments || 0} Comments</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center space-x-2 hover:bg-gray-100 p-1 px-2 rounded transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="font-bold">{showCopied ? 'Copied!' : 'Share'}</span>
            </button>

            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`flex items-center space-x-1 text-red-500 hover:bg-red-50 p-1 px-2 rounded transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span className="font-bold">{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Comment Section */}
      <CommentSection
        threadId={threadId}
        isThreadAnonymous={subforum?.slug === 'saintekfess'}
      />

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Thread"
        confirmLabel="Delete"
        variant="danger"
        isLoading={isDeleting}
      >
        Are you sure you want to delete this thread? This action cannot be undone.
      </Modal>
    </div>
  );
}
