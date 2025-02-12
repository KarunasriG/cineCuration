module.exports = (sequelize, DataTypes) => {
  const review = sequelize.define("review", {
    movieId: {
      type: DataTypes.INTEGER,
      references: { model: "Movies", key: "id" },
    },
    rating: DataTypes.FLOAT, // User rating
    reviewText: DataTypes.STRING, // User review
    addedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return review;
};
