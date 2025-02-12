const axiosInstance = require("../lib/axios.lib");

async function fetchMovieAndCastDetails(movieId) {
  const movie = await fetchMovieDetails(movieId);
  const actors = await fetchCastDetails(movieId);
  console.log("Fetch movie and cast details", { ...movie, actors });
  return { ...movie, actors };
}

const fetchMovieDetails = async (movieId) => {
  const response = await axiosInstance.get(
    `/movie/${movieId}?api_key=${process.env.API_KEY}`
  );
  const movie = response.data;
  // console.log("Selected Movie", movie);
  return {
    title: movie.title,
    tmdbId: movie.id,
    genre: movie.genres.map((genre) => genre.id).join(","),
    releaseYear: movie.release_date ? movie.release_date.split("-")[0] : null,
    rating: movie.vote_average,
    description: movie.overview,
  };
};

const fetchCastDetails = async (movieId) => {
  const response = await axiosInstance.get(
    `/movie/${movieId}/credits?api_key=${process.env.API_KEY}`
  );

  // Filter actors
  const actors = response.data?.cast
    ?.filter((person) => person.known_for_department === "Acting")
    .map((actor) => actor.name);

  return actors.slice(0, 5).join(",") || [];
};

module.exports = { fetchMovieAndCastDetails };
