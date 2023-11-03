import { and, eq } from "drizzle-orm";

import { db } from "../../db";
import { rolesSchema } from "../../db/schema/role";

export async function createRole(data: typeof rolesSchema.$inferInsert) {
  const result = await db.insert(rolesSchema).values(data).returning();

  return result[0];
}

export async function getRoleByName(
  { name, applicationId }: { name: string; applicationId: string },
) {
  const result = await db.select().from(rolesSchema).where(
    and(
      eq(rolesSchema.name, name),
      eq(rolesSchema.applicationId, applicationId),
    ),
  ).limit(1);

  return result[0];
}
