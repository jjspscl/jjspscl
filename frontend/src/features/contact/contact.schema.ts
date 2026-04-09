import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(100, { error: "Name must be less than 100 characters" })
    .regex(/^[a-zA-Z\s'-]+$/, { error: "Name can only contain letters, spaces, hyphens, and apostrophes" }),
  email: z
    .email({ error: "Please enter a valid email address" })
    .max(255, { error: "Email must be less than 255 characters" }),
  message: z
    .string()
    .min(10, { error: "Message must be at least 10 characters" })
    .max(2000, { error: "Message must be less than 2000 characters" }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export const nameSchema = contactFormSchema.shape.name;
export const emailSchema = contactFormSchema.shape.email;
export const messageSchema = contactFormSchema.shape.message;
