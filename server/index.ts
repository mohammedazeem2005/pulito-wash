import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import { createServer } from "http";
import "dotenv/config";
import { connectDB } from "./config/db";
import { router as apiRoutes } from "./routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Connect MongoDB
connectDB();

// Register API routes
app.use("/api", apiRoutes);

const server = createServer(app);

// Setup Vite for development or static files for production
if (process.env.NODE_ENV === "development") {
  import("./vite").then(({ setupVite }) => {
    setupVite(server, app);
  });
} else {
  // Serve frontend in production
  const buildPath = path.join(__dirname, "public");
  app.use(express.static(buildPath));
  app.get("*", (_req: Request, res: Response) => {
    res.sendFile(path.join(buildPath, "index.html"));
  });
}

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal Server Error" });
});

// Start server
const PORT = parseInt(process.env.PORT || "5000", 10);
server.listen(PORT, "0.0.0.0", () => console.log(`Server running on port ${PORT}`));
