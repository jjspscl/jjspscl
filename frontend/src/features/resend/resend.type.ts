export interface ResendEmailPayload {
  from: string;
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  reply_to?: string;
}

export interface ResendSuccessResponse {
  id: string;
}

export interface ResendErrorResponse {
  statusCode: number;
  message: string;
  name: string;
}

export interface SendEmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export interface ContactNotificationData {
  name: string;
  email: string;
  message: string;
  ip: string;
  country: string;
  city: string;
  submittedAt: Date;
}
