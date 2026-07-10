import assert from "assert";
import request from "supertest";

import app from "../app";
import Client from "../resources/client/client.model";
import { getAuthToken, getTestUserId } from "./test-helpers";

describe("Client controller", () => {
  it("should return all clients on GET request to /api/v1/clients", (done) => {
    const userId = getTestUserId();
    const client1 = new Client({ name: "Anderson", user: userId });
    const client2 = new Client({ name: "Bronson", user: userId });
    const client3 = new Client({ name: "Craigson", user: userId });

    Promise.all([client1.save(), client2.save(), client3.save()]).then(() => {
      request(app)
        .get("/api/v1/clients")
        .set("Authorization", `Bearer ${getAuthToken()}`)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          assert.strictEqual(res.body.data.length, 3);
          done();
        });
    });
  });
});
