import argon2 from "argon2";

import { db } from "../../db";
import { usersSchema } from "../../db/schema/user";
import { eq } from "drizzle-orm";

export async function createUser(data: typeof usersSchema.$inferInsert) {
  const hashedPassword = await argon2.hash(data.password);

  const result = await db.insert(usersSchema).values({
    ...data,
    password: hashedPassword,
  }).returning({
    name: usersSchema.name,
    email: usersSchema.email,
    applicationId: usersSchema.applicationId,
    createdAt: usersSchema.createdAt,
  });

  return result[0];
}

export async function getUsersByApplication(applicationId: string) {
  const results = await db.select().from(usersSchema).where(
    eq(usersSchema.applicationId, applicationId),
  );

  return results;
}
