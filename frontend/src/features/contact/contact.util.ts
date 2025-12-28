import { z } from "zod";

/**
 * Validates a value against a Zod schema and returns the first error message if validation fails.
 * @param value - The value to validate
 * @param schema - The Zod schema to validate against
 * @returns The error message if validation fails, null if valid
 */
export function getZodError(value: string, schema: z.ZodSchema): string | null {
  const result = schema.safeParse(value);
  if (result.success) return null;
  return result.error.errors[0]?.message ?? "Invalid input";
}

/**
 * Submits the contact form data to the server.
 * @param data - The form data including name, email, message, and turnstileToken
 * @returns The response data from the server
 * @throws Error if the request fails
 */
export async function submitContactFormRequest(data: {
  name: string;
  email: string;
  message: string;
  turnstileToken: string;
}): Promise<{ success: boolean; remaining?: number }> {
  const response = await fetch("/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const result = (await response.json()) as { error?: string };
    throw new Error(result.error || "Failed to send message");
  }

  return response.json() as Promise<{ success: boolean; remaining?: number }>;
}
