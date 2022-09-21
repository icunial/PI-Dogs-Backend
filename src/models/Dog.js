const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  sequelize.define(
    "dog",
    {
      id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      min_height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      max_height: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      height: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      min_weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      max_weight: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      weight: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      min_life_span: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      max_life_span: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      life_span: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      image: {
        type: DataTypes.STRING,
      },
    },
    {
      timestamp: true,
      createdAt: true,
      updatedAt: false,
    }
  );
};
