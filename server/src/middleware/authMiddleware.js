// require("dotenv").config({ path: "../../.env" });
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    res.status(400).json({ message: "No Token Provided" });
  }

  console.log(authHeader, "auth header");

  const token = authHeader.split(" ")[1];

  console.log(token, "token");

  if (!token) return res.status(401).json({ message: "No Token Provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed : ", error.message);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
