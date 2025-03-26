import 'dotenv/config';
import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API request logging
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    const start = Date.now();
    res.on("finish", () => {
      const duration = Date.now() - start;
      log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
    });
  }
  next();
});

// Check required environment variables
const requiredEnvVars = {
  SLACK_BOT_TOKEN: "Slack notifications",
  BREVO_API_KEY: "Email notifications",
};

Object.entries(requiredEnvVars).forEach(([key, feature]) => {
  if (!process.env[key]) {
    log(`Warning: ${key} not configured. ${feature} will be disabled.`);
  }
});

// Register API routes
registerRoutes(app);

// Error handling
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("Server error:", err);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// Setup static files or Vite middleware
if (process.env.NODE_ENV === "development") {
  setupVite(app);
} else {
  serveStatic(app);
}

// Start server (use port 3000 for local, process.env.PORT for Vercel/Replit)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

export default app;