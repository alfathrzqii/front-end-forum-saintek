/**
 * Checks if a user has permission to delete a thread.
 *
 * @param {Object} user - The current logged-in user object.
 * @param {Object} thread - The thread object to be deleted.
 * @returns {boolean} - True if the user can delete the thread.
 */
export const canDeleteThread = (user, thread) => {
  if (!user || !thread) return false;

  const isAdmin = user.role === 'ADMIN' || user.role === 'MODERATOR';
  const isOwner = user.id === thread.authorId || user.id === thread.author?.id;

  return isAdmin || isOwner;
};
