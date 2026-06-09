import { useState } from 'react';
import api from '../services/api';
import useAuthStore from '../store/authStore';
import VoteButton from './VoteButton';

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
    <div className={`mt-6 ${depth > 0 ? 'ml-4 md:ml-10 border-l-2 border-plm-charcoal/10 pl-6' : ''}`}>
      <div className="-ml-6 pl-6">
        <div className="flex items-center text-[10px] uppercase tracking-widest text-plm-charcoal/60 mb-3 font-bold">
          <span className="text-plm-charcoal mr-2">{authorName}</span>
          <span>•</span>
          <span className="ml-2">{new Date(comment.createdAt).toLocaleString()}</span>
        </div>

        <div className="text-plm-charcoal/80 text-sm md:text-base leading-relaxed whitespace-pre-wrap mb-4 font-sans">
          {comment.content}
        </div>

        <div className="flex items-center gap-4 mb-6">
          <VoteButton
            commentId={comment.id}
            initialUpvotes={comment._count?.votes || 0}
            initialDownvotes={0}
            initialUserVote={0}
            className="scale-75 -ml-2 origin-left"
          />

          {token && (
            <button
              onClick={() => setIsReplying(!isReplying)}
              className="text-[10px] uppercase tracking-widest font-bold text-plm-charcoal/60 hover:text-plm-olive flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
              </svg>
              Reply
            </button>
          )}
        </div>

        {isReplying && (
          <div className="mb-6 animate-fadeIn">
            <form onSubmit={handleReplySubmit}>
              <textarea
                className="w-full px-5 py-4 text-sm border-2 border-plm-charcoal rounded-2xl focus:outline-none focus:bg-plm-cream bg-white resize-none shadow-[4px_4px_0px_0px_rgba(33,33,33,1)] transition-all"
                placeholder={`Reply to ${authorName}...`}
                rows="3"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                required
              ></textarea>
              <div className="flex justify-end space-x-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsReplying(false)}
                  className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-plm-charcoal/60 hover:text-plm-charcoal transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !replyContent.trim()}
                  className={`bg-plm-green border-2 border-plm-charcoal text-plm-charcoal px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-plm-charcoal hover:text-white transition-all shadow-[3px_3px_0px_0px_rgba(33,33,33,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 ${submitting || !replyContent.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {submitting ? 'Hold on...' : 'Post Reply'}
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
