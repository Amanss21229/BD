import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import path from "path";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use("/api", router);

// Serve built React frontend in production
if (process.env.NODE_ENV === "production") {
  // process.cwd() is the workspace root when running: node artifacts/api-server/dist/index.cjs
  const frontendDist = path.join(process.cwd(), "artifacts/bihar-diwas/dist/public");
  app.use(express.static(frontendDist));

  // SPA fallback: let React Router handle all non-API routes
  app.get("/{*path}", (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

export default app;
