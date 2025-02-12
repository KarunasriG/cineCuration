module.exports = (sequelize, DataTypes) => {
  const movie = sequelize.define("movie", {
    title: DataTypes.STRING,
    tmdbId: DataTypes.INTEGER, // TMDB movie ID
    genre: DataTypes.TEXT,
    actors: DataTypes.TEXT,
    releaseYear: DataTypes.INTEGER,
    rating: DataTypes.FLOAT, // From TMDB
    description: DataTypes.TEXT,
  });

  return movie;
};
