require("dotenv").config();
const { Sequelize } = require("sequelize");
const { DB_USER, DB_PASSWORD, DB_HOST } = process.env;

const sequelize = new Sequelize(
  `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/dogs2`,
  { logging: false, native: false }
);

const { Dog } = sequelize.models;

module.exports = {
  ...sequelize.models,
  conn: sequelize,
};
