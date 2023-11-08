import argon2 from "argon2";
import { and, eq } from "drizzle-orm";

import { db } from "../../db";
import { usersSchema } from "../../db/schema/user";
import { usersToRolesSchema } from "../../db/schema/userToRole";
import { rolesSchema } from "../../db/schema/role";

export async function createUser(data: typeof usersSchema.$inferInsert) {
  const hashedPassword = await argon2.hash(data.password);

  const result = await db.insert(usersSchema).values({
    ...data,
    password: hashedPassword,
  }).returning({
    id: usersSchema.id,
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

export async function assignRoleToUser(
  data: typeof usersToRolesSchema.$inferInsert,
) {
  const result = await db.insert(usersToRolesSchema).values(data).returning();

  return result[0];
}

export async function getUserByEmail(email: string, applicationId: string) {
  const results = await db.select({
    id: usersSchema.id,
    name: usersSchema.name,
    email: usersSchema.email,
    applicationId: usersSchema.applicationId,
    password: usersSchema.password,
    roleId: rolesSchema.id,
    permissions: rolesSchema.permissions,
  }).from(usersSchema).where(
    and(
      eq(usersSchema.email, email),
      eq(usersSchema.applicationId, applicationId),
    ),
  ).leftJoin(
    usersToRolesSchema,
    and(
      eq(usersToRolesSchema.userId, usersSchema.id),
      eq(usersToRolesSchema.applicationId, usersSchema.applicationId),
    ),
  ).leftJoin(rolesSchema, eq(rolesSchema.id, usersToRolesSchema.roleId));

  if (!results.length) {
    return null;
  }

  const user = results.reduce(
    (acc, curr) => {
      if (!acc.id) {
        return {
          ...curr,
          permissions: new Set(curr.permissions),
        };
      }

      if (!curr.permissions) {
        return acc;
      }

      for (const permission of curr.permissions) {
        acc.permissions.add(permission);
      }

      return acc;
    },
    {} as Omit<(typeof results)[number], "permissions"> & {
      permissions: Set<string>;
    },
  );

  return { ...user, permissions: Array.from(user.permissions) };
}
