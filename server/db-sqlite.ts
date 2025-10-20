import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/sqlite-schema";

// Initialize SQLite database
const sqlite = new Database('dev.db');

// Enable foreign key constraints
sqlite.pragma('foreign_keys = ON');

// Create the database client with schema
export const db = drizzle(sqlite, { schema });
