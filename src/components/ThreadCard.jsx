import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { canDeleteThread } from '../utils/auth';
import VoteButton from './VoteButton';

export default function ThreadCard({ thread, onDelete }) {
  const { id, title, content, createdAt, author, subforum, _count } = thread;
  const upvotes = _count?.votes || 0; // Backend currently only gives total votes in _count
  const downvotes = 0; 
  const userVote = null;
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCopied, setShowCopied] = useState(false);

  const canDelete = canDeleteThread(currentUser, thread);

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const threadUrl = `${window.location.origin}/threads/${id}`;
    navigator.clipboard.writeText(threadUrl).then(() => {
      setShowCopied(true);
      setTimeout(() => setShowCopied(false), 2000);
    });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!window.confirm('Are you sure you want to delete this thread?')) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/threads/${id}`);
      if (onDelete) {
        onDelete(id);
      }
    } catch (err) {
      console.error('Failed to delete thread:', err);
      alert(err.response?.data?.message || 'Failed to delete thread. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCardClick = (e) => {
    // Navigate to thread detail if the click wasn't on a link or button
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    navigate(`/threads/${id}`);
  };

  return (
    <div
      className="bg-white border border-gray-200 rounded-md shadow-sm hover:border-gray-400 transition-colors duration-200 mb-4 overflow-hidden cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="p-4">
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
          {subforum && (
            <Link to={`/subforums/${subforum.slug}`} className="font-bold text-gray-900 hover:underline">
              s/{subforum.name}
            </Link>
          )}
          <span>•</span>
          <span>Posted by u/{subforum?.slug === 'saintekfess' ? 'anonymous' : (author?.username || 'anonymous')}</span>
          <span>•</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>

        <Link to={`/threads/${id}`} className="block">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:underline">{title}</h2>
        </Link>

        <p className="text-gray-700 text-sm mb-4">
          {content?.length > 150 ? (
            <>
              {content.substring(0, 150)}...
              <Link to={`/threads/${id}`} className="text-blue-600 hover:underline ml-1 font-medium">
                view more
              </Link>
            </>
          ) : (
            content
          )}
        </p>

        <div className="flex items-center space-x-4 text-gray-500 text-xs font-bold">
          <VoteButton
            threadId={id}
            initialUpvotes={upvotes}
            initialDownvotes={downvotes}
            initialUserVote={userVote}
            className="rounded-sm"
          />

          <Link to={`/threads/${id}`} className="flex items-center space-x-1 hover:bg-gray-100 p-1 px-2 rounded-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>{_count?.comments || 0} Comments</span>
          </Link>

          <button
            onClick={handleShare}
            className="flex items-center space-x-1 hover:bg-gray-100 p-1 px-2 rounded-sm transition-colors relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
            </svg>
            <span>{showCopied ? 'Copied!' : 'Share'}</span>
          </button>

          {canDelete && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`flex items-center space-x-1 text-red-500 hover:bg-red-50 p-1 px-2 rounded-sm transition-colors ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
