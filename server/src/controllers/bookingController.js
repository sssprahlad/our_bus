const BookingModel = require("../models/bookingModel");

exports.getBookingDetails = (req, res) => {
  const { bookings } = req.body;

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Bookings must be a non-empty array",
    });
  }

  let successCount = 0;
  let failed = [];
  let processed = 0;

  bookings.forEach((booking, index) => {
    const {
      busId,
      seatId,
      userId,
      userName,
      gender,
      age,
      phoneNumber,
      travelDate,
      boardingPoint,
      dropingPoint,
      seatType,
    } = booking;

    if (
      !busId ||
      !seatId ||
      !userId ||
      !userName ||
      !gender ||
      !age ||
      !phoneNumber ||
      !travelDate ||
      !boardingPoint ||
      !dropingPoint ||
      !seatType
    ) {
      failed.push({ index, seatId, reason: "Missing fields" });
      processed++;
      if (processed === bookings.length) {
        return res.status(200).json({
          status: 200,
          message: "Booking process completed",
          successCount,
          failed,
        });
      }
      return;
    }

    BookingModel.addBooking(
      busId,
      seatId,
      userId,
      userName,
      gender,
      age,
      phoneNumber,
      travelDate,
      boardingPoint,
      dropingPoint,
      seatType,
      (err) => {
        if (err) {
          failed.push({ index, seatId, seatType, reason: err.message });
        } else {
          successCount++;
        }

        processed++;

        if (processed === bookings.length) {
          return res.status(200).json({
            status: 200,
            message: "Booking process completed",
            successCount,
            failed,
          });
        }
      }
    );
  });
};

exports.getBookingDetailsByBus = (req, res) => {
  const busId = req.params.id;

  try {
    BookingModel.getBookingBusTicketDetails(
      busId,
      (err, getBuses, getBookingBusTickets) => {
        if (err) return res.status(500).json({ message: "Database error" });

        res.status(200).json({
          status: 200,
          message: "get booking tickets details",
          buses: getBuses,
          bookingTickets: getBookingBusTickets,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
  }
};
