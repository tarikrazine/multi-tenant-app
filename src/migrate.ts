import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});

async function main() {
  try {
    const db = drizzle(pool);
    console.log("Running migrations");

    await migrate(db, { migrationsFolder: "./migrations" });

    console.log("Migrated successfully");

    process.exit(0);
  } catch (error) {
    console.error("Migration failed");
    console.error(error);
    process.exit(1);
  }
}

main();
