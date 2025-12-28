import { TURNSTILE_VERIFY_URL } from "./contact.constant";
import { checkAndIncrementDailyLimit, checkDailyLimit, storeContactSubmission } from "./contact.db";
import type {
  ContactSubmissionData,
  ContactSubmissionMetadata,
  DailyLimitResult,
  SubmissionResult,
  TurnstileResponse,
  TurnstileVerificationResult,
} from "./contact.type";

type D1Database = Env["DB"];

let _db: D1Database | undefined;
let _turnstileSecretKey: string | undefined;

export function setDatabase(db: D1Database | undefined): void {
  _db = db;
}

export function setTurnstileSecretKey(secretKey: string): void {
  _turnstileSecretKey = secretKey;
}

function getDatabase(): D1Database | undefined {
  return _db;
}

export async function verifyTurnstileToken(token: string): Promise<TurnstileVerificationResult> {
  if (!_turnstileSecretKey) {
    console.error("Turnstile secret key not configured");
    return { success: false, error: "Server configuration error" };
  }

  try {
    const formData = new FormData();
    formData.append("secret", _turnstileSecretKey);
    formData.append("response", token);

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return { success: false, error: "Turnstile service unavailable" };
    }

    const result = (await response.json()) as TurnstileResponse;
    return { success: result.success, error: result["error-codes"]?.join(", ") };
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return { success: false, error: "Failed to verify token" };
  }
}

export async function checkRateLimit(ip: string): Promise<DailyLimitResult> {
  return checkAndIncrementDailyLimit(getDatabase(), ip);
}

export async function getRateLimitStatus(ip: string): Promise<DailyLimitResult> {
  return checkDailyLimit(getDatabase(), ip);
}

export async function submitContactForm(
  data: ContactSubmissionData,
  metadata: ContactSubmissionMetadata
): Promise<SubmissionResult> {
  const result = await storeContactSubmission(getDatabase(), data, metadata);

  if (result.success) {
    console.log("Contact form submission:", { ...data, metadata });
    // TODO: Add email notifications here
    // TODO: Add Discord notifications here
  }

  return result;
}
