import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import { nestComments } from '../utils/commentUtils';
import CommentItem from './CommentItem';

export default function CommentSection({ threadId, isThreadAnonymous = false }) {
  const { token, user: currentUser } = useAuthStore();
  const [flatComments, setFlatComments] = useState([]);
  const [nestedComments, setNestedComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

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
      refreshComments(); // Refresh comments after posting
    } catch (err) {
      console.error('Failed to post comment:', err);
      alert('Failed to post comment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        Comments ({flatComments.length})
      </h3>

      {/* Comment Form */}
      {token ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="mb-3">
            <label htmlFor="comment" className="sr-only">Your comment</label>
            <textarea
              id="comment"
              rows="3"
              className="w-full px-4 py-3 border-2 border-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 resize-none transition-all duration-200 outline-none"
              placeholder={`Write a comment as u/${currentUser?.username || 'user'}...`}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={submitting || !newComment.trim()}
              className={`px-6 py-2 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition duration-200 ${submitting || !newComment.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-center">
          <p className="text-gray-600">
            Please <Link to="/login" className="text-blue-600 font-bold hover:underline">Login</Link> or <Link to="/register" className="text-blue-600 font-bold hover:underline">Register</Link> to leave a comment.
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
