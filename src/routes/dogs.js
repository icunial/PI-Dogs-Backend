const { Router } = require("express");
const router = Router();

const { Dog } = require("../../db");
const { v4: uuidv4 } = require("uuid");

const dogController = require("../controllers/dogs");

router.get("/:id", (req, res) => {
  const { id } = req.params;

  dogController
    .findDogByIdApi(id)
    .then((result) => {
      if (!result.length)
        return res.status(404).json(`Dog with ID: ${id} not found!`);
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(400).json(error.message);
    });
});

router.get("/", (req, res) => {
  const { name, temperament, from } = req.query;

  if (name) {
    dogController
      .findByNameApi(name)
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(400).json(error.message);
      });
  } else if (temperament) {
    dogController
      .findByTemperamentApi(temperament)
      .then((results) => {
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(400).json(error.message);
      });
  } else if (from === "api") {
    dogController
      .getAllApi()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error.message);
      });
  } else {
    dogController
      .getAllApi()
      .then((result) => {
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error.message);
      });
  }
});

router.post("/", (req, res) => {});

module.exports = router;
