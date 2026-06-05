/**
 * Converts a flat array of comments into a nested tree structure.
 * If the input is already a tree (detected by existing replies), it returns it as-is.
 *
 * @param {Array} comments - Flat array or tree of comment objects.
 * @returns {Array} Nested tree of comments.
 */
export const nestComments = (comments) => {
  if (!comments || !Array.isArray(comments) || comments.length === 0) {
    return [];
  }

  // Check if it's already a tree structure
  // If any comment has a non-empty replies array, we assume it's already nested
  const isAlreadyNested = comments.some(
    (comment) => comment.replies && Array.isArray(comment.replies) && comment.replies.length > 0
  );

  if (isAlreadyNested) {
    return comments;
  }

  const commentMap = {};
  const nestedComments = [];

  // Initialize the map with copies of comments and an empty replies array
  comments.forEach((comment) => {
    commentMap[comment.id] = { ...comment, replies: [] };
  });

  comments.forEach((comment) => {
    if (comment.parentId && commentMap[comment.parentId]) {
      // If it has a parent and the parent exists in our map, add it to the parent's replies
      commentMap[comment.parentId].replies.push(commentMap[comment.id]);
    } else {
      // If it doesn't have a parent (or parent not found), it's a top-level comment
      nestedComments.push(commentMap[comment.id]);
    }
  });

  // Sort by date (oldest first)
  const sortByDate = (a, b) => new Date(a.createdAt) - new Date(b.createdAt);

  nestedComments.sort(sortByDate);

  // Recursively sort replies
  const sortReplies = (comment) => {
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.sort(sortByDate);
      comment.replies.forEach(sortReplies);
    }
  };

  nestedComments.forEach(sortReplies);

  return nestedComments;
};
