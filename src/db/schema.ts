import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const brands = sqliteTable("brands", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const materials = sqliteTable("materials", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const modifiers = sqliteTable("modifiers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  suffix: text("suffix").notNull().default(""),
  sortOrder: integer("sort_order").notNull().default(0),
});

export const catalogColors = sqliteTable("catalog_colors", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  brandId: text("brand_id").notNull().references(() => brands.id, { onDelete: "cascade" }),
  materialId: text("material_id").notNull().references(() => materials.id, { onDelete: "cascade" }),
  modifierId: text("modifier_id").notNull().references(() => modifiers.id, { onDelete: "cascade" }),
  colorName: text("color_name").notNull(),
  colorHex: text("color_hex").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
});

export type Brand = typeof brands.$inferSelect;
export type Material = typeof materials.$inferSelect;
export type Modifier = typeof modifiers.$inferSelect;
export type CatalogColor = typeof catalogColors.$inferSelect;

export const spools = sqliteTable("spools", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  brand: text("brand").notNull(),
  material: text("material").notNull(),
  modifier: text("modifier"),
  colorName: text("color_name").notNull(),
  colorHex: text("color_hex").notNull(),
  status: text("status").notNull().default("in_use"),
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
