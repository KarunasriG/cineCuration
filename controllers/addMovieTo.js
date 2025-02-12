const {
  watchlist: watchlistModel,
  wishlist: wishlistModel,
  curatedList: curatedListModel,
  curatedListItem: curatedListItemModel,
  movie: movieModel,
} = require("../models");
const { movieExistsInDB } = require("../services/movieExistsInDB");
const { fetchMovieAndCastDetails } = require("../services/movieAndCastDetails");

const addToWatchList = async (req, res) => {
  const movieId = req.body.movieId;
  if (!movieId && typeof movieId !== "number") {
    return res.status(400).send({ message: "Movie ID is required" });
  }
  try {
    const movieExists = await movieExistsInDB(movieId);

    let movieDetails;
    if (!movieExists) {
      movieDetails = await fetchMovieAndCastDetails(movieId);
      await movieModel.create(movieDetails);
    } else {
      movieDetails = await movieModel.findOne({ where: { tmdbId: movieId } });
    }

    // console.log(movieDetails);

    await watchlistModel.create({ movieId: movieDetails.id });

    return res
      .status(201)
      .json({ message: "Movie added to watchlist successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error while adding to watchlist",
      error: error.message,
    });
  }
};

const addToWishList = async (req, res) => {
  const movieId = req.body.movieId;
  if (!movieId && typeof movieId !== "number") {
    return res.status(400).send({ message: "Movie ID is required" });
  }
  try {
    const movieExists = await movieExistsInDB(movieId);

    let movieDetails;
    if (!movieExists) {
      movieDetails = await fetchMovieAndCastDetails(movieId);
      await movieModel.create(movieDetails);
    } else {
      movieDetails = await movieModel.findOne({ where: { tmdbId: movieId } });
    }

    await wishlistModel.create({ movieId: movieDetails.id });

    return res
      .status(201)
      .json({ message: "Movie added to wishlist successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Error while adding to wishlist",
      error: error.message,
    });
  }
};

const addToCuratedList = async (req, res) => {
  const { movieId, curatedListId } = req.body;
  if (!movieId || !curatedListId) {
    return res
      .status(400)
      .json({ error: "Missing required fields: movieId or curatedListId" });
  }
  try {
    const movieExists = await movieExistsInDB(movieId);

    let movieDetails;
    if (!movieExists) {
      movieDetails = await fetchMovieAndCastDetails(movieId);
      await movieModel.create(movieDetails);
    } else {
      movieDetails = await movieModel.findOne({ where: { tmdbId: movieId } });
    }

    const curatedList = await curatedListModel.findByPk(curatedListId, {
      raw: true,
    });
    if (!curatedList) {
      // Add the movie to the curated list
      curatedList = await curatedListModel.create({
        name: movieDetails.title,
        slug: movieDetails.title.toLowerCase().replace(/\s+/g, "-"),
        description: movieDetails.description,
      });
    }

    // Check if the movie is already in the curated list
    const existingEntry = await curatedListItemModel.findOne({
      where: { movieId: movieDetails.id, curatedListId: curatedListId },
    });
    if (!existingEntry) {
      await curatedListItemModel.create({
        movieId: movieDetails.id,
        curatedListId: curatedList.id,
      });
    }
    res
      .status(201)
      .json({ message: "Movie added to curated list successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Error while adding to curated list",
      error: error.message,
    });
  }
};
module.exports = { addToWatchList, addToWishList, addToCuratedList };
