// Database connection using Drizzle ORM
// Uses SQLite for local development and PostgreSQL (Neon) for production

import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import * as schema from "@shared/sqlite-schema";

// For local development with SQLite
const sqlite = new Database('dev.db');

// Enable foreign key constraints
sqlite.pragma('foreign_keys = ON');

// Create the database client with schema
export const db = drizzle(sqlite, { schema });

// Uncomment this section and comment out the SQLite configuration above for production with PostgreSQL
/*
import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle as pgDrizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

neonConfig.webSocketConstructor = ws;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = pgDrizzle({ client: pool, schema });
*/
