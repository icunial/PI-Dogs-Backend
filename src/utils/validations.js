const validateName = (name) => {
  if (!name) return "Name parameter is missing";
  if (typeof name !== "string") return "Name must be a number!";
  if (name.trim().length > 25 || name.trim().length < 4)
    return "Name must be between 4 and 25 characters long!";

  return false;
};

const validateHeight = (min_height, max_height) => {
  if (!min_height) return "Min Height parameter is missing";
  if (!max_height) return "Max Height parameter is missing";
  if (typeof min_height !== "number") return "Min Height must be a number!";
  if (typeof max_height !== "number") return "Max Height must be a number!";
  if (min_height > 100 || min_height < 1 || max_height > 100 || max_height < 1)
    return "Height must be between 1 and 120";
  if (max_height < min_height)
    return "Max Height must be higher than Min Height";

  return false;
};

const validateWeight = (min_weight, max_weight) => {
  if (!min_weight) return "Min Weight parameter is missing";
  if (!max_weight) return "Max Weight parameter is missing";
  if (typeof min_weight !== "number") return "Min Weight must be a number!";
  if (typeof max_weight !== "number") return "Max Weight must be a number!";
  if (min_weight > 150 || min_weight < 1 || max_weight > 150 || max_weight < 1)
    return "Weight must be between 1 and 100";
  if (max_weight < min_weight)
    return "Max Weight must be higher than Min Weight";

  return false;
};

const validateLifeSpan = (min_life_span, max_life_span) => {
  if (!min_life_span) return "Min Life Span parameter is missing";
  if (!max_life_span) return "Max Life Span parameter is missing";
  if (typeof min_life_span !== "number")
    return "Min Life Span must be a number";
  if (typeof max_life_span !== "number")
    return "Max Life Span must be a number";
  if (
    min_life_span > 30 ||
    min_life_span < 1 ||
    max_life_span > 30 ||
    min_life_span < 1
  )
    return "Life Span must be between 1 and 30";
  if (max_life_span < min_life_span) {
    return "Max Life Span must be higher than Min Life Span";
  }

  return false;
};

module.exports = {
  validateName,
  validateHeight,
  validateWeight,
  validateLifeSpan,
};
