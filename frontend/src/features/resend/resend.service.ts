import {
  RESEND_API_URL,
  CONTACT_NOTIFICATION_FROM,
  CONTACT_NOTIFICATION_TO,
} from "./resend.constant";
import type {
  ResendEmailPayload,
  ResendSuccessResponse,
  ResendErrorResponse,
  SendEmailResult,
  ContactNotificationData,
} from "./resend.type";

let _apiKey: string | undefined;

export function setResendApiKey(apiKey: string | undefined): void {
  _apiKey = apiKey;
}

function isConfigured(): boolean {
  return Boolean(_apiKey);
}

async function sendEmail(payload: ResendEmailPayload): Promise<SendEmailResult> {
  if (!isConfigured()) {
    console.warn("Resend API key not configured, skipping email");
    return { success: false, error: "Resend not configured" };
  }

  try {
    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${_apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = (await response.json()) as ResendErrorResponse;
      console.error("Resend API error:", errorData);
      return { success: false, error: errorData.message };
    }

    const data = (await response.json()) as ResendSuccessResponse;
    return { success: true, id: data.id };
  } catch (error) {
    console.error("Failed to send email:", error);
    return { success: false, error: "Failed to send email" };
  }
}

function formatContactNotificationHtml(data: ContactNotificationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e5e5; padding-bottom: 10px;">New Contact Form Submission</h2>
  
  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
    <tr>
      <td style="padding: 8px 0; font-weight: 600; width: 100px;">Name:</td>
      <td style="padding: 8px 0;">${escapeHtml(data.name)}</td>
    </tr>
    <tr>
      <td style="padding: 8px 0; font-weight: 600;">Email:</td>
      <td style="padding: 8px 0;"><a href="mailto:${escapeHtml(data.email)}" style="color: #0066cc;">${escapeHtml(data.email)}</a></td>
    </tr>
  </table>

  <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Message:</h3>
    <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
  </div>

  <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">
  
  <div style="font-size: 12px; color: #666;">
    <p style="margin: 4px 0;"><strong>IP:</strong> ${escapeHtml(data.ip)}</p>
    <p style="margin: 4px 0;"><strong>Location:</strong> ${escapeHtml(data.city)}, ${escapeHtml(data.country)}</p>
    <p style="margin: 4px 0;"><strong>Submitted:</strong> ${data.submittedAt.toISOString()}</p>
  </div>
</body>
</html>
`.trim();
}

function formatContactNotificationText(data: ContactNotificationData): string {
  return `
New Contact Form Submission
===========================

Name: ${data.name}
Email: ${data.email}

Message:
${data.message}

---
IP: ${data.ip}
Location: ${data.city}, ${data.country}
Submitted: ${data.submittedAt.toISOString()}
`.trim();
}

function escapeHtml(text: string): string {
  const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEntities[char] || char);
}

function formatSenderConfirmationHtml(data: ContactNotificationData): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h2 style="color: #1a1a1a; border-bottom: 2px solid #e5e5e5; padding-bottom: 10px;">Thanks for reaching out!</h2>
  
  <p>Hi ${escapeHtml(data.name)},</p>
  
  <p>I've received your message and will get back to you as soon as possible.</p>
  
  <div style="background: #f9f9f9; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <h3 style="margin: 0 0 10px 0; font-size: 14px; color: #666;">Your message:</h3>
    <p style="margin: 0; white-space: pre-wrap;">${escapeHtml(data.message)}</p>
  </div>

  <p style="color: #666;">Best regards,<br>JJ</p>
</body>
</html>
`.trim();
}

function formatSenderConfirmationText(data: ContactNotificationData): string {
  return `
Thanks for reaching out!

Hi ${data.name},

I've received your message and will get back to you as soon as possible.

Your message:
${data.message}

Best regards,
JP
`.trim();
}

export async function sendContactNotification(
  data: ContactNotificationData
): Promise<SendEmailResult> {
  const ownerPayload: ResendEmailPayload = {
    from: CONTACT_NOTIFICATION_FROM,
    to: CONTACT_NOTIFICATION_TO,
    subject: `Contact Form: ${data.name}`,
    html: formatContactNotificationHtml(data),
    text: formatContactNotificationText(data),
    reply_to: data.email,
  };

  const senderPayload: ResendEmailPayload = {
    from: CONTACT_NOTIFICATION_FROM,
    to: data.email,
    subject: "Thanks for your message!",
    html: formatSenderConfirmationHtml(data),
    text: formatSenderConfirmationText(data),
  };

  const [ownerResult, senderResult] = await Promise.all([
    sendEmail(ownerPayload),
    sendEmail(senderPayload),
  ]);

  if (!ownerResult.success) {
    return ownerResult;
  }

  if (!senderResult.success) {
    console.warn("Failed to send confirmation to sender:", senderResult.error);
  }

  return ownerResult;
}
