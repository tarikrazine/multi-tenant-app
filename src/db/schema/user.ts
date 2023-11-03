import {
  pgTable,
  primaryKey,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { applicationsSchema } from "./application";

export const usersSchema = pgTable("users", {
  id: uuid("id").defaultRandom().notNull(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull(),
  password: varchar("password", { length: 256 }).notNull(),
  applicationId: uuid("application_id").references(() => applicationsSchema.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (users) => {
  return {
    cpk: primaryKey(users.email, users.applicationId),
    idIndex: uniqueIndex("users_id_index").on(users.id),
  };
});
