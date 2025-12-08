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
    callback
  ) => {
    db.get(
      `SELECT is_available FROM seats WHERE id = ?`,
      [seatId],
      (err, row) => {
        if (err) return callback(err);

        if (!row) {
          return callback(new Error("Seat does not exist!"));
        }

        if (row.is_available === 0) {
          return callback(new Error("Seat already booked"));
        }

        db.run(
          `UPDATE seats SET is_available = 0 WHERE id = ?`,
          [seatId],
          (err) => {
            if (err) return callback(err);

            const insertQuery = `
              INSERT INTO bookings 
              (bus_id, seat_id, user_id, user_name, gender, age, phone_number, travel_date, boarding_point, droping_point)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
