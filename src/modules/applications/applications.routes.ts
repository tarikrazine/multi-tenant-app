import { FastifyInstance } from "fastify";

import { createApplicationJsonSchema } from "./applications.schema";
import {
  createApplicationHandler,
  getApplicationsHandler,
} from "./applications.controllers";

export async function applicationsRoutes(app: FastifyInstance) {
  app.post(
    "/",
    { schema: createApplicationJsonSchema },
    createApplicationHandler,
  );

  app.get("/", getApplicationsHandler);
}
