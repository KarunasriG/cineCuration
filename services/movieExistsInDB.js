const { movie: movieModel } = require("../models");
async function movieExistsInDB(id) {
  const movie = await movieModel.findOne({ where: { tmdbId: id } });
  return movie !== null;
}

module.exports = { movieExistsInDB };
