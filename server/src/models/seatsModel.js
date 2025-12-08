const db = require("../config/database");

exports.inserSeats = (busId, busType, totalSeats, totalSleeper) => {
  console.log(busId, busType, totalSeats, totalSleeper, "seats");
  if (busType.toLowerCase() === "seater" || busType.toLowerCase() === "mixed") {
    for (let i = 1; i <= totalSeats; i++) {
      db.run(
        `INSERT INTO seats (bus_id, seat_number, seat_type) VALUES (?, ?, ?)`,
        [busId, "A" + i, "seater"],
        (err) => {
          if (err) console.log("Seat Insert Error:", err.message);
        }
      );
    }
  }

  if (
    busType.toLowerCase() === "sleeper" ||
    busType.toLowerCase() === "mixed"
  ) {
    for (let i = 1; i <= totalSleeper; i++) {
      db.run(
        `INSERT INTO seats (bus_id, seat_number, seat_type) VALUES (?, ?, ?)`,
        [busId, "L" + i, "sleeper"],
        (err) => {
          if (err) console.log("Sleeper Insert Error:", err.message);
        }
      );
    }
  }
};
