import { Link } from 'react-router-dom';

export default function ThreadCard({ thread }) {
  const { id, title, body, createdAt, user, subforum } = thread;

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm hover:border-gray-400 transition-colors duration-200 mb-4 overflow-hidden">
      <Link to={`/threads/${id}`} className="block p-4">
        <div className="flex items-center text-xs text-gray-500 mb-2 space-x-2">
          {subforum && (
            <span className="font-bold text-gray-900 hover:underline">
              s/{subforum.name}
            </span>
          )}
          <span>•</span>
          <span>Posted by u/{user?.username || 'anonymous'}</span>
          <span>•</span>
          <span>{new Date(createdAt).toLocaleDateString()}</span>
        </div>

        <h2 className="text-lg font-semibold text-gray-900 mb-2">{title}</h2>

        <p className="text-gray-700 text-sm line-clamp-3 mb-4">
          {body}
        </p>

        <div className="flex items-center space-x-4 text-gray-500 text-xs font-bold">
          <div className="flex items-center space-x-1 bg-gray-100 p-1 px-2 rounded-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
            <span>Vote</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>

          <div className="flex items-center space-x-1 hover:bg-gray-100 p-1 px-2 rounded-sm transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>Comments</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
