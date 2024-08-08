const request = require("supertest");
const { app } = require("../../app");

let userData = {
  userName: "testuser",
  email: "test101@example.com",
  password: "12345678",
  phone: "1234567890",
};

let registerResponse;
let verifyResponse;
let loginResponse;

describe("User API Tests", () => {
  describe("POST /register", () => {
    test("should register a new user", async () => {
      const response = await request(app).post("/user/register").send(userData);
      expect(response.statusCode).toBe(200);
      registerResponse = response.body; // Save the response body for future use
    });
  });

  describe("POST /verify", () => {
    beforeEach(() => {
      // Ensure registerResponse is available before running this test
      if (!registerResponse) {
        throw new Error("registerResponse is not available");
      }
    });

    test("should verify a user", async () => {
      const response = await request(app).post("/user/verify").send({
        email: userData.email,
        verifyOtp: registerResponse.result.verifyOtp,
      });
      expect(response.statusCode).toBe(200);
      verifyResponse = response.body; // Save the response body for future use
    });
  });

  describe("POST /login", () => {
    beforeEach(() => {
      // Ensure verifyResponse is available before running this test
      if (!verifyResponse) {
        throw new Error("verifyResponse is not available");
      }
    });

    test("should log in a user", async () => {
      const response = await request(app).post("/user/login").send({
        email: userData.email,
        password: userData.password,
      });
      expect(response.statusCode).toBe(200);
      loginResponse = response.body; // Save the response body for future use
    });
  });

  describe("GET /profile", () => {
    beforeEach(() => {
      // Ensure loginResponse is available before running this test
      if (!loginResponse) {
        throw new Error("loginResponse is not available");
      }
    });

    test("should get user profile", async () => {
      const response = await request(app)
        .get("/user/profile")
        .set("Authorization", `Bearer ${loginResponse.result.token}`);

      expect(response.statusCode).toBe(200);
    });
  });
});
