// Components
export { ContactForm } from "./components/ContactForm";
export { ContactFormWrapper } from "./components/ContactFormWrapper";

// Schema
export { contactFormSchema, nameSchema, emailSchema, messageSchema } from "./contact.schema";
export type { ContactFormData } from "./contact.schema";

// Service (server-side)
export {
  setDatabase,
  setTurnstileSecretKey,
  verifyTurnstileToken,
  checkRateLimit,
  getRateLimitStatus,
  submitContactForm,
} from "./contact.service";

// Utilities (client-side)
export { getZodError, submitContactFormRequest } from "./contact.util";

// Constants
export { DAILY_LIMIT, TURNSTILE_VERIFY_URL } from "./contact.constant";

// Types
export type {
  DailyLimitResult,
  ContactSubmissionData,
  ContactSubmissionMetadata,
  SubmissionResult,
  TurnstileVerificationResult,
  TurnstileResponse,
} from "./contact.type";
