import assert from "assert";
import request from "supertest";

import app from "../app";
import Project from "../resources/project/project.model";
import Client from "../resources/client/client.model";
import { getAuthToken, getTestUserId } from "./test-helpers";

describe("Project controller", () => {
  it("should return all existing projects on GET request to /api/v1/projects", (done) => {
    const userId = getTestUserId();
    const client = new Client({ name: "Dobobo", user: userId });

    client.save().then(() => {
      const project1 = new Project({
        client: client._id,
        user: userId,
        projectNr: "ABC123",
        payment: 100,
        date: "2019-10-07T09:34:00.309Z",
      });
      const project2 = new Project({
        client: client._id,
        user: userId,
        projectNr: "ABC124",
        payment: 1000,
        date: "2019-10-08T09:34:00.309Z",
      });
      const project3 = new Project({
        client: client._id,
        user: userId,
        projectNr: "ABC125",
        payment: 10000,
        date: "2019-10-09T09:34:00.309Z",
      });

      Promise.all([project1.save(), project2.save(), project3.save()]).then(
        () => {
          request(app)
            .get("/api/v1/projects")
            .set("Authorization", `Bearer ${getAuthToken()}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              assert.strictEqual(res.body.data.docs.length, 3);
              done();
            });
        },
      );
    });
  });
});
