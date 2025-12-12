const db = require("../config/database");
const { inserSeats } = require("./seatsModel");

module.exports = {
  createBusPost: (
    busName,
    busType,
    totalSeats,
    totalSleeper,
    seatPrice,
    sleeperPrice,
    fromCity,
    toCity,
    distanceKm,
    departureTime,
    arrivalTime,
    duration,
    busImage,
    stops,
    callback
  ) => {
    // if (typeof stops === "string") {
    //   stops = JSON.parse(stops);
    // }

    if (typeof stops === "string") {
      stops = stops.trim();
      try {
        stops = JSON.parse(stops);
      } catch (e) {
        console.log("Stops JSON error:", e.message);
        return callback(e);
      }
    }

    const query = `
    INSERT INTO buses 
    (bus_name, bus_type, total_seats, total_sleeper, seat_price, sleeper_price, from_city, to_city, distance_km, departure_time, arrival_time, duration, bus_image)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)
  `;

    const params = [
      busName,
      busType,
      totalSeats,
      totalSleeper,
      seatPrice,
      sleeperPrice,
      fromCity,
      toCity,
      distanceKm,
      departureTime,
      arrivalTime,
      duration,
      busImage,
    ];

    db.run(query, params, function (err) {
      if (err) {
        console.log("Bus Insert Error:", err.message);
        return callback(err);
      }

      const busId = this.lastID;

      inserSeats(busId, busType, totalSeats, totalSleeper);

      stops.forEach((stop, index) => {
        db.run(
          `INSERT INTO bus_stops (bus_id, stop_name, stop_order) VALUES (?, ?, ?)`,
          [busId, stop, index + 1]
        );
      });

      callback(null, { busId });
    });
  },

  // getBusById: (busId, callback) => {
  //   db.get("SELECT * FROM buses WHERE id = ?", [busId], callback);
  // },

  getBusById: (busId, callback) => {
    const busQuery = `SELECT * FROM buses WHERE id = ?`;
    const stopsQuery = `SELECT stop_name, stop_order FROM bus_stops WHERE bus_id = ? ORDER BY stop_order ASC`;

    db.get(busQuery, [busId], (err, bus) => {
      if (err) return callback(err);
      if (!bus) return callback(null, null);

      db.all(stopsQuery, [busId], (err, stops) => {
        if (err) return callback(err);

        bus.stops = stops.map((s) => s.stop_name);

        callback(null, bus);
      });
    });
  },

  patchBusDetails: (
    busName,
    busType,
    totalSeats,
    totalSleeper,
    seatPrice,
    sleeperPrice,
    fromCity,
    toCity,
    distanceKm,
    departureTime,
    arrivalTime,
    duration,
    newImage,
    busId,
    callback
  ) => {
    const query = `
      UPDATE buses 
      SET bus_name=?, bus_type=?, total_seats=?, total_sleeper=?, seat_price=?, sleeper_price, from_city=?, to_city=?, distance_km=?, departure_time=?, arrival_time=?, duration=?, bus_image=?
      WHERE id=?
    `;

    const params = [
      busName,
      busType,
      totalSeats,
      totalSleeper,
      seatPrice,
      sleeperPrice,
      fromCity,
      toCity,
      distanceKm,
      departureTime,
      arrivalTime,
      duration,
      newImage,
      busId,
    ];

    db.run(query, params, function (err) {
      callback(err, { changes: this.changes });
    });
  },

  getAllBusDetails: (callback) => {
    db.all("SELECT * FROM buses", callback);
  },

  getDeleteBusById: (busId, callback) => {
    db.run("DELETE FROM buses WHERE id = ?", [busId], callback);
  },
};
