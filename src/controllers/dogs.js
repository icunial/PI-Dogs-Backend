const axios = require("axios");

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

module.exports = {
  getAllApi,
  findDogByIdApi,
  findByNameApi,
  findByTemperamentApi,
};
