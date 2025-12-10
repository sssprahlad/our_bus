const db = require("../config/database");

module.exports = {
  addBooking: (
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
    callback
  ) => {
    // Normalize seatType (case-insensitive matching)
    const normalizedSeatType = seatType.toLowerCase();

    // Step 1: Check seat availability with busId + seatType + seatId
    db.get(
      `SELECT is_available, LOWER(seat_type) AS seat_type 
   FROM seats 
   WHERE seat_number = ? AND bus_id = ? AND seat_type = ?`,
      [seatId, busId, seatType],
      (err, row) => {
        if (err) return callback(err);

        if (!row) {
          return callback(new Error("Seat does not exist for this Bus!"));
        }

        if (row.seat_type !== normalizedSeatType) {
          return callback(new Error("Seat type mismatch!"));
        }

        if (row.is_available === 0) {
          return callback(new Error("Seat already booked!"));
        }

        // Step 2: Update seat status
        db.run(
          `UPDATE seats 
         SET is_available = 0 
         WHERE seat_number = ? AND bus_id = ? AND LOWER(seat_type) = ?`,
          [seatId, busId, normalizedSeatType],
          function (err) {
            if (err) return callback(err);

            if (this.changes === 0) {
              return callback(
                new Error("Seat update failed — no matching seat found!")
              );
            }

            // Step 3: Insert into bookings
            const insertQuery = `
            INSERT INTO bookings 
            (bus_id, seat_id, user_id, user_name, gender, age, phone_number, 
             travel_date, boarding_point, droping_point, seat_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;

            const params = [
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
              normalizedSeatType,
            ];

            db.run(insertQuery, params, callback);
          }
        );
      }
    );
  },

  getBookingBusTicketDetails: (busId, callback) => {
    db.all(`SELECT * FROM buses WHERE id = ?`, [busId], (err, buses) => {
      if (err) return callback(err);

      db.all(
        `SELECT * FROM bookings WHERE bus_id = ?`,
        [busId],
        (err2, bookings) => {
          if (err2) return callback(err2);
          callback(null, {
            buses,
            bookings,
          });
        }
      );
    });
  },
};
