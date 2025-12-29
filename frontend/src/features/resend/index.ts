export { setResendApiKey, sendContactNotification } from "./resend.service";

export type {
  ResendEmailPayload,
  SendEmailResult,
  ContactNotificationData,
} from "./resend.type";

export {
  RESEND_API_URL,
  CONTACT_NOTIFICATION_FROM,
  CONTACT_NOTIFICATION_TO,
} from "./resend.constant";
