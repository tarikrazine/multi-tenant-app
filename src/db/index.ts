import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import { env } from "../config/env";

import * as applicationSchema from "../db/schema/application";

const pool = new Pool({
  connectionString: env.DATABASE_URL,
  ssl: true,
});

export const db = drizzle(pool, { schema: { ...applicationSchema } });
