const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const userrouter = express.Router();
const config = require("../utils/config");
const logger = require("../utils/logger");
const secret = config.SECRET;
const {
  signupSchema,
  loginSchema,
  resendOTPSchema,
  forgotPasswordSchema,
  dateSchema,
  verifyOTPSchema,
} = require("../models/validationschema");
const validate = require("../utils/validate");
const makeReminder = require("../models/reminderbot");
//const { findUserByEmail, updateUser } = require("./findfunctions");
const { addReminder, scheduleAllReminders } = require("./reminderbot");
const userOtpVerification = require("../models/userotpverification");
const { getLogger } = require("nodemailer/lib/shared");

// Sign up User
userrouter.post("/signup", validate(signupSchema), async (req, res) => {
  const { fullname, username, email, phonenumber, password } = req.body;
  try {
    const user = new User({ fullname, username, email, phonenumber, password });
    const result = await user.save();
    logger.info("User saved:", result);
    logger.info("Sending OTP to:", result._id, result.email);
    sendOTPVerificationEmail(result._id, result.email, res);
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

const sendOTPVerificationEmail = async (_id, email, res) => {
  try {
    console.log("Generating OTP for user ID:", _id);
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const mailOptions = {
      from: config.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter <b>${otp}</b> in the app to complete your verification.</p>. OTP expires in 1 hour`,
    };

    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    const newOTPverification = new userOtpVerification({
      userId: _id,
      otp: hashedOTP,
      createdat: Date.now(),
      expiredat: Date.now() + 3600000,
    });
    await newOTPverification.save();

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: config.EMAIL_USER,
        pass: config.EMAIL_PASS,
      },
    });

    await transporter.sendMail(mailOptions);

    console.log("OTP sent to:", email);
    res.status(200).json({
      status: "PENDING",
      message: "Verification OTP sent",
      data: { user_id: _id, email },
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({
      status: "FAILED",
      message: error.message,
    });
  }
};

// Verify OTP
userrouter.post("/verifyOTP", validate(verifyOTPSchema), async (req, res) => {
  try {
    let { user_id, otp } = req.body;
    const userotprecord = await userOtpVerification.find({ userId: user_id });
    if (userotprecord.length < 1) {
      return res.status(404).json({
        status: "error",
        message:
          "Account record dose not exists or user has been verified, please sign up or login",
      });
    } else {
      const hashedotp = userotprecord[0].otp;
      const expiresat = userotprecord[0].expiresat;

      if (expiresat < Date.now()) {
        await userOtpVerification.deleteMany({ userId: user_id });
        return res.status(404).json({
          status: "error",
          message: "OTP has expired",
        });
      } else {
        const validotp = await bcrypt.compare(otp, hashedotp);
        console.log(validotp);
        if (!validotp) {
          return res.status(404).json({
            status: "error",
            message: "Invalid OTP",
          });
        }
        await User.updateOne({ _id: user_id }, { verified: true });
        await userOtpVerification.deleteMany({ userId: user_id });
        return res.status(200).json({
          status: "success",
          message: "User email verified successfully",
        });
      }
    }
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
});

//reverify token
userrouter.post(
  "/resendOTPCode",
  validate(resendOTPSchema),
  async (req, res) => {
    try {
      let { email } = req.body;
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User has no records",
        });
      }
      logger.info("Deleting User otp record");
      await userOtpVerification.deleteMany({ userId: user._id });
      logger.info("Sending OTP to:", user._id);
      sendOTPVerificationEmail(user._id, user.email, res);
    } catch (err) {
      return res.status(400).json({
        status: "error",
        message: err.message,
      });
    }
  }
);

// Login User
userrouter.post("/login", validate(loginSchema), async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        status: "error",
        message: "Invalid credentials",
      });
    }
    if (!user.verified) {
      return res.status(400).json({
        status: "error",
        message: "User not verified",
      });
    }
    logger.info(`User ${user.username} has been successfully signed in.`);
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
    return res.status(200).json({
      status: "success",
      token: token,
      username: user.username,
      email: user.email,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

//forgot password
// userrouter.post("/forgotpassword", async (req, res) => {
//   const { email } = req.body;
//   try {
//     const user = await findUserByEmail(email);
//     // Send verification email
//     const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: { user: "your_email@gmail.com", pass: "your_email_password" },
//     });
//     const mailOptions = {
//       from: "your_email@gmail.com",
//       to: user.email,
//       subject: "Verify Your Email",
//       text: `Click this link to change password: http://localhost:3000/api/users/newpassword/${token}`,
//     };
//     await transporter.sendMail(mailOptions);

//     return res.status(200).json({
//       status: "success",
//       message: "verification email sent",
//     });
//   } catch (err) {
//     return res.status(500).json({
//       status: "error",
//       message: err.message,
//       error: "Internal Server Error",
//     });
//   }
// });

// //new password
// userrouter.get(
//   "/newpassword/:token",
//   validate(forgotPasswordSchema),
//   async (req, res) => {
//     try {
//       const decoded = jwt.verify(req.params.token, secret);
//       const user = await User.findById(decoded.userId);
//       if (!user) {
//         return res.status(404).json({
//           status: "error",
//           message: "User not found",
//         });
//       }
//       user.password = password;
//       await user.save();
//       return res.status(200).json({
//         status: "success",
//         message: "password successfully changed",
//       });
//     } catch (err) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid or expired token",
//       });
//     }
//   }
// );

// setting up user
// userrouter.post("/setup", async (req, res) => {
//   const { reminders } = req.body;
//   //reminders = {"12:30am", "5:40am","10:30am"}
//   try {
//     const user = await findUserByEmail(email);
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).json({
//         status: "error",
//         message: "Invalid credentials",
//       });
//     }
//     if (!user.emailverified || !user.numberverified) {
//       return res.status(400).json({
//         status: "error",
//         message: "User not verified",
//       });
//     }
//     reminders.map((i) => {
//       addReminder(user, time);
//     });
//     await user.save();
//     // need to verify token or user or get user credentials
//     // const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "1h" });
//     // return res.status(200).json({
//     //   status: "success",
//     //   token: token,
//     // });
//   } catch (err) {
//     return res.status(500).json({
//       status: "error",
//       message: err.message,
//     });
//   }
// });

// //change personal settings
// userrouter.post("/personalinfo", async (req, res) => {
//   //more input to be added
//   const { fullname, username } = req.body;
//   try {
//     //I DON'T YET KNOW HOW TO GET THE USER id
//     //const userId = userId
//     const newValues = {
//       fullname: fullname,
//       username: username,
//     };
//     updateUser(userId, newValues).catch(logger.error);

//     return res.status(200).json({
//       status: "success",
//       message: "User registered, verification email sent",
//     });
//   } catch (err) {
//     return res.status(500).json({
//       status: "error",
//       message: err.message,
//     });
//   }
// });

module.exports = userrouter;
