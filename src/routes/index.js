const { Router } = require("express");

const dogRouter = require("./dogs");
const temperamentRouter = require("./temperaments");

const router = Router();

router.use("/dogs", dogRouter);
router.use("/temperaments", temperamentRouter);

module.exports = router;
