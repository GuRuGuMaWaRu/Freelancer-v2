import assert from "assert";
import mongoose from "mongoose";
import request from "supertest";

import app from "../app";
import Project from "../resources/project/project.model";
import Client from "../resources/client/client.model";
import User from "../resources/user/user.model";
import { getAuthToken, getTestUserId } from "./test-helpers";

describe("Project Controller", () => {
  it("should update a particular project on PATCH request to /api/v1/projects/:id", (done) => {
    const userId = getTestUserId();
    const client1 = new Client({ name: "Client 1", user: userId });

    client1.save().then(() => {
      const project1 = new Project({
        client: client1._id,
        user: userId,
        projectNr: "ABC123",
        currency: "EUR",
        payment: 100,
        date: new Date(),
      });

      project1.save().then(() => {
        request(app)
          .patch(`/api/v1/projects/${project1._id}`)
          .set("Authorization", `Bearer ${getAuthToken()}`)
          .send({
            payment: 111,
            projectNr: "ZYZ987",
            client: "Client 1",
          })
          .expect(200)
          .end((err, res) => {
            if (err) return done(err);
            assert.strictEqual(res.body.data.payment, 111);
            assert.strictEqual(res.body.data.projectNr, "ZYZ987");
            done();
          });
      });
    });
  });

  it("should reject a non-string client on PATCH request to /api/v1/projects/:id", (done) => {
    const userId = getTestUserId();
    const client1 = new Client({ name: "Client 1", user: userId });

    client1.save().then(() => {
      const project1 = new Project({
        client: client1._id,
        user: userId,
        projectNr: "ABC123",
        currency: "EUR",
        payment: 100,
        date: new Date(),
      });

      project1.save().then(() => {
        request(app)
          .patch(`/api/v1/projects/${project1._id}`)
          .set("Authorization", `Bearer ${getAuthToken()}`)
          .send({
            payment: 111,
            client: { $gt: "" },
          })
          .expect(400)
          .end(done);
      });
    });
  });

  it("should not create a client when PATCH targets a missing project", async () => {
    const missingProjectId = new mongoose.Types.ObjectId();

    await request(app)
      .patch(`/api/v1/projects/${missingProjectId}`)
      .set("Authorization", `Bearer ${getAuthToken()}`)
      .send({
        payment: 111,
        projectNr: "ZYZ987",
        client: "Brand New Client",
      })
      .expect(404);

    const clientCount = await Client.countDocuments({
      user: getTestUserId(),
      name: "Brand New Client",
    });

    assert.strictEqual(clientCount, 0);
  });

  it("should not create a client when PATCH targets another user's project", async () => {
    const userId = getTestUserId();

    const otherUser = await User.create({
      name: "Other User",
      email: `other-${Date.now()}@example.com`,
      password: "password123",
    });

    const otherUserClient = new Client({
      name: "Other User Client",
      user: otherUser._id,
    });
    await otherUserClient.save();

    const otherUserProject = new Project({
      client: otherUserClient._id,
      user: otherUser._id,
      projectNr: "OTH-001",
      currency: "USD",
      payment: 500,
      date: new Date(),
    });
    await otherUserProject.save();

    await request(app)
      .patch(`/api/v1/projects/${otherUserProject._id}`)
      .set("Authorization", `Bearer ${getAuthToken()}`)
      .send({
        payment: 111,
        projectNr: "ZYZ987",
        client: "Brand New Client",
      })
      .expect(404);

    const clientCount = await Client.countDocuments({
      user: userId,
      name: "Brand New Client",
    });

    assert.strictEqual(clientCount, 0);
  });
});
