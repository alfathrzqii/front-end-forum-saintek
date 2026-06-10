import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { canDeleteThread } from '../utils/auth';
import VoteButton from './VoteButton';
import Modal from './Modal';

export default function ThreadCard({ thread, onDelete }) {
  const { id, title, content, createdAt, author, subforum, _count } = thread;
  const upvotes = _count?.votes || 0; // Backend currently only gives total votes in _count
  const downvotes = 0; 
  const userVote = null;
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showCopied, setShowCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteError, setDeleteError] = useState(null);

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

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteError(null);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    try {
      await api.delete(`/threads/${id}`);
      setShowDeleteModal(false);
      if (onDelete) {
        onDelete(id);
      }
    } catch (err) {
      console.error('Failed to delete thread:', err);
      setDeleteError(err.response?.data?.message || 'Failed to delete thread. Please try again.');
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

  const cardColors = ['bg-plm-pink', 'bg-plm-blue', 'bg-plm-light-green', 'bg-white'];
  const cardColor = cardColors[id % cardColors.length];

  return (
    <>
      <div
        className={`${cardColor} border-2 border-plm-charcoal rounded-[32px] shadow-[8px_8px_0px_0px_rgba(33,33,33,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all duration-300 mb-8 overflow-hidden cursor-pointer`}
        onClick={handleCardClick}
      >
        {deleteError && (
          <div className="bg-red-50 border-b border-red-100 p-2 text-xs text-red-600 flex justify-between items-center">
            <span>{deleteError}</span>
            <button onClick={(e) => { e.stopPropagation(); setDeleteError(null); }} className="text-red-400 hover:text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className="p-8">
          <div className="flex items-center text-[10px] uppercase tracking-widest text-plm-charcoal/60 mb-4 space-x-2 font-bold">
            {subforum && (
              <Link to={`/subforums/${subforum.slug}`} className="bg-plm-charcoal text-white px-2 py-0.5 rounded-full hover:opacity-80 transition-opacity">
                {subforum.name}
              </Link>
            )}
            <span>•</span>
            <span>Posted by {subforum?.slug === 'saintekfess' ? 'anonymous' : (author?.username || 'anonymous')}</span>
            <span>•</span>
            <span>{new Date(createdAt).toLocaleDateString()}</span>
          </div>

          <Link to={`/threads/${id}`} className="block">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-plm-charcoal mb-4 hover:text-plm-olive transition-colors leading-tight">{title}</h2>
          </Link>

          <p className="text-plm-charcoal/80 text-sm md:text-base mb-6 leading-relaxed line-clamp-3">
            {content}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-plm-charcoal text-[10px] font-bold uppercase tracking-widest">
            <VoteButton
              threadId={id}
              initialUpvotes={upvotes}
              initialDownvotes={downvotes}
              initialUserVote={userVote}
              className="rounded-sm"
            />

            <Link to={`/threads/${id}`} className="flex items-center space-x-1 border-2 border-plm-charcoal bg-white px-3 py-1 rounded-full hover:bg-plm-charcoal hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>{_count?.comments || 0} Comments</span>
            </Link>

            <button
              onClick={handleShare}
              className="flex items-center space-x-1 border-2 border-plm-charcoal bg-white px-3 py-1 rounded-full hover:bg-plm-charcoal hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 relative"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span>{showCopied ? 'Copied!' : 'Share'}</span>
            </button>

            {canDelete && (
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`flex items-center space-x-1 border-2 border-red-500 bg-white text-red-500 px-3 py-1 rounded-full hover:bg-red-500 hover:text-white transition-all shadow-[2px_2px_0px_0px_rgba(239,68,68,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>

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
    </>
  );
}
