import { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function CommentItem({ comment, threadId, onCommentPosted, depth = 0, isThreadAnonymous = false }) {
  const { token } = useAuthStore();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    if (!replyContent.trim()) return;

    setSubmitting(true);
    try {
      await api.post('/comments', {
        threadId,
        content: replyContent.trim(),
        parentId: comment.id,
      });
      setReplyContent('');
      setIsReplying(false);
      if (onCommentPosted) {
        onCommentPosted();
      }
    } catch (err) {
      console.error('Failed to post reply:', err);
      alert('Failed to post reply. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const authorName = isThreadAnonymous ? 'anonymous' : (comment.author?.username || 'anonymous');

  return (
    <div className={`mt-4 ${depth > 0 ? 'ml-2 md:ml-6 border-l-2 border-blue-50 pl-4' : ''}`}>
      <div className="group transition-all duration-200 hover:border-l-2 hover:border-blue-200 -ml-4 pl-4">
        <div className="flex items-center text-xs text-gray-500 mb-2">
          <span className="font-bold text-gray-900 mr-2">u/{authorName}</span>
          <span>•</span>
          <span className="ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
        </div>

        <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap mb-2">
          {comment.content}
        </div>

        <div className="flex items-center space-x-4 mb-4">
          {token && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-xs font-bold text-gray-500 hover:text-blue-600 flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mb-4 animate-fadeIn">
            <form onSubmit={handleReplySubmit}>
              <textarea
                className="w-full px-3 py-2 text-sm border-2 border-gray-100 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-gray-50 resize-none outline-none"
                placeholder={`Reply to u/${authorName}...`}
                rows="3"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
              ></textarea>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-4 py-1 text-xs font-bold text-gray-500 hover:text-gray-700 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !replyContent.trim()}
                  className={`px-4 py-1 bg-blue-600 text-white text-xs font-bold rounded-full hover:bg-blue-700 transition ${submitting || !replyContent.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Posting...' : 'Post Reply'}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Recursive replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              threadId={threadId}
              onCommentPosted={onCommentPosted}
              depth={depth + 1}
              isThreadAnonymous={isThreadAnonymous}
            />
          ))}
        </div>
      )}
    </div>
  );
}
