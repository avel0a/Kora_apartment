import "dotenv/config";
import express, { type Request, Response, NextFunction } from "express";
import compression from "compression";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);

// ──────────────────────────────────────────────
// Graceful shutdown — prevents 503 errors on cPanel
// ──────────────────────────────────────────────
let isShuttingDown = false;

const gracefulShutdown = async (signal: string) => {
  if (isShuttingDown) return; // prevent double-shutdown
  isShuttingDown = true;
  console.log(`[shutdown] Received ${signal}. Shutting down gracefully...`);

  // 1. Stop accepting new connections
  httpServer.close(() => {
    console.log("[shutdown] HTTP server closed.");
  });

  // 2. Close the database (removes PGlite lock file)
  try {
    const { closeDb } = await import("./db");
    await closeDb();
  } catch (e) {
    console.error("[shutdown] Error closing database:", e);
  }

  console.log("[shutdown] Cleanup complete. Exiting.");
  process.exit(0);
};

// cPanel Passenger sends SIGTERM when idling your app
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

// Global error handlers — still shut down cleanly on crashes
process.on("unhandledRejection", async (reason, p) => {
  console.error("Unhandled Rejection at:", p, "reason:", reason);
  await gracefulShutdown("unhandledRejection");
});

process.on("uncaughtException", async (err) => {
  console.error("Uncaught Exception:", err);
  await gracefulShutdown("uncaughtException");
});

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

// Gzip compression — reduces payload size by 60-80%
app.use(compression());

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

// Serve uploaded files with 7-day cache
const uploadsPath = path.resolve(process.cwd(), "uploads");
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use("/uploads", express.static(uploadsPath, {
  maxAge: "7d",
  immutable: false,
  etag: true,
}));

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

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
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse).slice(0, 100)}...`;
    }
    log(logLine);
  });

  next();
});

(async () => {
  try {
    // Initialize DB and run migrations if PGlite
    const { db } = await import("./db");
    if (!process.env.DATABASE_URL) {
      console.log("Running PGlite migrations (in-memory)...");
      const { migrate } = await import("drizzle-orm/pglite/migrator");
      await migrate(db, { migrationsFolder: "migrations" });
      console.log("Migrations applied successfully!");
    }
    await registerRoutes(httpServer, app);
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  httpServer.listen(port, () => {
      log(`serving on port ${port}`);
    },
  );
})();
