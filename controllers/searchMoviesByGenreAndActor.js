const { movie: movieModel } = require("../models");
const { Op, Sequelize } = require("sequelize");
const { c } = require("../services/genreMapping");

const searchMoviesByGenreAndActor = async (req, res) => {
  try {
    const { genre, actor } = req.query;
    if (!genre || !actor) {
      return res
        .status(400)
        .json({ message: "Please provide both genre and actor" });
    }
    const genreId = genres.find((g) => g.name === genre).id;
    const movies = await movieModel.findAll({
      where: {
        genre: { [Sequelize.Op.like]: `%${genreId}%` },
        actors: {
          [Sequelize.Op.like]: `%${actor}%`,
        },
      },
      raw: true,
    });

    if (movies.length === 0) {
      return res
        .status(404)
        .json({ message: "No movies found with the given genre and actor" });
    }

    for (let movie of movies) {
      movie.genre = await genreMapping(movie.genre);
    }

    return res.json({ movies });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ error: "Error while fetching movies", error: error.message });
  }
};

module.exports = { searchMoviesByGenreAndActor };
