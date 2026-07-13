import assert from "assert";
import request from "supertest";

import app from "../app";
import Project from "../resources/project/project.model";
import Client from "../resources/client/client.model";
import { getAuthToken, getTestUserId } from "./test-helpers";

describe("Project controller", () => {
  it("should save a new project with a new client on POST request to /api/v1/projects", (done) => {
    Promise.all([Project.countDocuments(), Client.countDocuments()]).then(
      (counts) => {
        const data = {
          client: "Client 1",
          projectNr: "ABC123",
          payment: 1000,
          currency: "USD",
          date: "2019-10-07T09:34:00.309Z",
        };

        request(app)
          .post("/api/v1/projects")
          .set("Authorization", `Bearer ${getAuthToken()}`)
          .send(data)
          .expect(201)
          .end((err, _res) => {
            if (err) return done(err);
            Promise.all([Project.countDocuments(), Client.countDocuments()])
              .then((newCounts) => {
                assert.strictEqual(newCounts[0], counts[0] + 1);
                assert.strictEqual(newCounts[1], counts[1] + 1);
                done();
              })
              .catch(done);
          });
      },
    );
  });

  it("should save a new project with an old client on POST request to /api/v1/projects", (done) => {
    const userId = getTestUserId();
    const client = new Client({ name: "Cosmos", user: userId });

    client.save().then(() => {
      Promise.all([Project.countDocuments(), Client.countDocuments()]).then(
        (counts) => {
          const data = {
            client: "Cosmos",
            projectNr: "ABC123",
            payment: 1000,
            currency: "USD",
            date: "2019-10-07T09:34:00.309Z",
          };

          request(app)
            .post("/api/v1/projects")
            .set("Authorization", `Bearer ${getAuthToken()}`)
            .send(data)
            .expect(201)
            .end((err, _res) => {
              if (err) return done(err);
              Promise.all([Project.countDocuments(), Client.countDocuments()])
                .then((newCounts) => {
                  assert.strictEqual(newCounts[0], counts[0] + 1);
                  assert.strictEqual(newCounts[1], counts[1]);
                  done();
                })
                .catch(done);
            });
        },
      );
    });
  });

  it("should reject a non-string client on POST request to /api/v1/projects", (done) => {
    request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${getAuthToken()}`)
      .send({
        client: { $gt: "" },
        projectNr: "ABC123",
        payment: 1000,
        currency: "USD",
        date: "2019-10-07T09:34:00.309Z",
      })
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        assert.deepStrictEqual(res.body.errors.formErrors, []);
        assert.strictEqual(res.body.errors.fieldErrors.client.length, 1);
        done();
      });
  });

  it("should reject an unsupported currency on POST request to /api/v1/projects", (done) => {
    request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${getAuthToken()}`)
      .send({
        client: "Client 1",
        projectNr: "ABC123",
        payment: 1000,
        currency: "GBP",
        date: "2019-10-07T09:34:00.309Z",
      })
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.errors.fieldErrors.currency.length, 1);
        done();
      });
  });

  it("should accept a zero payment on POST request to /api/v1/projects", (done) => {
    request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${getAuthToken()}`)
      .send({
        client: "Client 1",
        projectNr: "ABC123",
        payment: 0,
        currency: "USD",
        date: "2019-10-07T09:34:00.309Z",
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.data.payment, 0);
        done();
      });
  });

  it('should treat paid "false" as false on POST request to /api/v1/projects', (done) => {
    request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${getAuthToken()}`)
      .send({
        client: "Client 1",
        projectNr: "PAID-FALSE",
        payment: 100,
        currency: "USD",
        date: "2019-10-07T09:34:00.309Z",
        paid: "false",
      })
      .expect(201)
      .end((err, res) => {
        if (err) return done(err);
        assert.strictEqual(res.body.data.paid, false);
        done();
      });
  });

  it("should reject null date on POST request to /api/v1/projects", (done) => {
    request(app)
      .post("/api/v1/projects")
      .set("Authorization", `Bearer ${getAuthToken()}`)
      .send({
        client: "Client 1",
        projectNr: "NULL-DATE",
        payment: 100,
        currency: "USD",
        date: null,
      })
      .expect(422)
      .end((err, res) => {
        if (err) return done(err);
        assert.ok(res.body.errors?.fieldErrors?.date);
        done();
      });
  });
});
