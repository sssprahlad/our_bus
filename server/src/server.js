//require("dotenv").config();

require("dotenv").config({ path: "../.env" });

const express = require("express");
const cors = require("cors");
const authRouter = require("./routers/authRouter");
const busesRouter = require("./routers/busesRouter");
const bookingRouter = require("./routers/bookingRouter");
const searchRouter = require("./routers/searchBusesRouter");
const authMiddleware = require("./middleware/authMiddleware");

const port = process.env.PORT || 5050;

const app = express();

const allowedOrigins = [
  "https://our-bus.vercel.app",
  "https://our-bus.onrender.com",
  "http://localhost:3000",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS: " + origin));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routers

app.use("/api", authRouter);
app.use("/api", busesRouter);
app.use("/api", bookingRouter);
app.use("/api", searchRouter);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

module.exports = app;
