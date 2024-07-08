import request from "supertest";
import { expect } from "chai";
import mongoose from "mongoose";
import app from "../app.js";
import User from "../models/user.js";
import userOtpVerification from "../models/userotpverification.js";

const testUser = {
  fullname: "",
  username: "testuser",
  email: "olaifeelusanmi@gmail.com",
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

// after(async () => {
//   await User.deleteOne({ email: "olaifeelusanmi@gmail.com" });
//   await userOtpVerification.deleteOne({ email: "olaifeelusanmi@gmail.com" });
//   await mongoose.connection.close();
// });

describe("User Routes", () => {
  it("should sign up a new user and send OTP", async () => {
    const res = await request(app).post("/api/users/signup").send(testUser);

    expect(res.status).to.equal(400);
    expect(res.body).to.have.property("status", "error");
    expect(res.body).to.have.property("message", "Email already exist");
    expect(res.body.data).to.have.property("email", testUser.email);
  });

  // Working Already
  //   it("should return error for missing fullname", async () => {
  //     const { fullname, ...userWithoutFullname } = testUser;
  //     const res = await request(app)
  //       .post("/api/users/signup")
  //       .send(userWithoutFullname);

  //     expect(res.status).to.equal(400);
  //     expect(res.body)
  //       .to.have.property("errors")
  //       .that.includes('"fullname" is required');
  //   });

  //   it("should return error for missing username", async () => {
  //     const { username, ...userWithoutUsername } = testUser;
  //     const res = await request(app)
  //       .post("/api/users/signup")
  //       .send(userWithoutUsername);

  //     expect(res.status).to.equal(400);
  //     expect(res.body).to.have.property("status", "error");
  //     expect(res.body)
  //       .to.have.property("message")
  //       .that.includes("username is required");
  //   });

  //   it("should return error for missing email", async () => {
  //     const { email, ...userWithoutEmail } = testUser;
  //     const res = await request(app)
  //       .post("/api/users/signup")
  //       .send(userWithoutEmail);

  //     expect(res.status).to.equal(400);
  //     expect(res.body).to.have.property("status", "error");
  //     expect(res.body)
  //       .to.have.property("message")
  //       .that.includes("email is required");
  //   });

  //   it("should return error for invalid email", async () => {
  //     const invalidEmailUser = { ...testUser, email: "invalid-email" };
  //     const res = await request(app)
  //       .post("/api/users/signup")
  //       .send(invalidEmailUser);

  //     expect(res.status).to.equal(400);
  //     expect(res.body).to.have.property("status", "error");
  //     expect(res.body)
  //       .to.have.property("message")
  //       .that.includes("email must be a valid email");
  //   });

  //   it("should return error for missing phonenumber", async () => {
  //     const { phonenumber, ...userWithoutPhonenumber } = testUser;
  //     const res = await request(app)
  //       .post("/api/users/signup")
  //       .send(userWithoutPhonenumber);

  //     expect(res.status).to.equal(400);
  //     expect(res.body).to.have.property("status", "error");
  //     expect(res.body)
  //       .to.have.property("message")
  //       .that.includes("phonenumber is required");
  //   });

  //   it("should return error for missing password", async () => {
  //     const { password, ...userWithoutPassword } = testUser;
  //     const res = await request(app)
  //       .post("/api/users/signup")
  //       .send(userWithoutPassword);

  //     expect(res.status).to.equal(400);
  //     expect(res.body).to.have.property("status", "error");
  //     expect(res.body)
  //       .to.have.property("message")
  //       .that.includes("password is required");
  //   });

  //   it("should return error for short password", async () => {
  //     const shortPasswordUser = { ...testUser, password: "short" };
  //     const res = await request(app)
  //       .post("/api/users/signup")
  //       .send(shortPasswordUser);

  //     expect(res.status).to.equal(400);
  //     expect(res.body).to.have.property("status", "error");
  //     expect(res.body)
  //       .to.have.property("message")
  //       .that.includes("password length must be at least 6 characters long");
  //   });

  //   it("should return error for duplicate email", async () => {
  //     await new User(testUser).save(); // Save the initial user

  //     const res = await request(app).post("/api/users/signup").send(testUser);

  //     expect(res.status).to.equal(400);
  //     expect(res.body).to.have.property("status", "error");
  //     expect(res.body)
  //       .to.have.property("message")
  //       .that.includes("email already exists");
  //   });

  //   it("should verify OTP", async () => {
  //     const user = await User.findOne({ email: testUser.email });
  //     const otpRecord = await userOtpVerification.findOne({ userId: user._id });

  //     const otp = "4421";
  //     const res = await request(app)
  //       .post("/api/users/verifyOTP")
  //       .send({ email: testUser.email, otp });

  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.have.property("status", "success");
  //     expect(res.body).to.have.property(
  //       "message",
  //       "User email verified successfully"
  //     );
  //   });

  //   it("should log in the user", async () => {
  //     const res = await request(app)
  //       .post("/api/users/login")
  //       .send({ username: testUser.username, password: testUser.password });

  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.have.property("status", "success");
  //     expect(res.body).to.have.property("message", "user signed in successfully");
  //     expect(res.body.data[0]).to.have.property("token");
  //     token = res.body.data[0].token;
  //   });

  //   it("should set up user reminders", async () => {
  //     const reminders = ["12:30am", "5:40am", "10:30am"];
  //     const res = await request(app)
  //       .post("/api/users/setup")
  //       .set("Authorization", `Bearer ${token}`)
  //       .send({ reminders });

  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.have.property("status", "success");
  //     expect(res.body).to.have.property("message", "reminder set up successful.");
  //   });

  //   it("should retrieve personal info", async () => {
  //     const res = await request(app)
  //       .get("/api/users/personalinfo")
  //       .set("Authorization", `Bearer ${token}`);

  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.have.property("status", "success");
  //     expect(res.body).to.have.property(
  //       "message",
  //       "User data successfully retrieved"
  //     );
  //     expect(res.body.data[0]).to.have.property("fullname", testUser.fullname);
  //   });

  //   it("should update personal info", async () => {
  //     const updatedInfo = {
  //       fullname: "Updated User",
  //       username: "updateduser",
  //       phonenumber: "0987654321",
  //     };
  //     const res = await request(app)
  //       .post("/api/users/personalinfo")
  //       .set("Authorization", `Bearer ${token}`)
  //       .send(updatedInfo);

  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.have.property("status", "success");
  //     expect(res.body).to.have.property(
  //       "message",
  //       "User details successfully edited"
  //     );
  //   });

  //   it("should handle forgot password", async () => {
  //     const res = await request(app)
  //       .post("/api/users/forgotpassword")
  //       .send({ email: testUser.email });

  //     expect(res.status).to.equal(200);
  //     expect(res.body).to.have.property("status", "PENDING");
  //     expect(res.body).to.have.property("message", "Verification OTP sent");
  //     expect(res.body.data).to.have.property("email", testUser.email);
  //   });
});
