const assert = require("assert");
const jwt = require("jsonwebtoken");
const request = require("supertest");

const app = require("../app");
const Project = require("../resources/project/project.model");
const Client = require("../resources/client/client.model");
const User = require("../resources/user/user.model");
const { getAuthToken, getTestUserId } = require("./test-helpers");

describe("Client withProjectData", () => {
  it("should return only the current user's client stats", async () => {
    const userId = getTestUserId();

    const otherUser = await User.create({
      name: "Other User",
      email: `other-${Date.now()}@example.com`,
      password: "password123",
    });

    const otherToken = jwt.sign(
      { id: otherUser._id.toString() },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
    );

    const currentUserClient = new Client({
      name: "Current User Client",
      user: userId,
    });
    const otherUserClient = new Client({
      name: "Other User Client",
      user: otherUser._id,
    });

    await Promise.all([currentUserClient.save(), otherUserClient.save()]);

    const currentUserProject = new Project({
      client: currentUserClient._id,
      user: userId,
      projectNr: "CUR-001",
      currency: "USD",
      payment: 100,
      date: new Date(),
    });
    const otherUserProject = new Project({
      client: otherUserClient._id,
      user: otherUser._id,
      projectNr: "OTH-001",
      currency: "USD",
      payment: 500,
      date: new Date(),
    });

    await Promise.all([currentUserProject.save(), otherUserProject.save()]);

    const currentUserResponse = await request(app)
      .get("/api/v1/clients/withProjectData")
      .set("Authorization", `Bearer ${getAuthToken()}`)
      .expect(200);

    assert.strictEqual(currentUserResponse.body.results, 1);
    assert.strictEqual(currentUserResponse.body.data.length, 1);
    assert.strictEqual(
      currentUserResponse.body.data[0].name,
      "Current User Client",
    );
    assert.strictEqual(currentUserResponse.body.data[0].totalEarnings, 100);

    const otherUserResponse = await request(app)
      .get("/api/v1/clients/withProjectData")
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(200);

    assert.strictEqual(otherUserResponse.body.results, 1);
    assert.strictEqual(otherUserResponse.body.data.length, 1);
    assert.strictEqual(
      otherUserResponse.body.data[0].name,
      "Other User Client",
    );
    assert.strictEqual(otherUserResponse.body.data[0].totalEarnings, 500);
  });
});
