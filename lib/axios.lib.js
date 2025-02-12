const axios = require("axios");
require("dotenv").config();

const axiosInstance = axios.create({
  baseURL: process.env.TMDB_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.API_KEY}`,
  },
});

module.exports = axiosInstance;
