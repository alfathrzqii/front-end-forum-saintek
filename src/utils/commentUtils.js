/**
 * Converts a flat array of comments into a nested tree structure.
 *
 * @param {Array} comments - Flat array of comment objects.
 * @returns {Array} Nested tree of comments.
 */
export const nestComments = (comments) => {
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

  // Sort by date (oldest first or newest first depending on preference, here we'll keep API order or sort by date)
  // Most forums prefer oldest first for readability of conversation flow
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
