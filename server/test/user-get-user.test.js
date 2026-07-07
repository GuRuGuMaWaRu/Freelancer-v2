const assert = require("assert");
const jwt = require("jsonwebtoken");
const request = require("supertest");

const app = require("../app");
const { getAuthToken, getTestUserId } = require("./test-helpers");

describe("User controller", () => {
  it("should return a refreshed token on GET /api/v1/users/getUser", (done) => {
    request(app)
      .get("/api/v1/users/getUser")
      .set("Authorization", `Bearer ${getAuthToken()}`)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);

        assert.strictEqual(res.body.status, "success");
        assert.ok(res.body.data.token);

        const decoded = jwt.verify(
          res.body.data.token,
          process.env.ACCESS_TOKEN_SECRET,
        );

        assert.strictEqual(decoded.id, getTestUserId());
        done();
      });
  });
});
