import assert from "assert";
import request from "supertest";

import app from "../app";
import Project from "../resources/project/project.model";
import Client from "../resources/client/client.model";
import { getAuthToken, getTestUserId } from "./test-helpers";

describe("Project controller", () => {
  it("should delete a project on DELETE request to /api/v1/projects/:id", (done) => {
    const userId = getTestUserId();
    const client1 = new Client({ name: "Client 1", user: userId });
    const client2 = new Client({ name: "Client 2", user: userId });
    const client3 = new Client({ name: "Client 3", user: userId });

    Promise.all([client1.save(), client2.save(), client3.save()]).then(() => {
      const project1 = new Project({
        client: client1._id,
        user: userId,
        projectNr: "ABC123",
        payment: 100,
        date: "2019-10-07T09:34:00.309Z",
      });
      const project2 = new Project({
        client: client2._id,
        user: userId,
        projectNr: "ABC124",
        payment: 1000,
        date: "2019-10-08T09:34:00.309Z",
      });
      const project3 = new Project({
        client: client3._id,
        user: userId,
        projectNr: "ABC125",
        payment: 10000,
        date: "2019-10-09T09:34:00.309Z",
      });

      Promise.all([project1.save(), project2.save(), project3.save()]).then(
        () => {
          request(app)
            .delete(`/api/v1/projects/${project1._id}`)
            .set("Authorization", `Bearer ${getAuthToken()}`)
            .expect(200)
            .end((err, res) => {
              if (err) return done(err);
              Project.findOne({ _id: project1._id })
                .select("+deleted")
                .then((project) => {
                  assert.strictEqual(project?.deleted, true);
                  done();
                })
                .catch(done);
            });
        },
      );
    });
  });
});
