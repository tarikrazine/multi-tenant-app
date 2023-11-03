import {
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { applicationsSchema } from "./application";

export const rolesSchema = pgTable("roles", {
  id: uuid("id").defaultRandom().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  applicationId: uuid("application_id").references(() => applicationsSchema.id),
  permissions: text("permissions").array().$type<Array<string>>(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (roles) => {
  return {
    cpk: primaryKey(roles.name, roles.applicationId),
    idIndex: uniqueIndex("roles_id_index").on(roles.id),
  };
});
