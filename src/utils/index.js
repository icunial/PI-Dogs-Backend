const axios = require("axios");
const { Dog, Temperament } = require("../db");

const getAllApiConvertWeight = () => {
  return new Promise((resolve, reject) => {
    const results = [];

    axios
      .get(`https://api.thedogapi.com/v1/breeds`)
      .then((apiResults) => {
        if (apiResults) {
          apiResults.data.forEach((r) => {
            if (r.weight !== "NaN") {
              if (r.id !== 232 && r.id !== 179)
                results.push({
                  id: r.id,
                  name: r.name,
                  image: r.image.url,
                  temperament: r.temperament
                    ? convertTemperamentsToArray(r.temperament)
                    : [],
                  weightConvert: parseInt(
                    r.weight.metric.substring(0, 2).trim()
                  ),
                  weight: r.weight.metric,
                });
            }
          });
        }
        resolve(results);
      })
      .catch(() => {
        reject(new Error("Error trying to get all dogs from API"));
      });
  });
};

const getAllDbConvertWeight = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    Dog.findAll({
      attributes: ["id", "name", "image", "weight"],
      include: Temperament,
    })
      .then((dbResults) => {
        dbResults.forEach((r) => {
          results.push({
            id: r.id,
            name: r.name,
            image: r.image,
            temperament: r.temperaments.map((t) => t.name),
            weightConvert: parseInt(r.weight.substring(0, 3).trim()),
            weight: r.weight,
          });
        });
        resolve(results);
      })
      .catch(() => {
        reject(new Error("Error trying to get all dogs from DB"));
      });
  });
};

module.exports = {
  getAllApiConvertWeight,
  getAllDbConvertWeight,
};
