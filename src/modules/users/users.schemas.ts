import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const createUserBodySchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6),
  applicationId: z.string().uuid(),
  initialUser: z.boolean().optional(),
});

export type CreateUserBodySchema = z.infer<typeof createUserBodySchema>;

export const createUserJsonToSchema = {
  body: zodToJsonSchema(
    createUserBodySchema,
    "createUserBodySchema",
  ),
};

// Login
const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
  applicationId: z.string(),
});

export type LoginBody = z.infer<typeof loginSchema>;

export const loginBodyJsonSchema = {
  body: zodToJsonSchema(loginSchema, "loginSchema"),
};
