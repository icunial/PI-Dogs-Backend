const axios = require("axios");
const { Dog, Temperament } = require("../db");
const { Op } = require("sequelize");
const utils = require("../utils/index");

const convertTemperamentsToArray = (temperaments) => {
  const temperamentsArray = [];
  temperaments.split(", ").forEach((i) => temperamentsArray.push(i));
  return temperamentsArray;
};

const getAllApi = () => {
  return new Promise((resolve, reject) => {
    const results = [];
    axios
      .get(`https://api.thedogapi.com/v1/breeds`)
      .then((apiResults) => {
        apiResults.data.forEach((r) => {
          results.push({
            id: r.id,
            name: r.name,
            image: r.image.url,
            temperament: r.temperament
              ? convertTemperamentsToArray(r.temperament)
              : [],
            weight: r.weight.metric,
          });
        });

        resolve(results);
      })
      .catch(() => {
        reject(new Error("Error trying to get all dogs from API"));
      });
  });
};

const findDogByIdApi = (id) => {
  return new Promise((resolve, reject) => {
    const result = [];
    axios
      .get(`https://api.thedogapi.com/v1/breeds`)
      .then((apiResults) => {
        apiResults.data.forEach((r) => {
          if (r.id === parseInt(id)) {
            result.push({
              id: r.id,
              name: r.name,
              image: r.image.url,
              temperament: r.temperament
                ? convertTemperamentsToArray(r.temperament)
                : [],
              weight: r.weight.metric,
              height: r.height.metric,
              life_span: r.life_span,
            });
          }
        });

        resolve(result);
      })
      .catch(() => {
        reject(new Error("Error finding a dog by its ID in API"));
      });
  });
};

const findByNameApi = (name) => {
  return new Promise((resolve, reject) => {
    const results = [];
    axios
      .get(`https://api.thedogapi.com/v1/breeds/search?q=${name}`)
      .then((apiResults) => {
        apiResults.data.forEach((r) => {
          results.push({
            id: r.id,
            name: r.name,
            image: `https://cdn2.thedogapi.com/images/${r.reference_image_id}.jpg`,
            temperament: r.temperament
              ? convertTemperamentsToArray(r.temperament)
              : [],
            weight: r.weight.metric,
          });
        });
        resolve(results);
      })
      .catch(() => {
        reject(new Error("Error trying to get a dog by its name from API"));
      });
  });
};

const findByTemperamentApi = (temp) => {
  return new Promise((resolve, reject) => {
    let results = [];
    axios
      .get(`https://api.thedogapi.com/v1/breeds`)
      .then((apiResults) => {
        apiResults.data.forEach((r) => {
          results.push({
            id: r.id,
            name: r.name,
            image: r.image.url,
            temperament: r.temperament
              ? convertTemperamentsToArray(r.temperament)
              : [],
            weight: r.weight.metric,
          });
        });
        results = results.filter((r) => {
          return r.temperament.includes(temp);
        });

        resolve(results);
      })
      .catch(() => {
        reject(
          new Error(
            "Error trying to get all dogs by their temperament from API"
          )
        );
      });
  });
};

const findDogByIdDb = (id) => {
  return new Promise((resolve, reject) => {
    Dog.findByPk(id, {
      attributes: ["id", "name", "image", "weight", "height", "life_span"],
      include: Temperament,
    })
      .then((dbResult) => {
        const result = [
          {
            id: dbResult.id,
            name: dbResult.name,
            image: dbResult.image,
            temperament: dbResult.temperaments.map((t) => t.name),
            weight: dbResult.weight,
            height: dbResult.height,
            life_span: dbResult.life_span,
          },
        ];
        resolve(result);
      })
      .catch(() => {
        reject(new Error("Error finding a dog by its ID in DB"));
      });
  });
};

const findByNameDb = (name) => {
  return new Promise((resolve, reject) => {
    const results = [];

    Dog.findAll({
      attributes: ["id", "name", "image", "weight"],
      include: Temperament,
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
    })
      .then((dbResults) => {
        dbResults.forEach((r) => {
          results.push({
            id: r.id,
            name: r.name,
            image: r.image,
            temperament: r.temperaments.map((t) => t.name),
            weight: r.weight,
          });
        });

        resolve(results);
      })
      .catch(() => {
        reject(new Error("Error trying to get a dog by its name from DB"));
      });
  });
};

const findByTemperamentDb = (temp) => {
  return new Promise((resolve, reject) => {
    let results = [];

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
            weight: r.weight,
          });
        });

        results = results.filter((r) => {
          return r.temperament.includes(temp);
        });
        resolve(results);
      })
      .catch(() => {
        reject(new Error("Error trying to get all dogs from DB"));
      });
  });
};

const getAllDb = () => {
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

const orderFromAtoZ = () => {
  return new Promise((resolve, reject) => {
    const dogsFromApi = getAllApi();
    const dogsFromDb = getAllDb();

    Promise.all([dogsFromApi, dogsFromDb])
      .then((resultsFromPromises) => {
        let results = [...resultsFromPromises[0], ...resultsFromPromises[1]];
        console.log(results);

        results = results.sort((a, b) => {
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          return 0;
        });
        resolve(results);
      })
      .catch(() => {
        reject(new Error("Error trying to order from A to Z"));
      });
  });
};

const orderFromZtoA = () => {
  return new Promise((resolve, reject) => {
    const dogsFromApi = getAllApi();
    const dogsFromDb = getAllDb();

    Promise.all([dogsFromApi, dogsFromDb])
      .then((resultsFromPromises) => {
        let results = [...resultsFromPromises[0], ...resultsFromPromises[1]];
        console.log(results);

        results = results.sort((a, b) => {
          if (a.name.toLowerCase() < b.name.toLowerCase()) return 1;
          if (a.name.toLowerCase() > b.name.toLowerCase()) return -1;
          return 0;
        });
        resolve(results);
      })
      .catch(() => {
        reject(new Error("Error trying to order from A to Z"));
      });
  });
};

const orderDogsLessWeight = () => {
  return new Promise((resolve, reject) => {
    const dogsFromApi = utils.getAllApiConvertWeight();
    const dogsFromDb = utils.getAllDbConvertWeight();

    Promise.all([dogsFromApi, dogsFromDb])
      .then((resultsFromPromises) => {
        let results = [...resultsFromPromises[0], ...resultsFromPromises[1]];
        console.log(results);

        results = results.sort((a, b) => {
          return a.weightConvert - b.weightConvert;
        });
        resolve(results);
      })
      .catch(() => {
        reject(new Error("Error trying to order from A to Z"));
      });
  });
};

const orderDogsMoreWeight = () => {
  return new Promise((resolve, reject) => {
    const dogsFromApi = utils.getAllApiConvertWeight();
    const dogsFromDb = utils.getAllDbConvertWeight();

    Promise.all([dogsFromApi, dogsFromDb])
      .then((resultsFromPromises) => {
        let results = [...resultsFromPromises[0], ...resultsFromPromises[1]];
        console.log(results);

        results = results.sort((a, b) => {
          return b.weightConvert - a.weightConvert;
        });
        resolve(results);
      })
      .catch(() => {
        reject(new Error("Error trying to order from A to Z"));
      });
  });
};

const deleteDogFromDbById = (id) => {
  return new Promise((resolve, reject) => {
    Dog.destroy({
      where: {
        id,
      },
    })
      .then((result) => {
        resolve(result);
      })
      .catch(() => {
        reject(new Error("Error deleting a dog by its ID in DB"));
      });
  });
};

const updateDogFromDb = (id, name) => {
  return new Promise((resolve, reject) => {
    Dog.update({ name }, { where: { id } })
      .then((result) => resolve(`Dog with ID: ${id} updated successfully!`))
      .catch(() => reject(new Error("Error updating a dog!")));
  });
};

module.exports = {
  getAllApi,
  findDogByIdApi,
  findByNameApi,
  findByTemperamentApi,
  findDogByIdDb,
  findByNameDb,
  findByTemperamentDb,
  getAllDb,
  orderFromAtoZ,
  orderFromZtoA,
  orderDogsLessWeight,
  orderDogsMoreWeight,
  deleteDogFromDbById,
  updateDogFromDb,
};
