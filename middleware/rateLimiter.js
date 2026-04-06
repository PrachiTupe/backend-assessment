import rateLimit from "express-rate-limit";

// General limiter
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // max 100 requests per IP
  message: {
    message: "Too many requests, please try again later"
  }
});

// Strict limiter (for auth)
export const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // only 5 requests
  message: {
    message: "Too many login attempts, try again later"
  }
});