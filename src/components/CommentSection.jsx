import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { nestComments } from '../utils/commentUtils';
import CommentItem from './CommentItem';
import { CommentSkeleton } from './Skeleton';

export default function CommentSection({ threadId, isThreadAnonymous = false }) {
  const { token, user: currentUser } = useAuthStore();
  const [flatComments, setFlatComments] = useState([]);
  const [nestedComments, setNestedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/comments/thread/${threadId}`);
        const data = response.data?.data || [];
        setFlatComments(data);
        setNestedComments(nestComments(data));
        setError(null);
      } catch (err) {
        console.error('Failed to fetch comments:', err);
        setError('Could not load comments. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [threadId]);

  const refreshComments = async () => {
    try {
      const response = await api.get(`/comments/thread/${threadId}`);
      const data = response.data?.data || [];
      setFlatComments(data);
      setNestedComments(nestComments(data));
    } catch (err) {
      console.error('Failed to refresh comments:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/comments', {
        threadId,
        content: newComment.trim(),
      });
      setNewComment('');
      setIsExpanded(false);
      refreshComments(); // Refresh comments after posting
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div id="comments-section" className="mt-8 bg-white border-2 border-plm-charcoal rounded-[40px] shadow-[8px_8px_0px_0px_rgba(33,33,33,1)] p-8 overflow-hidden">
      <h3 className="text-2xl font-serif font-bold mb-8 text-plm-charcoal lowercase italic flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-plm-pink fill-plm-pink" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Comments ({flatComments.length})
      </h3>

      {/* Comment Form */}
      {token ? (
        <form onSubmit={handleSubmit} className="mb-10">
          <div className="mb-4">
            <label htmlFor="comment" className="sr-only">Your comment</label>
            <textarea
              id="comment"
              rows={isExpanded || newComment.trim() ? 4 : 1}
              onFocus={() => setIsExpanded(true)}
              onBlur={() => { if(!newComment.trim()) setIsExpanded(false); }}
              className="w-full px-6 py-4 border-2 border-plm-charcoal rounded-3xl focus:outline-none focus:bg-plm-cream bg-white resize-none transition-all duration-300 font-medium text-sm shadow-[4px_4px_0px_0px_rgba(33,33,33,1)]"
              placeholder={`Write a comment as ${currentUser?.username || 'user'}...`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
          </div>
          {(isExpanded || newComment.trim()) && (
            <div className="flex justify-end animate-fadeIn">
              <button
                type="submit"
                disabled={submitting || !newComment.trim()}
                className={`bg-plm-pink border-2 border-plm-charcoal text-plm-charcoal px-8 py-3 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-plm-charcoal hover:text-white transition-all duration-300 shadow-[4px_4px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${submitting || !newComment.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {submitting ? 'Hold on...' : 'Post Comment'}
              </button>
            </div>
          )}
        </form>
      ) : (
        <div className="bg-plm-cream border-2 border-dashed border-plm-charcoal/30 rounded-3xl p-6 mb-10 text-center">
          <p className="text-plm-charcoal/60 text-[10px] uppercase tracking-widest font-bold">
            Please <Link to="/login" className="text-plm-charcoal underline decoration-plm-pink decoration-2 underline-offset-2">Login</Link> or <Link to="/register" className="text-plm-charcoal underline decoration-plm-pink decoration-2 underline-offset-2">Register</Link> to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-6 py-4">
          {[1, 2, 3].map((i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">{error}</div>
      ) : nestedComments.length > 0 ? (
        <div className="space-y-4">
          {nestedComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              threadId={threadId}
              onCommentPosted={refreshComments}
              isThreadAnonymous={isThreadAnonymous}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-gray-500 italic">
          No comments yet. Be the first to share your thoughts!
        </div>
      )}
    </div>
  );
}
