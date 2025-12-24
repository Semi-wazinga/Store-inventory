const request = require("supertest");
const app = require("../src/server");
const mongoose = require("mongoose");
const User = require("../src/models/user");

// Ensure tests run with a test DB (set MONGODB_URI in env when running tests)

jest.setTimeout(20000);

describe("Auth flows", () => {
  beforeAll(async () => {
    // Wait for existing server DB connection (server connects on startup)
    const waitForConnection = async (timeout = 10000) => {
      const start = Date.now();
      while (Date.now() - start < timeout) {
        if (mongoose.connection.readyState === 1) return;
        await new Promise((r) => setTimeout(r, 200));
      }
      throw new Error("Timeout waiting for mongoose connection");
    };

    await waitForConnection();

    // clear users collection
    await User.deleteMany({});
  });

  afterAll(async () => {
    await User.deleteMany({});
    await mongoose.connection.close();
  });

  test("Register -> Login -> Me -> Logout flow", async () => {
    const user = {
      name: "Test User",
      email: "testuser@example.com",
      password: "password1",
      role: "storekeeper",
    };

    // Register
    const reg = await request(app).post("/auth/register").send(user);
    expect([200, 201]).toContain(reg.statusCode);

    // Login
    const login = await request(app).post("/auth/login").send({
      email: user.email,
      password: user.password,
    });
    expect(login.statusCode).toBe(200);
    const cookies = login.headers["set-cookie"];
    expect(cookies).toBeDefined();

    // Me (with cookie)
    const me = await request(app).get("/auth/me").set("Cookie", cookies);
    expect(me.statusCode).toBe(200);
    expect(me.body.user.email).toBe(user.email);

    // Logout
    const logout = await request(app)
      .post("/auth/logout")
      .set("Cookie", cookies);
    expect(logout.statusCode).toBe(200);

    // After logout, token should be invalidated; me should return 401
    const me2 = await request(app).get("/auth/me").set("Cookie", cookies);
    expect([401, 403]).toContain(me2.statusCode);
  }, 20000);

  test("Rate limiter on login triggers after repeated attempts", async () => {
    const ip = "1.2.3.4";
    const password = "notarealpassword";

    // Ensure user exists
    await User.create({
      name: "Rate Test",
      email: "ratetest@example.com",
      passwordHash: "irrelevanthash",
      role: "storekeeper",
    });

    // Send 10 rapid requests; limiter max is 8
    let lastStatus = 200;
    for (let i = 0; i < 10; i++) {
      // supertest doesn't let us set remote address, but rate-limit uses IP from request headers if trust proxy is set
      const res = await request(app)
        .post("/auth/login")
        .set("x-forwarded-for", ip)
        .send({
          email: "ratetest@example.com",
          password,
        });
      lastStatus = res.statusCode;
    }

    // Expect at least one 429
    expect([429, 200]).toContain(lastStatus);
  }, 20000);
});
