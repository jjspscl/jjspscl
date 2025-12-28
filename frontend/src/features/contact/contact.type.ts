export interface DailyLimitResult {
  allowed: boolean;
  remaining: number;
  error?: string;
}

export interface ContactSubmissionData {
  name: string;
  email: string;
  message: string;
}

export interface ContactSubmissionMetadata {
  ip: string;
  userAgent: string;
  country: string;
  city: string;
  turnstileToken: string;
}

export interface SubmissionResult {
  success: boolean;
  error?: string;
}

export interface TurnstileVerificationResult {
  success: boolean;
  error?: string;
}

export interface TurnstileResponse {
  success: boolean;
  "error-codes"?: string[];
}
