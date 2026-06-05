import { Link, useNavigate } from 'react-router-dom';
import VoteButton from './VoteButton';

export default function ThreadCard({ thread }) {
  const { id: threadId, title, content, createdAt, author, subforum, _count } = thread;
  const upvotes = _count?.votes || 0; // Backend currently only gives total votes in _count
  const downvotes = 0; 
  const userVote = null;
  const navigate = useNavigate();

  const handleCardClick = (e) => {
    // Navigate to thread detail if the click wasn't on a link or button
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }
    navigate(`/threads/${threadId}`);
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
          <span>Posted by u/{author?.username || 'anonymous'}</span>
          <span>•</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>

        <Link to={`/threads/${threadId}`} className="block">
          <h2 className="text-lg font-semibold text-gray-900 mb-2 hover:underline">{title}</h2>
        </Link>

        <p className="text-gray-700 text-sm line-clamp-3 mb-4">
          {content}
        </p>

        <div className="flex items-center space-x-4 text-gray-500 text-xs font-bold">
          <VoteButton
            threadId={threadId}
            initialUpvotes={upvotes}
            initialDownvotes={downvotes}
            initialUserVote={userVote}
            className="rounded-sm"
          />

          <Link to={`/threads/${threadId}`} className="flex items-center space-x-1 hover:bg-gray-100 p-1 px-2 rounded-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Comments</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
