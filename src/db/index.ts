import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "../config/env";

import * as applicationsSchema from "../db/schema/application";
import * as usersSchema from "../db/schema/user";
import * as rolesSchema from "../db/schema/role";
import * as usersToRolesSchema from "../db/schema/userToRole";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: true,
});

export const db = drizzle(pool, {
  schema: {
    ...applicationsSchema,
    ...usersSchema,
    ...rolesSchema,
    usersToRolesSchema,
  },
});
