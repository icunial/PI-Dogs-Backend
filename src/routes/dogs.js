const { Router } = require("express");
const router = Router();

const { Dog, Temperament } = require("../db");
const { v4: uuidv4 } = require("uuid");

const dogController = require("../controllers/dogs");

const validations = require("../utils/validations");

router.get("/:id", (req, res) => {
  const { id } = req.params;

  if (id.includes("-")) {
    dogController.findDogByIdDb(id).then((result) => {
      if (!result.length) {
        return res.status(404).json(`Dog with ID: ${id} not found!`);
      }
      res.status(200).json(result);
    });
  } else {
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
  }
});

router.get("/", (req, res) => {
  const { name, temperament, from } = req.query;

  if (name) {
    const fromApi = dogController.findByNameApi(name);
    const fromDb = dogController.findByNameDb(name);

    Promise.all([fromApi, fromDb])
      .then((results) => {
        if (!results.length) {
          res.status(404).json(`Dog with name ${name} not found!`);
        }
        res.status(200).json(results[0].concat(results[1]));
      })
      .catch((error) => {
        res.status(400).json(error.message);
      });
  } else if (temperament) {
    const fromApi = dogController.findByTemperamentApi(temperament);
    const fromDb = dogController.findByTemperamentDb(temperament);
    Promise.all([fromApi, fromDb])
      .then((results) => {
        if (!results.length)
          res
            .status(404)
            .json(`Dogs with temperament ${temperament} not found!`);
        res.status(200).json(results[0].concat(results[1]));
      })
      .catch((error) => {
        res.status(400).json(error.message);
      });
  } else if (from === "api") {
    dogController
      .getAllApi()
      .then((result) => {
        if (!result.length) {
          res.status(404).json(`There are not dogs saved in the Api!`);
        }
        res.status(200).json(result);
      })
      .catch((error) => {
        res.status(400).json(error.message);
      });
  } else if (from === "db") {
    dogController
      .getAllDb()
      .then((results) => {
        if (!results.length)
          res.status(404).json(`There are not dogs saved in the DB!`);
        res.status(200).json(results);
      })
      .catch((error) => {
        res.status(400).json(error.message);
      });
  } else {
    const fromApi = dogController.getAllApi();
    const fromDb = dogController.getAllDb();

    Promise.all([fromApi, fromDb])
      .then((results) => {
        res.status(200).json(results[0].concat(results[1]));
      })
      .catch((error) => {
        res.status(400).json(error.message);
      });
  }
});

router.post("/", (req, res) => {
  const dog = req.body;

  if (validations.validateName(dog.name))
    return res.status(400).json(validations.validateName(dog.name));

  if (validations.validateHeight(dog.min_height, dog.max_height))
    return res
      .status(400)
      .json(validations.validateHeight(dog.min_height, dog.max_height));

  if (validations.validateWeight(dog.min_weight, dog.max_weight))
    return res
      .status(400)
      .json(validations.validateWeight(dog.min_weight, dog.max_weight));

  if (validations.validateLifeSpan(dog.min_life_span, dog.max_life_span))
    return res
      .status(400)
      .json(validateLifeSpan(dog.min_life_span, dog.max_life_span));

  if (!dog.temperament) {
    Dog.create({
      ...dog,
      weight: dog.min_weight + " - " + dog.max_weight,
      height: dog.min_height + " - " + dog.max_height,
      life_span: dog.min_life_span + " - " + dog.max_life_span + " years",
      id: uuidv4(),
    })
      .then((result) => {
        res.status(201).json(result);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  } else {
    Dog.create({
      ...dog,
      weight: dog.min_weight + " - " + dog.max_weight,
      height: dog.min_height + " - " + dog.max_height,
      life_span: dog.min_life_span + " - " + dog.max_life_span + " years",
      id: uuidv4(),
    })
      .then((dogCreated) => {
        dog.temperament.forEach((temperament) => {
          Temperament.findOne({
            where: {
              name: temperament,
            },
          }).then((temperamentFound) => {
            temperamentFound.addDog(dogCreated.id);
          });
        });
        res.status(201).json(dogCreated);
      })
      .catch((error) => {
        res.status(400).json(error);
      });
  }
});

router.get("/filter/:opt", (req, res) => {
  const { opt } = req.params;

  let results = [];

  if (opt === "az") {
    results = dogController.orderFromAtoZ();
  }

  if (opt === "za") {
    results = dogController.orderFromZtoA();
  }

  if (opt === "more") {
    results = dogController.orderDogsMoreWeight();
  }

  if (opt === "less") {
    results = dogController.orderDogsLessWeight();
  }

  results
    .then((r) => {
      res.status(200).json(r);
    })
    .catch((error) => {
      res.status(400).json(error);
    });
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;

  dogController
    .deleteDogFromDbById(id)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(400).json(error.message);
    });
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  dogController
    .updateDogFromDb(id, name)
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(400).json(error.message);
    });
});

module.exports = router;
