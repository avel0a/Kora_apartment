import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Hashed assets (JS/CSS/fonts) — cache forever (1 year, immutable)
  app.use("/assets", express.static(path.join(distPath, "assets"), {
    maxAge: "365d",
    immutable: true,
  }));

  // All other static files (images, favicon, robots.txt, sitemap) — 1 hour cache
  app.use(express.static(distPath, {
    maxAge: "1h",
    etag: true,
  }));

  // SPA fallback — no cache on HTML so users always get the latest
  app.use("/{*path}", (_req, res) => {
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
