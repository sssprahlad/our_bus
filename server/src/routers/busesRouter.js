const express = require("express");
const router = express.Router();
const busesController = require("../controllers/busesController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../uploads/uploads");

router.post("/buses", upload.single("busImage"), busesController.addBusDetails);

router.get("/buses", authMiddleware, busesController.getAllBuses);

router.patch(
  "/buses/:id",
  authMiddleware,
  upload.single("busImage"),
  busesController.updateBusDetails
);

router.delete("/buses/:id", authMiddleware, busesController.deleteBusDetails);

router.get("/buses/:id", authMiddleware, busesController.getBusDetails);

module.exports = router;
