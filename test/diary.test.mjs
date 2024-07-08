// import request from "supertest";
// import { expect } from "chai";
// import mongoose from "mongoose";
// import app from "../app.js";
// import Diary from "../models/diary.js";
// import User from "../models/user.js";

// const testUser = {
//   email: "testuser@example.com",
//   password: "password",
//   phonenumber: "08023052912",
//   username: "tested",
//   fullname: "tested user",
// };

// const testDiary = {
//   content: "This is a test diary entry",
// };

// let token;
// let diaryId;

// before(async () => {
//   await mongoose.connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   });

//   // Ensure test user is created
//   let user = await User.findOne({ email: testUser.email });
//   if (!user) {
//     user = new User(testUser);
//     await user.save();
//   }

//   // Generate the token manually
//   token = jwt.sign({ userId: user._id }, config.SECRET, { expiresIn: "1h" });
// });

// after(async () => {
//   await User.deleteMany({});
//   await mongoose.connection.close();
// });

// describe("Diary API", () => {
//   it("should create a new diary entry", async () => {
//     const res = await request(app)
//       .post("/api/diaries/")
//       .set(
//         "Authorization",
//         `Bearer $2a$10$ZgBC4amb81.YfZrZt9vmIOMnlRgU/dRR2S5ua0Sjkgk0k6huTta9a`
//       )
//       .send(testDiary);

//     expect(res.status).to.equal(201);
//     expect(res.body).to.have.property("data");
//     expect(res.body.data).to.have.property("content", testDiary.content);
//   });

//   it("should get all diary entries", async () => {
//     const res = await request(app)
//       .get("/api/diaries/diary")
//       .set(
//         "Authorization",
//         `Bearer: "$2a$10$ZgBC4amb81.YfZrZt9vmIOMnlRgU/dRR2S5ua0Sjkgk0k6huTta9a"`
//       );

//     expect(res.status).to.equal(200);
//     expect(res.body).to.have.property("data");
//     expect(res.body.data).to.be.an("array");
//   });

//   it("should get a single diary entry by ID", async () => {
//     const diary = new Diary({
//       userId: res.body.data._id,
//       content: testDiary.content,
//     });
//     await diary.save();

//     const res = await request(app)
//       .get(`/api/diaries/diary/${diary._id}`)
//       .set(
//         "Authorization",
//         `Bearer $2a$10$ZgBC4amb81.YfZrZt9vmIOMnlRgU/dRR2S5ua0Sjkgk0k6huTta9a`
//       );

//     expect(res.status).to.equal(200);
//     expect(res.body).to.have.property("data");
//     expect(res.body.data).to.have.property("content", testDiary.content);
//   });

//   it("should update a diary entry", async () => {
//     const diary = new Diary({
//       userId: res.body.data._id,
//       content: testDiary.content,
//     });
//     await diary.save();

//     const updatedContent = { content: "Updated diary content" };

//     const res = await request(app)
//       .patch(`/api/diaries/diary/${diary._id}`)
//       .set(
//         "Authorization",
//         `Bearer $2a$10$ZgBC4amb81.YfZrZt9vmIOMnlRgU/dRR2S5ua0Sjkgk0k6huTta9a`
//       )
//       .send(updatedContent);

//     expect(res.status).to.equal(200);
//     expect(res.body).to.have.property("data");
//     expect(res.body.data).to.have.property("content", updatedContent.content);
//   });

//   it("should delete a diary entry", async () => {
//     const diary = new Diary({
//       userId: res.body.data._id,
//       content: testDiary.content,
//     });
//     await diary.save();

//     const res = await request(app)
//       .delete(`/api/diaries/diary/${diary._id}`)
//       .set(
//         "Authorization",
//         `Bearer $2a$10$ZgBC4amb81.YfZrZt9vmIOMnlRgU/dRR2S5ua0Sjkgk0k6huTta9a`
//       );

//     expect(res.status).to.equal(200);
//   });
// });
