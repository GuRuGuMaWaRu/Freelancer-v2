import assert from "assert";
import jwt from "jsonwebtoken";
import request from "supertest";

import app from "../app";
import Project from "../resources/project/project.model";
import Client from "../resources/client/client.model";
import User from "../resources/user/user.model";
import jwtSignOptions from "../utils/jwtOptions";
import { getAuthToken, getTestUserId } from "./test-helpers";

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
      process.env.ACCESS_TOKEN_SECRET as string,
      jwtSignOptions,
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
