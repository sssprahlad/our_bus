const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// const db = new sqlite3.Database("../bus.db", (err) => {
//   if (err) console.error("Data connection failed : ", err.message);
//   else console.log("Database Connectted Successfully.");
// });

const dbPath = path.join(__dirname, "../../bus.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error("Database connection failed:", err.message);
  else console.log("Database Connected Successfully.");
});

db.run(`
    CREATE TABLE IF NOT EXISTS users(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_name TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL
    )
    `);

db.run(`CREATE TABLE IF NOT EXISTS buses(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus_name TEXT NOT NULL,
    bus_type TEXT NOT NULL,
    total_seats INTEGER NOT NULL,
    total_sleeper INTEGER DEFAULT 0,
    seat_price INTEGER NOT NULL,
    sleeper_price INTEGER NOT NULL,
    from_city TEXT NOT NULL,
    to_city TEXT NOT NULL,
    distance_km INTEGER NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    duration TEXT,
    bus_image TEXT NOT NULL
    )
    `);

db.run(`
  CREATE TABLE IF NOT EXISTS seats(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus_id INTEGER NOT NULL,
    seat_number TEXT NOT NULL,
    seat_type TEXT NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES buses(id)
  )
`);

db.run(`
CREATE TABLE IF NOT EXISTS seat_availability (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seat_number TEXT NOT NULL,
    bus_id INTEGER NOT NULL,
    seat_type TEXT NOT NULL,
    travel_date TEXT NOT NULL,
    is_available INTEGER DEFAULT 1,
    UNIQUE(seat_number, bus_id, travel_date),
    FOREIGN KEY (seat_number) REFERENCES seats(seat_number),
    FOREIGN KEY (bus_id) REFERENCES buses(id)
)
`);

db.run(`
    CREATE TABLE IF NOT EXISTS bookings(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bus_id INTEGER NOT NULL,
    seat_number INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_name TEXT NOT NULL,
    gender TEXT NOT NULL,
    age TEXT NOT NULL,
    phone_number TEXT NOT NULL,
    travel_date TEXT NOT NULL,
    boarding_point TEXT NOT NULL,
    droping_point TEXT NOT NULL,
    seat_type TEXT NOT NULL,
    FOREIGN KEY (bus_id) REFERENCES buses(id),
    FOREIGN KEY (seat_number) REFERENCES seats(seat_number),
    FOREIGN KEY (user_id) REFERENCES users(id)

    )
    `);

db.run(`CREATE TABLE IF NOT EXISTS bus_stops(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        bus_id INTEGER NOT NULL,
        stop_name TEXT NOT NULL,
        stop_order INTEGER NOT NULL,
        FOREIGN KEY (bus_id) REFERENCES buses(id)
        )`);

// boarding_point_time TEXT NOT NULL,
// droping_point_time TEXT NOT NULL,
module.exports = db;
