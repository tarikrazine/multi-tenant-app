import { db } from "../../db";
import { applicationsSchema } from "../../db/schema/application";

export async function createApplication(
  data: typeof applicationsSchema.$inferInsert,
) {
  const result = await db.insert(applicationsSchema).values(data).returning();

  return result[0];
}

export async function getApplications() {
  const results = await db.select().from(applicationsSchema);

  return results;
}
