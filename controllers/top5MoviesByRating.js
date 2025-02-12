const { movie: movieModel, review: reviewModel } = require("../models");
const { Op } = require("sequelize");
const top5MoviesByRating = async (req, res) => {
  try {
    const moviesList = await movieModel.findAll({
      where: { rating: { [Op.gt]: 5 } },
      order: [["rating", "DESC"]],
      limit: 5,
    });

    const movieIds = moviesList.map((movie) => movie.id);

    if (moviesList.length === 0) {
      return res.status(404).json({ message: "No movies found" });
    }

    // Fetch reviews for the movies
    const reviews = await reviewModel.findAll({
      where: { movieId: { [Op.in]: movieIds } },
      raw: true,
    });

    const reviewsByMovie = reviews.reduce((acc, review) => {
      if (!acc[review.movieId]) {
        acc[review.movieId] = [];
      }
      acc[review.movieId].push({
        text: review.reviewText,
        wordCount: review.reviewText.split(" ").length,
      });
      return acc;
    }, {});

    // Combine movie data with their respective reviews
    const combinedData = moviesList.map((movie) => {
      return {
        title: movie.title,
        rating: movie.rating,
        reviews: reviewsByMovie[movie.id] || [],
      };
    });

    return res.json({ movies: combinedData });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error while fetching top 5 movies",
      error: error.message,
    });
  }
};

module.exports = { top5MoviesByRating };
