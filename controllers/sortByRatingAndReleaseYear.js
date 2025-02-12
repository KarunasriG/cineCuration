const {
  movie: movieModel,
  watchlist: watchlistModel,
  wishlist: wishlistModel,
  curatedList: curatedListModel,
  review: reviewModel,
} = require("../models");
const { Op } = require("sequelize");

const sortByRatingAndReleaseYear = async (req, res) => {
  const { list, sortBy = "rating", order = "ASC" } = req.query;

  try {
    if (list === "watchlist") {
      // Fetch movies from the watchlist
      const watchlistMovies = await watchlistModel.findAll({ raw: true });
      const movieIds = watchlistMovies.map((movie) => movie.movieId);

      // Fetch movies based on IDs and sort them
      const moviesList = await movieModel.findAll({
        where: { id: { [Op.in]: movieIds } },
        order: [[sortBy, order.toUpperCase()]],
        raw: true,
      });

      if (moviesList.length === 0) {
        return res
          .status(404)
          .json({ message: "No movies found in the watchlist" });
      }

      // Fetch reviews for the movies
      const reviews = await reviewModel.findAll({
        where: { movieId: { [Op.in]: movieIds } },
        raw: true,
      });

      // Group reviews by movieId for efficient mapping
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
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error while fetching movies", error: error.message });
  }
};

module.exports = { sortByRatingAndReleaseYear };
