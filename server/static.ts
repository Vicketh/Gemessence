import express, { type Express } from "express";
import fs from "fs";
import path from "path";

export function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("/{*path}", (_req, res) => {
    // Use path.resolve and verify it stays within distPath to prevent path traversal
    const indexPath = path.resolve(distPath, "index.html");
    if (!indexPath.startsWith(distPath)) {
      return res.status(403).send("Forbidden");
    }
    res.sendFile(indexPath);
  });
}
