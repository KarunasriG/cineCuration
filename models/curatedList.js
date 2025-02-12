module.exports = (sequelize, DataTypes) => {
  const curatedList = sequelize.define("curatedList", {
    name: DataTypes.STRING,
    slug: DataTypes.STRING, // For public access
    description: DataTypes.TEXT,
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  });

  curatedList.associate = function (models) {
    curatedList.hasMany(models.curatedListItem, {
      foreignKey: "curatedListId",
    });
  };

  return curatedList;
};
