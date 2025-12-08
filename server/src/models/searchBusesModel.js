const db = require("../config/database");

module.exports = {
  getBuses: (fromCity, toCity, date, callback) => {
    const query = `
    SELECT DISTINCT b.* FROM buses b
    JOIN bus_stops s1 ON b.id = s1.bus_id
    JOIN bus_stops s2 ON b.id = s2.bus_id
    WHERE LOWER(s1.stop_name) = LOWER(?)
    AND LOWER(s2.stop_name) = LOWER(?)
    AND s1.stop_order < s2.stop_order
    `;

    db.all(query, [fromCity, toCity], (err, buses) => {
      if (err) return callback(err, null);

      return callback(null, buses);
    });
  },
};
