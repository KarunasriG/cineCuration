function validateReview(reviewData) {
  const { rating, reviewText } = reviewData;
  if (!rating || !reviewText) {
    return "Missing required fields";
  }

  if (typeof rating === "float" && typeof reviewText === "string") {
    if (!(rating > 0 && rating <= 10)) {
      return "Rating must be between 0 and 10";
    }

    if (reviewText.length > 500) {
      return "Review text must be less than 500 characters";
    }
  }

  return null;
}

module.exports = validateReview;
