import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import useAuthStore from '../store/authStore';

export default function VoteButton({ threadId, initialUpvotes = 0, initialDownvotes = 0, initialUserVote = 0, className = "" }) {
  const { token } = useAuthStore();
  const navigate = useNavigate();
  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  const [userVote, setUserVote] = useState(initialUserVote); // 1 for upvote, -1 for downvote, 0 for none
  const [isLoading, setIsLoading] = useState(false);

  const handleVote = async (voteType) => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await api.post('/api/votes', {
        threadId,
        type: voteType === 'upvote' ? 'UPVOTE' : 'DOWNVOTE',
      });

      // Update state based on backend response
      // Backend returns { action: 'created' | 'updated' | 'deleted' }
      const result = response.data?.data;

      // Fallback: Toggle logic since API doesn't return the full updated state
      if (voteType === 'upvote') {
          if (userVote === 1) {
            setUserVote(0);
            setUpvotes(prev => prev - 1);
          } else if (userVote === -1) {
            setUserVote(1);
            setUpvotes(prev => prev + 1);
            setDownvotes(prev => prev - 1);
          } else {
            setUserVote(1);
            setUpvotes(prev => prev + 1);
          }
        } else if (voteType === 'downvote') {
          if (userVote === -1) {
            setUserVote(0);
            setDownvotes(prev => prev - 1);
          } else if (userVote === 1) {
            setUserVote(-1);
            setDownvotes(prev => prev + 1);
            setUpvotes(prev => prev - 1);
          } else {
            setUserVote(-1);
            setDownvotes(prev => prev + 1);
          }
        }
    } catch (err) {
      console.error('Failed to vote:', err);
      // Optional: Show error message to user
    } finally {
      setIsLoading(false);
    }
  };

  const totalScore = upvotes - downvotes;

  return (
    <div className={`flex items-center space-x-1 bg-gray-100 p-1 px-2 rounded-md ${className}`}>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleVote('upvote');
        }}
        className={`hover:bg-gray-200 rounded p-1 transition-colors ${userVote === 1 ? 'text-orange-600' : 'text-gray-500'}`}
        disabled={isLoading}
        title="Upvote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={userVote === 1 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      <span className={`font-bold text-sm min-w-[1.5rem] text-center ${userVote === 1 ? 'text-orange-600' : userVote === -1 ? 'text-blue-600' : 'text-gray-700'}`}>
        {totalScore}
      </span>

      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          handleVote('downvote');
        }}
        className={`hover:bg-gray-200 rounded p-1 transition-colors ${userVote === -1 ? 'text-blue-600' : 'text-gray-500'}`}
        disabled={isLoading}
        title="Downvote"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={userVote === -1 ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
    </div>
  );
}
