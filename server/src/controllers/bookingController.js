const bookingModel = require("../models/bookingModel");
const BookingModel = require("../models/bookingModel");

exports.getBookingDetails = (req, res) => {
  const { bookings } = req.body;

  // Validate input array
  if (!Array.isArray(bookings) || bookings.length === 0) {
    return res.status(400).json({
      status: 400,
      message: "Bookings must be a non-empty array",
    });
  }

  let successCount = 0;
  let failed = [];
  let processed = 0;
  const total = bookings.length;

  // Process each booking
  bookings.forEach((booking, index) => {
    const {
      busId,
      seatNumber,
      userId,
      userName,
      gender,
      age,
      phoneNumber,
      travelDate,
      boardingPoint,
      dropingPoint,
      seatType,
      // boardingPointTime,
      // dropingPointTime,
    } = booking;

    // Validate required fields
    if (
      !busId ||
      !seatNumber ||
      !userId ||
      !userName ||
      !gender ||
      !age ||
      !phoneNumber ||
      !travelDate ||
      !boardingPoint ||
      !dropingPoint ||
      !seatType
      // !boardingPointTime ||
      // !dropingPointTime
    ) {
      failed.push({
        index,
        seatNumber,
        reason: "Missing required booking fields",
      });

      processed++;
      if (processed === total) {
        return res.status(200).json({
          status: 200,
          message: "Booking process completed",
          successCount,
          failed,
        });
      }
      return;
    }

    // Perform DB insert
    BookingModel.addBooking(
      busId,
      seatNumber,
      userId,
      userName,
      gender,
      age,
      phoneNumber,
      travelDate,
      boardingPoint,
      dropingPoint,
      seatType,
      // boardingPointTime,
      // dropingPointTime,
      (err) => {
        if (err) {
          failed.push({
            index,
            seatNumber,
            seatType,
            reason: err.message || "Database error",
          });
        } else {
          successCount++;
        }

        processed++;

        // Send final response after processing all bookings
        if (processed === total) {
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

exports.myBookingsHistory = (req, res) => {
  const userId = req.params.userId;
  console.log(userId, "userId");
  try {
    bookingModel.myBookingTickets(userId, (err, myBookings) => {
      if (err) return res.status(500).json({ message: "Database error" });

      return res.status(200).json({
        status: 200,
        message: "User booking tickets successfully.",
        myBookings: myBookings,
      });
    });
  } catch (error) {
    console.error(error.message);
  }
};
