require("dotenv").config();
const axiosInstance = require("../lib/axios.lib");

const getActors = async (movieId) => {
  try {
    if (!movieId) {
      throw new Error("Invalid movieId provided.");
    }
    // Call the TMDb credits API
    const response = await axiosInstance.get(
      `/movie/${movieId}/credits?api_key=${process.env.API_KEY}`
    );

    // Filter actors
    const actors = response.data?.cast
      ?.filter((person) => person.known_for_department === "Acting")
      .map((actor) => actor.name);

    return actors.slice(0, 5) || [];
  } catch (error) {
    console.error(
      `Error fetching actors for movieId ${movieId}:`,
      error.message
    );
  }
};

const searhMovies = async (query) => {
  try {
    const response = await axiosInstance.get(
      `/search/movie?query=${query}&api_key=${process.env.API_KEY}`
    );

    const data = response.data.results;

    if (!data || data.length === 0) {
      console.log("No movies found for query:", query);
      return [];
    }
    const movies = data.map((movie) => {
      return {
        title: movie.title,
        tmdbId: movie.id,
        genre: movie.genre_ids.join(","),
        releaseYear: movie.release_date
          ? movie.release_date.split("-")[0]
          : null,
        rating: movie.vote_average,
        description: movie.overview,
      };
    });
    return movies;
  } catch (error) {
    console.error("Error fetching movies from TMDb API:", error.message);
  }
};

const searchAndFormatMovies = async (query) => {
  try {
    console.log("Searching movies for query:", query);

    const movies = await searhMovies(query);

    if (movies.length === 0) {
      console.log("No movies found for query:", query);
      return [];
    }
    const moviesWithActors = await Promise.all(
      movies.map(async (movie) => {
        const actors = await getActors(movie.tmdbId);
        return { ...movie, actors };
      })
    );

    return moviesWithActors;
  } catch (error) {
    console.error("Error in searchAndFormatMovies:", error.message);
  }
};

const searhMoviesByQuery = async (req, res) => {
  const query = req.query.query;
  try {
    const movies = await searchAndFormatMovies(query);
    res.json({ movies });
  } catch (error) {
    console.error("Error in searhMoviesByQuery:", error.message);
    return res.status(500).json({ error: "Error while fetching movies" });
  }
};
module.exports = {
  searhMoviesByQuery,
  getActors,
  searchAndFormatMovies,
  searhMovies,
};
