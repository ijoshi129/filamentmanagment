import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "@/db/schema";

const databaseUrl = process.env.DATABASE_URL || "sqlite.db";

// Create singleton SQLite connection
const sqlite = new Database(databaseUrl);

// Enable WAL mode for better concurrent access
sqlite.pragma("journal_mode = WAL");

// Create Drizzle instance
export const db = drizzle(sqlite, { schema });

// Export raw sqlite connection if needed
export { sqlite };
