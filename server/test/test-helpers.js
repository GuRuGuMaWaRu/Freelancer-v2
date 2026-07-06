const path = require("path");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

require("dotenv").config({ path: path.join(__dirname, "../../.env.server") });

const Project = require("../resources/project/project.model");
const Client = require("../resources/client/client.model");
const User = require("../resources/user/user.model");

let testUserId = null;
let authToken = null;

function getAuthToken() {
  return authToken;
}

function getTestUserId() {
  return testUserId;
}

before(async function () {
  this.timeout(10000);

  const dbUri = process.env.DB_TEST || process.env.DB_MAIN;

  if (!dbUri) {
    throw new Error("DB_TEST or DB_MAIN must be set for tests");
  }

  await mongoose.connect(dbUri);

  let user = await User.findOne({ email: "test@example.com" });

  if (!user) {
    user = await User.create({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });
  }

  testUserId = user._id.toString();
  authToken = jwt.sign(
    { id: testUserId },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );
});

beforeEach(async () => {
  await Promise.all([
    Project.deleteMany().exec(),
    Client.deleteMany().exec(),
  ]);
});

module.exports = {
  getAuthToken,
  getTestUserId,
};
