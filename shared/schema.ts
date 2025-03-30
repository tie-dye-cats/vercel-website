import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type User = typeof usersTable.$inferSelect;
export type InsertUser = typeof usersTable.$inferInsert;

export const users = {
  table: 'users',
  columns: {
    id: 'id',
    email: 'email',
    name: 'name',
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
} as const;
