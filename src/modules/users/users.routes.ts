import { FastifyInstance } from "fastify";

import { createUserHandler, loginHandler } from "./users.controllers";
import { createUserJsonToSchema, loginBodyJsonSchema } from "./users.schemas";

export async function usersRoutes(app: FastifyInstance) {
  app.post("/", { schema: createUserJsonToSchema }, createUserHandler);
  app.post("/login", { schema: loginBodyJsonSchema }, loginHandler);
}
