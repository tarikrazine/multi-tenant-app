import { fastify } from "fastify";

import { logger } from "./logger";
import { applicationsRoutes } from "../modules/applications/applications.routes";

export async function buildServer() {
  const app = fastify({
    logger,
  });

  // Register plugins

  // Register routes
  app.register(applicationsRoutes, { prefix: "/api/applications" });

  return app;
}
