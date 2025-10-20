import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';
import { relations } from "drizzle-orm";

// Simple UUID v4 generator function
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// SQLite doesn't support enums natively, so we'll use text fields with constraints
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(uuidv4),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  role: text("role", { enum: ["CUSTOMER", "ADMIN"] }).notNull().default("CUSTOMER"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const categories = sqliteTable("categories", {
  id: text("id").primaryKey().$defaultFn(uuidv4),
  name: text("name").notNull().unique(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

export const products = sqliteTable("products", {
  id: text("id").primaryKey().$defaultFn(uuidv4),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  categoryId: text("category_id").notNull().references(() => categories.id, { onDelete: 'cascade' }),
  basePrice: integer("base_price").notNull(), // Price in paise (smallest currency unit)
  stock: integer("stock").notNull().default(0),
  isActive: integer("is_active", { mode: 'boolean' }).notNull().default(true),
  isFeatured: integer("is_featured", { mode: 'boolean' }).notNull().default(false),
  createdAt: integer("created_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: 'timestamp' }).notNull().$defaultFn(() => new Date()),
});

// Add any additional tables and relations as needed

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;
