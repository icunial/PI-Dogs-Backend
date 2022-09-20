const { Router } = require("express");

const dogRouter = require("./dogs");

const router = Router();

router.use("/dogs", dogRouter);

module.exports = router;
