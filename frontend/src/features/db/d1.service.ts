export type D1Database = Env["DB"];

export function isDatabaseAvailable(db: D1Database | undefined): db is D1Database {
  return db !== undefined;
}

