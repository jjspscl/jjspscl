/**
 * Generic D1 database utilities
 * Feature-specific database operations should be in their respective feature folders
 * e.g., contact-related DB operations are in features/contact/contact.db.ts
 */

export type D1Database = Env["DB"];

export function isDatabaseAvailable(db: D1Database | undefined): db is D1Database {
  return db !== undefined;
}

