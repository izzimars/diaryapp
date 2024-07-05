const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const userrouter = express.Router();
const config = require("../utils/config");
const secret = config.SECRET;
const {
  signupSchema,
  loginSchema,
  forgotPasswordSchema,
  dateSchema,
} = require("../models/validationschema");
const validate = require("../utils/validate");
const makeReminder = require("../models/reminderbot");
const {findUserByEmail, updateUser} = require("./findfunctions");

// Register User
userrouter.post("/register", validate(signupSchema), async (req, res) => {
  //more input to be added
  const { fullname, username, email, phonenumber, password } = req.body;
  try {
    const user = new User({ fullname, username, email, phonenumber, password  });
    const flag = await user.save();

    // Send verification email
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "your_email@gmail.com", pass: "your_email_password" },
    });
    const mailOptions = {
      from: "your_email@gmail.com",
      to: user.email,
      subject: "Verify Your Email",
      text: `Click this link to verify your email: http://localhost:3000/api/users/verify/${token}`,
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      status: "success",
      message: "User registered, verification email sent",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

// Verify Email
userrouter.get("/verify/:token", async (req, res) => {
  try {
    const decoded = jwt.verify(req.params.token, secret);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }
    user.verified = true;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: "Email verified successfully",
    });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: "Invalid or expired token",
    });
  }
});

// Login User
userrouter.post("/login", validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        status: "error",
        message: "Invalid credentials",
      });
    }
    if (!user.emailverified || !user.numberverified) {
      return res.status(400).json({
        status: "error",
        message: "User not verified",
      });
    }
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
    return res.status(200).json({
      status: "success",
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

//forgot password
userrouter.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await findUserByEmail(email);
    // Send verification email
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: "your_email@gmail.com", pass: "your_email_password" },
    });
    const mailOptions = {
      from: "your_email@gmail.com",
      to: user.email,
      subject: "Verify Your Email",
      text: `Click this link to change password: http://localhost:3000/api/users/newpassword/${token}`,
    };
    await transporter.sendMail(mailOptions);

    return res.status(200).json({
      status: "success",
      message: "verification email sent",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

//new password
userrouter.get(
  "/newpassword/:token",
  validate(forgotPasswordSchema),
  async (req, res) => {
    try {
      const decoded = jwt.verify(req.params.token, secret);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }
      user.password = password;
      await user.save();
      return res.status(200).json({
        status: "success",
        message: "password successfully changed",
      });
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: "Invalid or expired token",
      });
    }
  }
);

// setting up user
userrouter.post("/setup", async (req, res) => {
  const { reminder, morning, afternoon, evening } = req.body;
  try {
    const user = await findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        status: "error",
        message: "Invalid credentials",
      });
    }
    if (!user.emailverified || !user.numberverified) {
      return res.status(400).json({
        status: "error",
        message: "User not verified",
      });
    }
    const morningtime = makeReminder(morning, user);
    user.morning = morningtime;
    const afternoontime = makeReminder(afternoon, user);
    user.afternoon = afternoontime;
    const eveningtime = makeReminder(evening, user);
    user.evening = eveningtime;
    await user.save();
    // need to verify token or user or get user credentials
    // const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
    // return res.status(200).json({
    //   status: "success",
    //   token: token,
    // });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

//change personal settings
userrouter.post("/personalinfo", async (req, res) => {
  //more input to be added
  const { fullname, username } = req.body;
  try {
    //I DON'T YET KNOW HOW TO GET THE USER id
    //const userId = userId
    const newValues = {
      fullname : fullname, username: username
    }
    updateUser(userId, newValues).catch(logger.error);

    return res.status(200).json({
      status: "success",
      message: "User registered, verification email sent",
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

module.exports = userrouter;
