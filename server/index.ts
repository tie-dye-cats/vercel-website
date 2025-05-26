import 'dotenv/config';
import express from "express";
import cors from 'cors';
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Create HTTP server
const server = createServer(app);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API request logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () => {
    const duration = Date.now() - start;
    log(`${req.method} ${req.path} ${res.statusCode} in ${duration}ms`);
  });
  next();
});

// Check required environment variables
const requiredEnvVars = {
  BREVO_API_KEY: "Email notifications",
  CLICKUP_API_TOKEN: "ClickUp task creation",
  CLICKUP_LIST_ID: "ClickUp list assignment"
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

// Register routes
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

// Serve public directory first
app.use(express.static(path.resolve(__dirname, "..", "public"), {
  setHeaders: (res, path) => {
    if (path.endsWith('.mp4')) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=31536000');
      res.setHeader('Access-Control-Allow-Origin', '*');
    }
  }
}));

// Setup static files or Vite middleware
if (process.env.NODE_ENV === "development") {
  log("Setting up Vite development server...");
  setupVite(app, server);
} else {
  log("Setting up static file serving...");
  serveStatic(app);
}

// Start server
const port = parseInt(process.env.PORT || '3000', 10);
const host = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

function startServer(port: number): void {
  try {
    app.listen(port, () => {
      console.log(`[express] Server running at http://localhost:${port}`);
    });
  } catch (error: unknown) {
    const err = error as { code?: string, message?: string };
    if (err.code === 'EADDRINUSE') {
      console.log(`[express] Port ${port} is already in use. Trying port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('[express] Failed to start server:', err.message || 'Unknown error');
      process.exit(1);
    }
  }
}

startServer(Number(port));

export default app;