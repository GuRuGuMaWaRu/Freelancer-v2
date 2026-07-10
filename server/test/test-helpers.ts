import "../env";

import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import Project from "../resources/project/project.model";
import Client from "../resources/client/client.model";
import User from "../resources/user/user.model";
import jwtSignOptions from "../utils/jwtOptions";

let testUserId: string | null = null;
let authToken: string | null = null;

function getAuthToken(): string {
  if (!authToken) {
    throw new Error("Auth token is not initialized");
  }

  return authToken;
}

function getTestUserId(): string {
  if (!testUserId) {
    throw new Error("Test user ID is not initialized");
  }

  return testUserId;
}

before(async function setupTestDatabase() {
  this.timeout(10000);

  const dbUri = process.env.DB_TEST || process.env.DB_MAIN;

  if (!dbUri) {
    throw new Error("DB_TEST or DB_MAIN must be set for tests");
  }

  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;

  if (!accessTokenSecret) {
    throw new Error("ACCESS_TOKEN_SECRET must be set for tests");
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
  authToken = jwt.sign({ id: testUserId }, accessTokenSecret, jwtSignOptions);
});

beforeEach(async () => {
  await Promise.all([Project.deleteMany().exec(), Client.deleteMany().exec()]);
});

after(async function teardownTestDatabase() {
  this.timeout(10000);
  await mongoose.disconnect();
});

export { getAuthToken, getTestUserId };
