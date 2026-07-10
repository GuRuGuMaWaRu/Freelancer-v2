import assert from "assert";
import jwt from "jsonwebtoken";
import request from "supertest";

import app from "../app";
import Project from "../resources/project/project.model";
import Client from "../resources/client/client.model";
import User from "../resources/user/user.model";
import jwtSignOptions from "../utils/jwtOptions";
import { getAuthToken, getTestUserId } from "./test-helpers";

describe("Project forChart", () => {
  it("should return only the current user's projects within the months filter", async () => {
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

    const now = new Date();
    const oldDate = new Date(now);
    oldDate.setMonth(oldDate.getMonth() - 6);

    const currentUserOldProject = new Project({
      client: currentUserClient._id,
      user: userId,
      projectNr: "OLD-001",
      currency: "USD",
      payment: 50,
      date: oldDate,
    });
    const currentUserRecentProject = new Project({
      client: currentUserClient._id,
      user: userId,
      projectNr: "REC-001",
      currency: "USD",
      payment: 100,
      date: now,
    });
    const otherUserRecentProject = new Project({
      client: otherUserClient._id,
      user: otherUser._id,
      projectNr: "OTH-001",
      currency: "USD",
      payment: 500,
      date: now,
    });

    await Promise.all([
      currentUserOldProject.save(),
      currentUserRecentProject.save(),
      otherUserRecentProject.save(),
    ]);

    const filteredResponse = await request(app)
      .get("/api/v1/projects/forChart?months=3")
      .set("Authorization", `Bearer ${getAuthToken()}`)
      .expect(200);

    assert.strictEqual(filteredResponse.body.results, 1);
    assert.strictEqual(filteredResponse.body.data.length, 1);
    assert.strictEqual(filteredResponse.body.data[0].projectNr, "REC-001");

    const otherUserResponse = await request(app)
      .get("/api/v1/projects/forChart?months=3")
      .set("Authorization", `Bearer ${otherToken}`)
      .expect(200);

    assert.strictEqual(otherUserResponse.body.results, 1);
    assert.strictEqual(otherUserResponse.body.data[0].projectNr, "OTH-001");
  });

  it("should return all non-deleted projects when months is omitted", async () => {
    const userId = getTestUserId();

    const client = new Client({
      name: "Chart Client",
      user: userId,
    });
    await client.save();

    const now = new Date();
    const oldDate = new Date(now);
    oldDate.setMonth(oldDate.getMonth() - 6);

    const oldProject = new Project({
      client: client._id,
      user: userId,
      projectNr: "ALL-OLD",
      currency: "USD",
      payment: 50,
      date: oldDate,
    });
    const recentProject = new Project({
      client: client._id,
      user: userId,
      projectNr: "ALL-REC",
      currency: "USD",
      payment: 100,
      date: now,
    });
    const deletedProject = new Project({
      client: client._id,
      user: userId,
      projectNr: "ALL-DEL",
      currency: "USD",
      payment: 200,
      date: now,
      deleted: true,
    });

    await Promise.all([
      oldProject.save(),
      recentProject.save(),
      deletedProject.save(),
    ]);

    const response = await request(app)
      .get("/api/v1/projects/forChart")
      .set("Authorization", `Bearer ${getAuthToken()}`)
      .expect(200);

    assert.strictEqual(response.body.results, 2);

    const projectNumbers = response.body.data.map(
      (project: { projectNr: string }) => project.projectNr,
    );
    assert.ok(projectNumbers.includes("ALL-OLD"));
    assert.ok(projectNumbers.includes("ALL-REC"));
    assert.ok(!projectNumbers.includes("ALL-DEL"));
  });
});
