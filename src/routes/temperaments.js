const { Router } = require("express");
const router = Router();

const { Temperament, Dog } = require("../db");
const axios = require("axios");

router.get("/", (req, res) => {
  axios.get("https://api.thedogapi.com/v1/breeds").then((results) => {
    let temperamentsFromApi = [];

    results = results.data.map((item) => {
      return item.temperament;
    });

    results.forEach((item) => {
      if (item !== undefined) {
        item.split(", ").forEach((i) => {
          temperamentsFromApi.push(i);
        });
      }
    });

    temperamentsFromApi = Array.from(new Set(temperamentsFromApi));

    Temperament.findOne({
      where: {
        name: temperamentsFromApi[0],
      },
    })
      .then((result) => {
        console.log(result);
        if (result) {
          return Temperament.findAll({ order: [["name"]] });
        } else {
          let createTemperamentsPromises = [];
          for (temperament of temperamentsFromApi) {
            createTemperamentsPromises.push(
              Temperament.create({ name: temperament })
            );
          }

          return Promise.all(createTemperamentsPromises).then(() => {
            return Temperament.findAll({ order: [["name"]] });
          });
        }
      })
      .then((results) => {
        return res.status(200).json(results);
      })
      .catch((error) => {
        return res.status(400).json(error.message);
      });
  });
});

router.get("/:temperaments", (req, res) => {
  const { temperament } = req.params;

  Temperament.findOne({
    where: {
      name: temperament,
    },
    include: Dog,
  })
    .then((result) => {
      if (!result.dogs.length) {
        return res
          .status(404)
          .json(`Dogs with TEMPERAMENT: ${temperament} not found!`);
      }
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

module.exports = router;
