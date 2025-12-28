import { z } from "zod";

export function getZodError(value: string, schema: z.ZodSchema): string | null {
  const result = schema.safeParse(value);
  if (result.success) return null;
  return result.error.errors[0]?.message ?? "Invalid input";
}

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
