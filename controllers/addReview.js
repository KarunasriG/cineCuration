const { movie: movieModel, review: reviewModel } = require("../models");
const validateReview = require("../validations/validateReview");

const addReview = async (req, res) => {
  const errors = validateReview(req.body);
  if (errors) {
    return res.status(400).json({ errors });
  }
  try {
    const { rating, reviewText } = req.body;
    const id = req.params.movieId;
    const movie = await movieModel.findByPk(id);
    if (!movie) {
      return res.status(404).json({ message: "Movie not found" });
    }

    const review = await reviewModel.create({
      movieId: movie.id,
      rating,
      reviewText,
    });
    return res.status(201).json({ message: "Review added successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error while adding review", error: error.message });
  }
};

module.exports = { addReview };
