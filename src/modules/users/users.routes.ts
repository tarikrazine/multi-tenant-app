import { FastifyInstance } from "fastify";

import { createUserHandler } from "./users.controllers";
import { createUserJsonToSchema } from "./users.schemas";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", { schema: createUserJsonToSchema }, createUserHandler);
}
