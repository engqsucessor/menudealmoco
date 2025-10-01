/**
 * Sorts reviews based on the specified sort type
 * @param {Array} reviews - Array of review objects
 * @param {string} sortType - One of: 'recent', 'upvotes', 'rating', 'lowestRating', 'controversial'
 * @returns {Array} Sorted array of reviews
 */
export const sortReviews = (reviews, sortType) => {
  const sortedReviews = [...reviews];

  switch (sortType) {
    case 'recent':
      /**
       * Sort by most recent first
       * Orders reviews by creation date, newest first
       */
      return sortedReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    case 'upvotes':
      /**
       * Sort by net upvotes (upvotes - downvotes)
       * Reviews with highest net score appear first
       */
      return sortedReviews.sort((a, b) => {
        const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
        const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
        return scoreB - scoreA; // Highest score first
      });

    case 'rating':
      /**
       * Sort by highest rating first
       * Uses upvotes as tiebreaker when ratings are equal
       */
      return sortedReviews.sort((a, b) => {
        if (b.rating !== a.rating) {
          return b.rating - a.rating; // Highest rating first
        }
        // If ratings are equal, sort by upvotes as tiebreaker
        const scoreA = (a.upvotes || 0) - (a.downvotes || 0);
        const scoreB = (b.upvotes || 0) - (b.downvotes || 0);
        return scoreB - scoreA;
      });

    case 'lowestRating':
      /**
       * Sort by lowest rating first
       * Uses downvotes as tiebreaker when ratings are equal (most downvoted first)
       */
      return sortedReviews.sort((a, b) => {
        if (a.rating !== b.rating) {
          return a.rating - b.rating; // Lowest rating first
        }
        // If ratings are equal, sort by downvotes (most downvoted first)
        const scoreA = (a.downvotes || 0) - (a.upvotes || 0);
        const scoreB = (b.downvotes || 0) - (b.upvotes || 0);
        return scoreB - scoreA;
      });

    case 'controversial':
      /**
       * Sort by most controversial first
       * Controversial = high engagement (lots of both up and down votes)
       * Primary sort: total votes (upvotes + downvotes)
       * Secondary sort: closer to 50/50 split = more controversial
       */
      return sortedReviews.sort((a, b) => {
        // Controversial = high engagement (lots of both up and down votes)
        const engagementA = (a.upvotes || 0) + (a.downvotes || 0);
        const engagementB = (b.upvotes || 0) + (b.downvotes || 0);

        if (engagementB !== engagementA) {
          return engagementB - engagementA;
        }

        // Secondary sort: closer to 50/50 split = more controversial
        const ratioA = Math.abs(0.5 - ((a.upvotes || 0) / Math.max(1, engagementA)));
        const ratioB = Math.abs(0.5 - ((b.upvotes || 0) / Math.max(1, engagementB)));
        return ratioA - ratioB;
      });

    default:
      return sortedReviews;
  }
};
