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
    const result = await db
      .prepare(
        `INSERT INTO daily_limits (ip_address, date, count)
         VALUES (?, ?, 1)
         ON CONFLICT (ip_address, date) DO UPDATE SET
           count = CASE WHEN daily_limits.count < ? THEN daily_limits.count + 1 ELSE daily_limits.count END,
           updated_at = CURRENT_TIMESTAMP
         RETURNING count`
      )
      .bind(ip, today, DAILY_LIMIT)
      .first<{ count: number }>();

    if (!result) {
      return { allowed: true, remaining: DAILY_LIMIT };
    }

    if (result.count > DAILY_LIMIT) {
      return { allowed: false, remaining: 0 };
    }

    const wasAlreadyAtLimit = result.count > DAILY_LIMIT;
    return {
      allowed: !wasAlreadyAtLimit,
      remaining: Math.max(0, DAILY_LIMIT - result.count),
    };
  } catch (error) {
    console.error("D1 rate limit error:", error);
    return { allowed: true, remaining: DAILY_LIMIT, error: "An unexpected error occurred. Please try again." };
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
    return { allowed: true, remaining: DAILY_LIMIT, error: "An unexpected error occurred. Please try again." };
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
    await db
      .prepare(
        `INSERT INTO contact_submissions (name, email, message, ip_address, user_agent, country, city, turnstile_token)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .bind(
        data.name,
        data.email,
        data.message,
        metadata.ip,
        metadata.userAgent,
        metadata.country,
        metadata.city,
        metadata.turnstileToken
      )
      .run();
    
    return { success: true };
  } catch (error) {
    console.error("D1 storage error:", error);
    return { success: false, error: "An unexpected error occurred. Please try again." };
  }
}
