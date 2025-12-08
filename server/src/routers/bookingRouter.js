const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const bookingControler = require("../controllers/bookingController");
const upload = require("../uploads/uploads");

router.post(
  "/booking-details",
  authMiddleware,
  upload.none(),
  bookingControler.getBookingDetails
);

router.get(
  "/booking-details/:id",
  authMiddleware,
  bookingControler.getBookingDetailsByBus
);

module.exports = router;
