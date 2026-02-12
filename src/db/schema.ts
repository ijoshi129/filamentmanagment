import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const spools = sqliteTable("spools", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  brand: text("brand").notNull(),
  material: text("material").notNull(),
  modifier: text("modifier"),
  colorName: text("color_name").notNull(),
  colorHex: text("color_hex").notNull(),
  status: text("status").notNull().default("sealed"),
  initialWeight: integer("initial_weight").notNull().default(1000),
  purchaseDate: text("purchase_date"),
  price: real("price"),
  notes: text("notes"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

export type Spool = typeof spools.$inferSelect;
export type NewSpool = typeof spools.$inferInsert;
