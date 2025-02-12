const app = require("../index");
const request = require("supertest");
const {
  movie: movieModel,
  review: reviewModel,
  watchlist: watchlistModel,
  wishlist: wishlistModel,
  curatedList: curatedlistModel,
  curatedListItem: curatedlistitemModel,
} = require("../models");

const { addReview } = require("../controllers/addReview");
const { top5MoviesByRating } = require("../controllers/top5MoviesByRating");
const {
  addToWishList,
  addToWatchList,
  addToCuratedList,
} = require("../controllers/addMovieTo");
const { createCuratedLists } = require("../controllers/managingCuratedLists");
const { movieExistsInDB } = require("../services/movieExistsInDB");

const { Op } = require("sequelize");

jest.mock("../models", () => ({
  sequelize: {
    authenticate: jest.fn(() => Promise.resolve()),
    sync: jest.fn(() => Promise.resolve()),
    close: jest.fn(() => Promise.resolve()),
  },
  movie: {
    create: jest.fn(),
    findOne: jest.fn(),
    findByPk: jest.fn(),
    findAll: jest.fn(),
  },
  review: {
    create: jest.fn(),
    findAll: jest.fn(),
  },
  watchlist: {
    create: jest.fn(),
  },
  wishlist: {
    create: jest.fn(),
  },
  curatedList: {
    create: jest.fn(),
    findByPk: jest.fn(),
    findOne: jest.fn(),
  },
  curatedListItem: {
    create: jest.fn(),
    findOne: jest.fn(),
  },
  Sequelize: {
    Op: {
      gt: Symbol("gt"),
      in: Symbol("in"),
    },
  },
}));
jest.mock("../lib/axios.lib", () => ({
  get: jest.fn(),
}));
jest.mock("../services/movieExistsInDB");

describe("Controllers Test (Unit Testing)", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  test("addReview: should add a review", async () => {
    mockReview = {
      rating: 5,
      reviewText: "Great movie!",
    };
    mockMovie = {
      id: 1,
      title: "Movie Title",
      rating: 5,
    };

    const req = { params: { movieId: 1 }, body: mockReview };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    movieModel.findByPk.mockResolvedValue(mockMovie);
    reviewModel.create.mockResolvedValue(mockReview);

    await addReview(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "Review added successfully",
    });
  });

  test("top5MoviesByRating: should return top 5 movies by rating", async () => {
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const req = {};

    const mockMovies = [
      { id: 1, title: "Inception", rating: 9 },
      { id: 2, title: "The Dark Knight", rating: 8.9 },
      { id: 3, title: "Interstellar", rating: 8.7 },
      { id: 4, title: "Dunkirk", rating: 8.4 },
      { id: 5, title: "Memento", rating: 8.2 },
    ];
    const mockReviews = [
      { movieId: 1, reviewText: "Amazing movie!" },
      { movieId: 2, reviewText: "Mind-blowing!" },
      { movieId: 3, reviewText: "Outstanding visuals!" },
      { movieId: 4, reviewText: "Thrilling story!" },
      { movieId: 5, reviewText: "Great movie!" },
    ];

    movieModel.findAll.mockResolvedValue(mockMovies);
    reviewModel.findAll.mockResolvedValue(mockReviews);

    await top5MoviesByRating(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);

    expect(movieModel.findAll).toHaveBeenCalledWith({
      where: { rating: { [Op.gt]: 5 } },
      order: [["rating", "DESC"]],
      limit: 5,
    });
    expect(reviewModel.findAll).toHaveBeenCalledWith({
      where: { movieId: { [Op.in]: [1, 2, 3, 4, 5] } },
      raw: true,
    });

    expect(res.json).toHaveBeenCalledWith({
      movies: [
        {
          title: "Inception",
          rating: 9,
          reviews: [{ text: "Amazing movie!", wordCount: 2 }],
        },
        {
          title: "The Dark Knight",
          rating: 8.9,
          reviews: [{ text: "Mind-blowing!", wordCount: 1 }],
        },
        {
          title: "Interstellar",
          rating: 8.7,
          reviews: [{ text: "Outstanding visuals!", wordCount: 2 }],
        },
        {
          title: "Dunkirk",
          rating: 8.4,
          reviews: [{ text: "Thrilling story!", wordCount: 2 }],
        },
        {
          title: "Memento",
          rating: 8.2,
          reviews: [{ text: "Great movie!", wordCount: 2 }],
        },
      ],
    });
  });

  test("addToWatchList: should add a movie to the watchlist", async () => {
    const req = {
      body: { movieId: 123 },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mockMovie = { tmbdId: 123, title: "Movie Title" };
    movieExistsInDB.mockResolvedValue(true);
    movieModel.findOne.mockResolvedValue(mockMovie);
    watchlistModel.create.mockResolvedValue({});

    await addToWatchList(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "Movie added to watchlist successfully",
    });
  });
  test("addToWishList: should add a movie to the wishlist", async () => {
    const req = {
      body: { movieId: 123 },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const mockMovie = { tmbdId: 123, title: "Movie Title" };
    movieExistsInDB.mockResolvedValue(true);
    movieModel.findOne.mockResolvedValue(mockMovie);
    wishlistModel.create.mockResolvedValue({});

    await addToWishList(req, res);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      message: "Movie added to wishlist successfully",
    });
  });

  test("addToCuratedList: should add a movie to the curated list", async () => {
    const req = {
      body: { movieId: 123, curatedListId: 1 },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockMovie = { tmbdId: 123, title: "Movie Title" };
    const mockCuratedList = {
      id: 1,
      name: "Curated List",
      slug: "curated-list",
      description: "This is a curated list",
    };

    movieExistsInDB.mockResolvedValue(true);
    movieModel.findOne.mockResolvedValue(mockMovie);
    curatedlistModel.findByPk.mockResolvedValue(mockCuratedList);
    curatedlistitemModel.findOne.mockResolvedValue(null);
    curatedlistitemModel.create.mockResolvedValue({});

    await addToCuratedList(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Movie added to curated list successfully",
    });
  });
  test("createCuratedList: should create a curated list", async () => {
    const req = {
      body: {
        name: "Curated List",
        slug: "curated-list",
        description: "This is a curated list",
      },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    const mockCuratedList = {
      id: 1,
      name: "Curated List",
      slug: "curated-list",
      description: "This is a curated list",
    };

    curatedlistModel.create.mockResolvedValue(mockCuratedList);

    await createCuratedLists(req, res);

    expect(curatedlistModel.create).toHaveBeenCalledWith({
      name: "Curated List",
      slug: "curated-list",
      description: "This is a curated list",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Curated list created successfully",
    });
  });
});

describe("API Endpoints Tests (Integration Testing)", () => {
  test("POST: `/api/movies/:movieId/reviews`: should add a review", async () => {
    mockReview = {
      rating: 5,
      reviewText: "Great movie!",
    };
    mockMovie = {
      id: 1,
      title: "Movie Title",
      rating: 5,
    };

    movieModel.findByPk.mockResolvedValue(mockMovie);
    reviewModel.create.mockResolvedValue(mockReview);

    const response = await request(app)
      .post("/api/movies/1/reviews")
      .send({ rating: 5, reviewText: "Great movie!" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "Review added successfully" });
  });

  test("GET: `/api/movies/top5`: should return top 5 movies by rating", async () => {
    const response = await request(app).get("/api/movies/top5");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      movies: [
        {
          title: "Inception",
          rating: 9,
          reviews: [{ text: "Amazing movie!", wordCount: 2 }],
        },
        {
          title: "The Dark Knight",
          rating: 8.9,
          reviews: [{ text: "Mind-blowing!", wordCount: 1 }],
        },
        {
          title: "Interstellar",
          rating: 8.7,
          reviews: [{ text: "Outstanding visuals!", wordCount: 2 }],
        },
        {
          title: "Dunkirk",
          rating: 8.4,
          reviews: [{ text: "Thrilling story!", wordCount: 2 }],
        },
        {
          title: "Memento",
          rating: 8.2,
          reviews: [{ text: "Great movie!", wordCount: 2 }],
        },
      ],
    });
  });

  test("POST: `/api/movies/watchlist`: should add a movie to the watchlist", async () => {
    const mockMovie = {
      id: 1,
      title: "Movie Title",
      tmbdId: 123,
      rating: 8.5,
    };

    movieExistsInDB.mockResolvedValue(true);
    movieModel.findOne.mockResolvedValue(mockMovie);

    watchlistModel.create.mockResolvedValue({});

    const response = await request(app)
      .post("/api/movies/watchlist")
      .send({ movieId: 123 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Movie added to watchlist successfully",
    });
  });

  test("POST: `/api/movies/wishlist`: should add a movie to the wishlist", async () => {
    const mockMovie = {
      id: 1,
      title: "Movie Title",
      tmbdId: 123,
      rating: 8.5,
    };

    movieExistsInDB.mockResolvedValue(true);
    movieModel.findOne.mockResolvedValue(mockMovie);

    wishlistModel.create.mockResolvedValue({});

    const response = await request(app)
      .post("/api/movies/wishlist")
      .send({ movieId: 123 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Movie added to wishlist successfully",
    });
  });
  test("POST: `/api/movies/curated-list`: should add a movie to the wishlist", async () => {
    const mockMovie = {
      id: 1,
      title: "Movie Title",
      tmbdId: 123,
      rating: 8.5,
    };

    const mockCuratedList = {
      id: 1,
      name: "Curated List",
      slug: "curated-list",
      description: "This is a curated list",
    };
    movieExistsInDB.mockResolvedValue(true);
    movieModel.findOne.mockResolvedValue(mockMovie);
    curatedlistModel.findByPk.mockResolvedValue(mockCuratedList);
    curatedlistitemModel.findOne.mockResolvedValue(null);
    curatedlistitemModel.create.mockResolvedValue({});

    const response = await request(app)
      .post("/api/movies/curated-list")
      .send({ movieId: 123, curatedListId: 1 });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      message: "Movie added to curated list successfully",
    });
  });
});
