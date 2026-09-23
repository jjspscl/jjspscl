import { DAILY_LIMIT } from "./contact.constant";
import type {
  ContactSubmissionData,
  ContactSubmissionMetadata,
  DailyLimitResult,
  SubmissionResult,
} from "./contact.type";

type D1Database = Cloudflare.Env["DB"];

export async function checkAndIncrementDailyLimit(
  db: D1Database | undefined,
  ip: string
): Promise<DailyLimitResult> {
  if (!db) {
    console.warn("D1 database not available, skipping rate limit check");
    return { allowed: true, remaining: DAILY_LIMIT };
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    const inserted = await db
      .prepare(
        `INSERT INTO daily_limits (ip_address, date, count)
         VALUES (?, ?, 1)
         ON CONFLICT (ip_address, date) DO NOTHING
         RETURNING count`
      )
      .bind(ip, today)
      .first<{ count: number }>();

    if (inserted) {
      return { allowed: true, remaining: Math.max(0, DAILY_LIMIT - inserted.count) };
    }

    const updated = await db
      .prepare(
        `UPDATE daily_limits
         SET count = count + 1, updated_at = CURRENT_TIMESTAMP
         WHERE ip_address = ? AND date = ? AND count < ?
         RETURNING count`
      )
      .bind(ip, today, DAILY_LIMIT)
      .first<{ count: number }>();

    if (updated && updated.count <= DAILY_LIMIT) {
      return { allowed: true, remaining: DAILY_LIMIT - updated.count };
    }

    return { allowed: false, remaining: 0 };
  } catch (error) {
    console.error("D1 rate limit error:", error);
    return { allowed: false, remaining: 0, error: "Rate limit service unavailable" };
  }
}

export async function checkDailyLimit(
  db: D1Database | undefined,
  ip: string
): Promise<DailyLimitResult> {
  if (!db) {
    console.warn("D1 database not available, skipping rate limit check");
    return { allowed: true, remaining: DAILY_LIMIT };
  }

  const today = new Date().toISOString().split("T")[0];

  try {
    const existing = await db
      .prepare("SELECT count FROM daily_limits WHERE ip_address = ? AND date = ?")
      .bind(ip, today)
      .first<{ count: number }>();

    if (existing) {
      if (existing.count >= DAILY_LIMIT) {
        return { allowed: false, remaining: 0 };
      }
      return { allowed: true, remaining: DAILY_LIMIT - existing.count };
    }

    return { allowed: true, remaining: DAILY_LIMIT };
  } catch (error) {
    console.error("D1 rate limit check error:", error);
    return { allowed: false, remaining: 0, error: "Rate limit service unavailable" };
  }
}

export async function releaseDailyLimit(
  db: D1Database | undefined,
  ip: string
): Promise<void> {
  if (!db) return;

  const today = new Date().toISOString().split("T")[0];

  try {
    await db
      .prepare(
        `UPDATE daily_limits
         SET count = CASE WHEN count > 0 THEN count - 1 ELSE 0 END,
             updated_at = CURRENT_TIMESTAMP
         WHERE ip_address = ? AND date = ?`
      )
      .bind(ip, today)
      .run();
  } catch (error) {
    console.error("D1 rate limit release error:", error);
  }
}

export async function storeContactSubmission(
  db: D1Database | undefined,
  data: ContactSubmissionData,
  metadata: ContactSubmissionMetadata
): Promise<SubmissionResult> {
  if (!db) {
    console.warn("D1 database not available, skipping submission storage");
    return { success: false, error: "An unexpected error occurred. Please try again later." };
  }

  try {
    const result = await db
      .prepare(
        `INSERT INTO contact_submissions (name, email, message, ip_address, user_agent, country, city)
         VALUES (?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        data.name,
        data.email,
        data.message,
        metadata.ip,
        metadata.userAgent,
        metadata.country,
        metadata.city
      )
      .run();

    if (!result.success) {
      return { success: false, error: "An unexpected error occurred. Please try again later." };
    }
    
    return { success: true };
  } catch (error) {
    console.error("D1 storage error:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
