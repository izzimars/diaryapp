import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/user.js";
import userOtpVerification from "../models/userotpverification.js";

const testUser = {
  fullname: "Test User",
  username: "testuser",
  email: "elusamisegun6@gmail.com",
  phonenumber: "1234567890",
  password: "password",
};

let token;

before(async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

after(async () => {
  await User.deleteMany({});
  await userOtpVerification.deleteMany({});
  await mongoose.connection.close();
});

describe("User Routes", () => {
  it("should sign up a new user and send OTP", async () => {
    const res = await request(app).post("/api/users/signup").send(testUser);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "PENDING");
    expect(res.body).to.have.property("message", "Verification OTP sent");
    expect(res.body.data).to.have.property("email", testUser.email);
  });

  it("should verify OTP", async () => {
    const user = await User.findOne({ email: testUser.email });
    const otpRecord = await userOtpVerification.findOne({ userId: user._id });

    const otp = "4421";
    const res = await request(app)
      .post("/api/users/verifyOTP")
      .send({ email: testUser.email, otp });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property(
      "message",
      "User email verified successfully"
    );
  });

  it("should log in the user", async () => {
    const res = await request(app)
      .post("/api/users/login")
      .send({ username: testUser.username, password: testUser.password });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("message", "user signed in successfully");
    expect(res.body.data[0]).to.have.property("token");
    token = res.body.data[0].token;
  });

  it("should resend OTP", async () => {
    const res = await request(app)
      .post("/api/users/resendOTPCode")
      .send({ email: testUser.email });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "PENDING");
    expect(res.body).to.have.property("message", "Verification OTP sent");
    expect(res.body.data).to.have.property("email", testUser.email);
  });

  it("should set up user reminders", async () => {
    const reminders = ["12:30am", "5:40am", "10:30am"];
    const res = await request(app)
      .post("/api/users/setup")
      .set("Authorization", `Bearer ${token}`)
      .send({ reminders });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property("message", "reminder set up successful.");
  });

  it("should retrieve personal info", async () => {
    const res = await request(app)
      .get("/api/users/personalinfo")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property(
      "message",
      "User data successfully retrieved"
    );
    expect(res.body.data[0]).to.have.property("fullname", testUser.fullname);
  });

  it("should update personal info", async () => {
    const updatedInfo = {
      fullname: "Updated User",
      username: "updateduser",
      phonenumber: "0987654321",
    };
    const res = await request(app)
      .post("/api/users/personalinfo")
      .set("Authorization", `Bearer ${token}`)
      .send(updatedInfo);

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "success");
    expect(res.body).to.have.property(
      "message",
      "User details successfully edited"
    );
  });

  it("should handle forgot password", async () => {
    const res = await request(app)
      .post("/api/users/forgotpassword")
      .send({ email: testUser.email });

    expect(res.status).to.equal(200);
    expect(res.body).to.have.property("status", "PENDING");
    expect(res.body).to.have.property("message", "Verification OTP sent");
    expect(res.body.data).to.have.property("email", testUser.email);
  });
});
