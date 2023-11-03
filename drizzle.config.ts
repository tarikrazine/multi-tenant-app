import type { Config } from "drizzle-kit";
import { env } from "./src/config/env";

export default {
  schema: "./src/db/schema/*",
  out: "./migrations",
  breakpoints: false,
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
    ssl: true,
  },
} satisfies Config;
