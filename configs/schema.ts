import { integer, json, pgTable, varchar, uuid } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    email: varchar({ length: 255 }).notNull().unique(),
    credits: integer().default(0),
    supabase_id: uuid("supabase_id").unique()
});

export const WireframeToCodeTable = pgTable("wireframeToCode", {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    uid: varchar(),
    imageUrl: varchar(),
    model: varchar(),
    description: varchar(),
    code: json(),
    createdBy: varchar(),
    user_id: integer("user_id").references(() => usersTable.id, { onDelete: 'cascade' })
});
