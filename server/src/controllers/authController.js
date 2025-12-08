require("dotenv").config({ path: "../.env" });
//require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/authModel");

exports.register = (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields are required." });
  }

  User.findByEmail(email, async (err, existingUser) => {
    if (err)
      return res.status(400).json({ status: 400, message: "Data base error" });

    if (existingUser) {
      res.status(400).json({ status: 400, message: "User already exists" });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      User.CreateUser(userName, email, hashedPassword, (err) => {
        if (err)
          return res
            .status(400)
            .json({ status: 400, message: "Failed to register user." });

        res.json({ status: 200, message: "user register successfully." });
      });
    } catch (error) {
      console.error("user register failed");
      res.status(500).json({ status: 500, message: "user register faied" });
    }
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    return res
      .status(400)
      .json({ status: 400, message: "All fields are reqiured." });
  }

  try {
    User.CheckExistingUser(email, async (err, existingUser) => {
      if (err) return res.status(400).json({ message: "Dabase error" });
      // console.log(existingUser, "exist user");
      // console.log("env : ", process.env.JWT_SECRET);

      if (!existingUser)
        return res
          .status(400)
          .json({ status: 400, message: "Invalid user name" });

      const validPassword = await bcrypt.compare(
        password,
        existingUser.password
      );

      // console.log(validPassword, "valid");

      if (!validPassword)
        return res
          .status(400)
          .json({ status: 400, message: "Invalid password." });

      const token = jwt.sign({ id: existingUser.id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      // console.log(token, "token");

      res.status(200).json({
        status: 200,
        message: "User login successfully.",
        token,
        user_id: existingUser.id,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ status: 400, message: "failed to login user." });
  }
};
