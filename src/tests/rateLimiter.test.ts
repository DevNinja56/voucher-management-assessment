import request from "supertest";
import express, { Express, Request, Response, NextFunction } from "express";
import { apiLimiter } from "../middlewares/rateLimiter";

let app: Express;

beforeEach(() => {
  app = express();
  app.use(apiLimiter);

  app.get("/test", (_req: Request, res: Response) => {
    res.status(200).json({ message: "OK" });
  });
});

describe("Rate Limiter Middleware", () => {
  it("should allow 10 requests and then block subsequent requests", async () => {
    for (let i = 0; i < 10; i++) {
      const response = await request(app).get("/test");
      expect(response.status).toBe(200);
    }

    // The 11th request should be blocked
    const blockedResponse = await request(app).get("/test");
    expect(blockedResponse.status).toBe(429); // Too Many Requests
    expect(blockedResponse.text).toContain("Too many requests");
  });

  it("should reset the limit after 1 minute", async () => {
    jest.setTimeout(70000); // Increase timeout to 70 seconds

    // Make 10 requests
    for (let i = 0; i < 10; i++) {
      await request(app).get("/test");
    }

    // Wait for 61 seconds (1 minute + 1 second to be safe)
    await new Promise((resolve) => setTimeout(resolve, 61000));

    // The next request should be allowed
    const response = await request(app).get("/test");
    expect(response.status).toBe(200);
  });
});
