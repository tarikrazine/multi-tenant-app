import { pgTable, primaryKey, uuid } from "drizzle-orm/pg-core";

import { applicationsSchema } from "./application";
import { rolesSchema } from "./role";
import { usersSchema } from "./user";

export const usersToRolesSchema = pgTable("users_to_roles", {
  applicationId: uuid("application_id").references(() => applicationsSchema.id)
    .notNull(),
  roleId: uuid("role_id").references(() => rolesSchema.id).notNull(),
  userId: uuid("user_id").references(() => usersSchema.id).notNull(),
}, (usersToRoles) => {
  return {
    cpk: primaryKey(
      usersToRoles.applicationId,
      usersToRoles.roleId,
      usersToRoles.userId,
    ),
  };
});
