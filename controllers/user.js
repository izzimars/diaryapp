const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../models/user");
const userrouter = express.Router();
const config = require("../utils/config");
const logger = require("../utils/logger");
const middleware = require("../utils/middleware");
const upload = require('../utils/cloudinary');
const secret = config.SECRET;
const {
  signupSchema,
  loginSchema,
  resendOTPSchema,
  forgotPasswordSchema,
  dateSchema,
  verifyOTPSchema,
  timeSchema,
  personalInfoSchema,
  newPasswordSchema,
  setupPasswdSchema,
  changeemailSchema,
  changeemailVerifySchema,
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
    let user;
    const userName = await User.findOne({ username:username });
    if ( userName) {
      return res.status(400).json({
        status: "error",
        message: "Username already exist",
      });
    }
    user = await User.findOne({ email: email });
    if (user ) {
      return res.status(400).json({
        status: "error",
        message: "Email already exist",
      });
    }
    const number = await User.findOne({ phonenumber: phonenumber });
    if ( number ) {
      return res.status(400).json({
        status: "error",
        message: "Phonenumber already exist",
      });
    }
    user = new User({ fullname, username, email, phonenumber, password });
    const result = await user.save();
    logger.info("Sending OTP to:", result._id, result.email);
    sendOTPVerificationEmail(result.email, res);
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error",
    });
  }
});

const sendOTPVerificationEmail = async (email, res) => {
  try {
    const user = await User.findOne({ email });
    logger.info("Generating OTP for user ID:", user._id);
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    logger.info(otp);
    const mailOptions = {
      from: config.EMAIL_USER,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter <b>${otp}</b> in the app to complete your verification.</p>. OTP expires in 6 minutes</p>`,
    };

    const salt = await bcrypt.genSalt(10);
    const hashedOTP = await bcrypt.hash(otp, salt);
    await userOtpVerification.deleteMany({ userId: user._id });
    logger.info(`Deleted former otp for ${user._id}`);
    const newOTPverification = new userOtpVerification({
      userId: user._id,
      otp: hashedOTP,
      createdat: Date.now(),
      expiredat: Date.now() + 360000,
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

    logger.info("OTP sent to:", email);
    res.status(200).json({
      status: "PENDING",
      message: "Verification OTP sent",
      data: { email },
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
    let { email, otp } = req.body;
    const user = await User.findOne({ email:email });
    if (!user ) {
      return res.status(400).json({
        status: "error",
        message: "User email not registered",
      });
    }
    const userotprecord = await userOtpVerification.find({ userId: user._id });
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
        await userOtpVerification.deleteMany({ userId: user._id });
        return res.status(404).json({
          status: "error",
          message: "OTP has expired",
        });
      } else {
        const validotp = await bcrypt.compare(otp, hashedotp);
        if (!validotp) {
          return res.status(404).json({
            status: "error",
            message: "Invalid OTP",
          });
        }
        await User.updateOne({ _id: user._id }, { verified: true });
        await userOtpVerification.deleteMany({ userId: user._id });
        logger.info(`Email successfully verified for ${email}`);
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

//resend token
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
      sendOTPVerificationEmail(user.email, res);
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
    const token = jwt.sign({ userId: user._id }, secret, { expiresIn: "3h" });
    return res.status(200).json({
      status: "success",
      message: "user signed in successfully",
      data: [
        { token: token },
        { username: user.username },
        { email: user.email },
        {setup: user.setup}
      ],
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
userrouter.post(
  "/forgotpassword",
  validate(forgotPasswordSchema),
  async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ email });
      user.verified = false;
      await user.save();
      logger.info(`Send token to reset password to ${user._id}`);
      sendOTPVerificationEmail(user.email, res);
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
        error: "Internal Server Error",
      });
    }
  }
);

//new password
userrouter.post(
  "/newpassword/",
  validate(newPasswordSchema),
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }
      if (!user.verified) {
        return res.status(404).json({
          status: "error",
          message: "User is not found",
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

//setting up user
userrouter.post(
  "/setup",
  validate(timeSchema),
  middleware.verifyToken,
  async (req, res) => {
    //{"times":["00:30 am", "5:40 pm","8:15 pm"]}
    var suc = 0;
    var fai = 0;
    const reminders = req.body.times;
    for (const time of reminders) {
      try {
        let rem = await addReminder(req.userId, time);
        if (rem.status === "success") {
          suc += 1;
        } else if (rem.status === "error") {
          fai += 1;
        }
      } catch (err) {
        return res.status(500).json({
          status: "error",
          message: err.message,
        });
      }
    }
    const user = await User.findOne({_id:req.userId});
    user.setup = true;
    await user.save();
    return res.status(200).json({
      status: "success",
      message: `${fai} failures and ${suc} success`,
    });
  }
);

//change personal settings
userrouter.get("/personalinfo", middleware.verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    return res.status(200).json({
      status: "success",
      message: "User data successfully retrieved",
      data: [
        { fullname: user.fullname },
        { username: user.username },
        { email: user.email },
        { phonenumber: user.phonenumber },
        { verified: user.verified },
        { profilePicture: user.profilePicture}
      ],
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }
});

userrouter.post('/uploadProfilePicture',middleware.verifyToken, upload.single('profilePicture'), async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId }); 
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found"
      });
    }
    console.log(user)
    user.profilePicture = req.file.path; // Cloudinary file path
    await user.save();
    res.status(200).json({
      status: "success",
      message: "Profile picture successfully uploaded",
      data: {
        profilePicture: user.profilePicture
      }
    });
  } catch (err) {
    console.error("Error uploading profile picture", err);
    res.status(500).json({
      status: "error",
      message: err.message,
      error: "Internal Server Error"
    });
  }
});

userrouter.post(
  "/personalinfo",
  validate(personalInfoSchema),
  middleware.verifyToken,
  async (req, res) => {
    const { fullname, username, phonenumber } = req.body;
    try {
      const user = await User.findOne({ _id: req.userId });
      user.fullname = fullname || user.fullname;
      user.username = username || user.username;
      user.phonenumber = phonenumber || user.phonenumber;
      await user.save();
      return res.status(200).json({
        status: "success",
        message: "User details successfully edited",
      });
    } catch (err) {
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
);

userrouter.post(
  "/personalinfo/changepassword",
  validate(setupPasswdSchema),
  middleware.verifyToken,
  async (req, res) => {
    const { oldpassword, password } = req.body;
    try {
      const user = await User.findOne({ _id: req.userId });
      if (!user || !(await bcrypt.compare(oldpassword, user.password))) {
        return res.status(400).json({
          status: "error",
          message: "old password invalid",
        });
      }
      user.password = password;
      await user.save();
      logger.info(`User ${user.username} has successfully changed password.`);
      return res.status(200).json({
        status: "success",
        message: "Password successfuly changed",
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
);

userrouter.post(
  "/personalinfo/changeemail",
  validate(changeemailSchema),
  middleware.verifyToken,
  async (req, res) => {
    const { email } = req.body;
    try {
      const user = await User.findOne({ _id: req.userId });
      user.verified = false;
      user.email = email;
      await user.save();
      logger.info("Deleting User otp record");
      await userOtpVerification.deleteMany({ userId: user._id });
      sendOTPVerificationEmail(email, res);
    } catch (err) {
      console.log(err);
      return res.status(500).json({
        status: "error",
        message: err.message,
      });
    }
  }
);

// Protect routes with verifyToken middleware
app.use('/protected', middleware.verifyToken, (req, res) => {
  res.status(200).json({ status: 'success', message: 'You have access to this protected route.' });
});

userrouter.post(
  "/personalinfo/changeemail/verify",
  validate(changeemailVerifySchema),
  middleware.verifyToken,
  async (req, res) => {
    const { otp } = req.body;
    try {
      const userotprecord = await userOtpVerification.find({
        userId: req.userId,
      });
      if (userotprecord.length < 1) {
        return res.status(404).json({
          status: "error",
          message: "Restricted access to user",
        });
      } else {
        const hashedotp = userotprecord[0].otp;
        const expiresat = userotprecord[0].expiresat;

        if (expiresat < Date.now()) {
          await userOtpVerification.deleteMany({ userId: req.userId });
          return res.status(404).json({
            status: "error",
            message: "OTP has expired",
          });
        } else {
          const validotp = await bcrypt.compare(otp, hashedotp);
          if (!validotp) {
            return res.status(404).json({
              status: "error",
              message: "Invalid OTP",
            });
          }
          await User.updateOne({ _id: req.userId }, { verified: true });
          await userOtpVerification.deleteMany({ userId: req.userId });
          logger.info(`Email successfully verified for ${req.userId}`);
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
  }
);
module.exports = userrouter;
