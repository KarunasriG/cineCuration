module.exports = (sequelize, DataTypes) => {
  const wishlist = sequelize.define("wishlist", {
    movieId: {
      type: DataTypes.INTEGER,
      references: { model: "movie", key: "id" },
    },
    addedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  return wishlist;
};
