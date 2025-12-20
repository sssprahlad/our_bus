const db = require("../config/database");

module.exports = {
  addBooking: (
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
    callback
  ) => {
    const normalizedSeatType = seatType.toLowerCase();

    db.get(
      `SELECT seat_number, LOWER(seat_type) AS seat_type
   FROM seats
   WHERE seat_number = ? AND bus_id = ? AND LOWER(seat_type) = ?`,
      [seatNumber, busId, normalizedSeatType],
      (err, seatRow) => {
        if (err) return callback(err);

        if (!seatRow) {
          return callback(new Error("Seat not found for this bus"));
        }

        if (seatRow.seat_type !== normalizedSeatType) {
          return callback(new Error("Seat type mismatch"));
        }

        db.get(
          `SELECT is_available
         FROM seat_availability
         WHERE seat_number = ? AND bus_id = ? AND travel_date = ?`,
          [seatNumber, busId, travelDate],
          (err2, availRow) => {
            if (err2) return callback(err2);

            if (availRow && availRow.is_available === 0) {
              return callback(new Error("Seat already booked on this date"));
            }

            db.run(
              `INSERT INTO seat_availability
               (seat_number, bus_id, seat_type, travel_date, is_available)
             VALUES (?, ?, ?, ?, 0)
             ON CONFLICT(seat_number, bus_id, travel_date)
             DO UPDATE SET is_available = 0`,
              [seatNumber, busId, normalizedSeatType, travelDate],
              (err3) => {
                if (err3) return callback(err3);

                db.run(
                  `INSERT INTO bookings
                (bus_id, seat_number, user_id, user_name, gender, age, phone_number,
                 travel_date, boarding_point, droping_point, seat_type)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                  [
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
                    normalizedSeatType,
                  ],
                  callback
                );
              }
            );
          }
        );
      }
    );
  },

  // addBooking: (
  //   busId,
  //   seatNumber,
  //   userId,
  //   userName,
  //   gender,
  //   age,
  //   phoneNumber,
  //   travelDate,
  //   boardingPoint,
  //   dropingPoint,
  //   seatType,
  //   boardingPointTime,
  //   dropingPointTime,
  //   callback
  // ) => {
  //   const normalizedSeatType = seatType.toLowerCase();

  //   console.log(seatType, travelDate, seatNumber, "check date");

  //   db.get(
  //     `SELECT seat_number, LOWER(seat_type) AS seat_type
  //    FROM seats
  //    WHERE seat_number = ? AND bus_id = ?`,
  //     [seatNumber, busId],
  //     (err, seatRow) => {
  //       if (err) return callback(err);
  //       if (!seatRow) return callback(new Error("Seat not found for this bus"));

  //       // Seat type mismatch
  //       if (seatRow.seat_type !== normalizedSeatType) {
  //         return callback(new Error("Seat type mismatch"));
  //       }

  //       db.get(
  //         `SELECT is_available
  //        FROM seat_availability
  //        WHERE seat_number = ? AND bus_id = ? AND travel_date = ?`,
  //         [seatNumber, busId, travelDate],
  //         (err2, availRow) => {
  //           if (err2) return callback(err2);

  //           // Seat already booked on same date (correct)
  //           if (availRow && availRow.is_available === 0) {
  //             return callback(new Error("Seat already booked on this date"));
  //           }

  //           db.run(
  //             `INSERT INTO seat_availability
  //            (seat_number, bus_id, seat_type, travel_date, is_available)
  //            VALUES (?, ?, ?, ?, 0)
  //            ON CONFLICT(bus_id, seat_number, travel_date)
  //            DO UPDATE SET is_available = 0`,
  //             [seatNumber, busId, normalizedSeatType, travelDate],
  //             (err3) => {
  //               if (err3) return callback(err3);

  //               db.run(
  //                 `INSERT INTO bookings
  //                (bus_id, seat_number, user_id, user_name, gender, age, phone_number,
  //                 travel_date, boarding_point, droping_point, seat_type, boarding_point_time, droping_point_time)
  //                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //                 [
  //                   busId,
  //                   seatNumber,
  //                   userId,
  //                   userName,
  //                   gender,
  //                   age,
  //                   phoneNumber,
  //                   travelDate,
  //                   boardingPoint,
  //                   dropingPoint,
  //                   normalizedSeatType,
  //                   boardingPointTime,
  //                   dropingPointTime,
  //                 ],
  //                 callback
  //               );
  //             }
  //           );
  //         }
  //       );
  //     }
  //   );
  // },

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

  myBookingTickets: (userId, callback) => {
    const query = `
    SELECT 
      b.id AS booking_id,
      b.bus_id,
      b.seat_number,
      b.user_id,
      b.user_name,
      b.gender,
      b.age,
      b.phone_number,
      b.travel_date,
      b.boarding_point,
      b.droping_point,
      b.seat_type,

     
      bs.bus_name,
      bs.bus_type,
      bs.total_seats,
      bs.total_sleeper,
      bs.seat_price,
      bs.sleeper_price,
      bs.from_city,
      bs.to_city,
      bs.distance_km,
      bs.departure_time,
      bs.arrival_time,
      bs.duration,
      bs.bus_image

    FROM bookings b
    JOIN buses bs ON b.bus_id = bs.id
    WHERE b.user_id = ?
    ORDER BY b.travel_date ASC, b.seat_number ASC
  `;

    db.all(query, [userId], (err, rows) => {
      if (err) return callback(err);
      callback(null, rows);
    });
  },
};
