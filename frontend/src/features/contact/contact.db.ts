import { DAILY_LIMIT } from "./contact.constant";
import type {
  ContactSubmissionData,
  ContactSubmissionMetadata,
  DailyLimitResult,
  SubmissionResult,
} from "./contact.type";

type D1Database = Env["DB"];

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
    const existing = await db
      .prepare("SELECT count FROM daily_limits WHERE ip_address = ? AND date = ?")
      .bind(ip, today)
      .first<{ count: number }>();

    if (existing) {
      if (existing.count >= DAILY_LIMIT) {
        return { allowed: false, remaining: 0 };
      }

      await db
        .prepare(
          "UPDATE daily_limits SET count = count + 1, updated_at = CURRENT_TIMESTAMP WHERE ip_address = ? AND date = ?"
        )
        .bind(ip, today)
        .run();

      return { allowed: true, remaining: DAILY_LIMIT - existing.count - 1 };
    }

    await db
      .prepare("INSERT INTO daily_limits (ip_address, date, count) VALUES (?, ?, 1)")
      .bind(ip, today)
      .run();

    return { allowed: true, remaining: DAILY_LIMIT - 1 };
  } catch (error) {
    console.error("D1 rate limit error:", error);
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
