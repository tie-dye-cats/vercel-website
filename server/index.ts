import 'dotenv/config';
import express from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";

const app = express();
// Create HTTP server
const server = createServer(app);

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

// Register API routes BEFORE static/Vite middleware
app.use('/api', (req, res, next) => {
  // Ensure all API responses are JSON
  res.setHeader('Content-Type', 'application/json');
  next();
});

registerRoutes(app);

// Error handling for API routes
app.use("/api", (err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({ 
    success: false,
    message: err.message || "Internal Server Error"
  });
});

// Handle 404s for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.path}`
  });
});

// Setup static files or Vite middleware
if (process.env.NODE_ENV === "development") {
  log("Setting up Vite development server...");
  setupVite(app, server);
} else {
  log("Setting up static file serving...");
  serveStatic(app);
}

// Start server (use port 3000 for local, process.env.PORT for Vercel/Replit)
const port = parseInt(process.env.PORT || '3000', 10);
server.listen(port, () => {
  log(`Server running at http://localhost:${port}`);
});

export default app;