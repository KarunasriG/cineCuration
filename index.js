const express = require("express");
const { sequelize } = require("./models/index");
const { searhMoviesByQuery } = require("./controllers/searchMoviesByQuery");
const {
  createCuratedLists,
  updateCuratedList,
} = require("./controllers/managingCuratedLists");
const {
  addToWatchList,
  addToWishList,
  addToCuratedList,
} = require("./controllers/addMovieTo");
const { addReview } = require("./controllers/addReview");
const {
  searchMoviesByGenreAndActor,
} = require("./controllers/searchMoviesByGenreAndActor");
const {
  sortByRatingAndReleaseYear,
} = require("./controllers/sortByRatingAndReleaseYear");
const { top5MoviesByRating } = require("./controllers/top5MoviesByRating");

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.put("/api/curated-lists/:curatedListId", updateCuratedList);

app.post("/api/curated-lists", createCuratedLists);

app.post("/api/movies/watchlist", addToWatchList);

app.post("/api/movies/wishlist", addToWishList);

app.post("/api/movies/curated-list", addToCuratedList);

app.post("/api/movies/:movieId/reviews", addReview);

app.get("/api/movies/search", searhMoviesByQuery);

app.get("/api/movies/searchByGenreAndActor", searchMoviesByGenreAndActor);

app.get("/api/movies/sort", sortByRatingAndReleaseYear);

app.get("/api/movies/top5", top5MoviesByRating);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = app;
