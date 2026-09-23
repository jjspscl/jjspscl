import { TURNSTILE_ACTION, TURNSTILE_ALLOWED_HOSTNAMES, TURNSTILE_VERIFY_URL } from "./contact.constant";
import { checkAndIncrementDailyLimit, checkDailyLimit, releaseDailyLimit, storeContactSubmission } from "./contact.db";
import type {
  ContactSubmissionData,
  ContactSubmissionMetadata,
  DailyLimitResult,
  SubmissionResult,
  TurnstileResponse,
  TurnstileVerificationResult,
} from "./contact.type";
import { sendContactNotification } from "../resend";

type D1Database = Cloudflare.Env["DB"];

export interface ContactServiceDeps {
  db: D1Database | undefined;
  turnstileSecretKey: string;
  resendApiKey: string | undefined;
}

export async function verifyTurnstileToken(
  token: string,
  secretKey: string,
  remoteIp?: string
): Promise<TurnstileVerificationResult> {
  if (!secretKey) {
    console.error("Turnstile secret key not configured");
    return { success: false, error: "Server configuration error" };
  }

  try {
    const formData = new FormData();
    formData.append("secret", secretKey);
    formData.append("response", token);
    formData.append("remoteip", remoteIp ?? "");

    const response = await fetch(TURNSTILE_VERIFY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return { success: false, error: "Turnstile service unavailable" };
    }

    const result = (await response.json()) as TurnstileResponse;
    const hostnameAllowed = result.hostname
      ? TURNSTILE_ALLOWED_HOSTNAMES.includes(result.hostname as (typeof TURNSTILE_ALLOWED_HOSTNAMES)[number])
      : false;
    const actionAllowed = result.action === TURNSTILE_ACTION;

    if (!result.success || !hostnameAllowed || !actionAllowed) {
      return { success: false, error: "Security verification failed" };
    }

    return { success: true };
  } catch (error) {
    console.error("Turnstile verification error:", error);
    return { success: false, error: "Failed to verify token" };
  }
}

export async function checkRateLimit(
  db: D1Database | undefined,
  ip: string
): Promise<DailyLimitResult> {
  return checkAndIncrementDailyLimit(db, ip);
}

export async function getRateLimitStatus(
  db: D1Database | undefined,
  ip: string
): Promise<DailyLimitResult> {
  return checkDailyLimit(db, ip);
}

export async function submitContactForm(
  db: D1Database | undefined,
  resendApiKey: string | undefined,
  data: ContactSubmissionData,
  metadata: ContactSubmissionMetadata,
  waitUntil?: (promise: Promise<unknown>) => void
): Promise<SubmissionResult> {
  const result = await storeContactSubmission(db, data, metadata);

  if (result.success) {
    const emailPromise = sendContactNotification(resendApiKey, {
      name: data.name,
      email: data.email,
      message: data.message,
      ip: metadata.ip,
      country: metadata.country,
      city: metadata.city,
      submittedAt: new Date(),
    }).then((emailResult) => {
      if (!emailResult.success) console.error("Failed to send contact notification:", emailResult.error);
    });

    if (waitUntil) waitUntil(emailPromise);
    else await emailPromise;
  } else {
    await releaseDailyLimit(db, metadata.ip);
  }

  return result;
}
