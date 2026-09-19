import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
export const leads = sqliteTable("leads", {
 id:text("id").primaryKey(),
 company:text("company").notNull(),
 name:text("name").notNull(),
 phone:text("phone").notNull(),
 email:text("email").notNull(),
 createdAt:integer("created_at").notNull()
});
