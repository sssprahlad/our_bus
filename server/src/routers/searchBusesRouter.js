const express = require("express");
const router = express.Router();
const searchBusesController = require("../controllers/searchBusesController");
const authMiddleware = require("../middleware/authMiddleware");

router.get(
  "/bus/search",
  authMiddleware,
  searchBusesController.searchBusesDetails
);

module.exports = router;
