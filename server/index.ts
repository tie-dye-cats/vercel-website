import 'dotenv/config';
import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

// Load environment variables first
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Add request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      log(logLine);
    }
  });

  next();
});

// Log environment variables status
if (!process.env.SLACK_BOT_TOKEN) {
  log("Warning: SLACK_BOT_TOKEN not configured. Slack notifications will be disabled.");
}
if (!process.env.BREVO_API_KEY) {
  log("Warning: BREVO_API_KEY not configured. Email notifications will be disabled.");
}

// Register API routes
registerRoutes(app);

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Server error:", err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ 
    success: false,
    message: message
  });
});

// Setup Vite in development or serve static files in production
if (process.env.NODE_ENV === "development") {
  log("Setting up Vite middleware...");
  const server = createServer(app);
  setupVite(app, server);
  log("Vite middleware setup complete");
} else {
  log("Setting up static file serving...");
  serveStatic(app);
}

// Start the server if not running in Vercel
if (process.env.VERCEL !== "1") {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    log(`Server is running on port ${port}`);
  });
}

// Export the Express app for Vercel
export default app;