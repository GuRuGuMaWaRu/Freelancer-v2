const assert = require("assert");
const request = require("supertest");

const app = require("../app");
const Project = require("../resources/project/project.model");
const Client = require("../resources/client/client.model");
const { getAuthToken, getTestUserId } = require("./test-helpers");

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
});
