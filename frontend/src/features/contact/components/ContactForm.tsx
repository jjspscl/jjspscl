import { useForm } from "@tanstack/react-form";
import { useState, useCallback, useRef } from "react";
import { z } from "zod";
import {
  nameSchema,
  emailSchema,
  messageSchema,
} from "../contact.schema";

interface ContactFormProps {
  turnstileToken: string;
  onTurnstileReset?: () => void;
}

type FormStep = "name" | "email" | "message" | "success";

const STEP_ORDER: FormStep[] = ["name", "email", "message"];

function getZodError(value: string, schema: z.ZodSchema): string | null {
  const result = schema.safeParse(value);
  if (result.success) return null;
  return result.error.errors[0]?.message ?? "Invalid input";
}

export function ContactForm({ turnstileToken, onTurnstileReset }: ContactFormProps) {
  const [currentStep, setCurrentStep] = useState<FormStep>("name");
  const [stepErrors, setStepErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [animationDirection, setAnimationDirection] = useState<"up" | "down">("up");
  const stepKey = useRef(0);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
    onSubmit: async ({ value }) => {
      setIsSubmitting(true);
      setSubmitError(null);

      try {
        const response = await fetch("/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...value,
            turnstileToken,
          }),
        });

        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error || "Failed to send message");
        }

        setCurrentStep("success");
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Something went wrong"
        );
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const validateAndAdvance = useCallback(
    (field: "name" | "email" | "message", schema: z.ZodSchema) => {
      const value = form.getFieldValue(field);
      const error = getZodError(value, schema);

      setStepErrors((prev) => ({ ...prev, [field]: error }));

      if (!error) {
        const currentIndex = STEP_ORDER.indexOf(field);
        if (currentIndex < STEP_ORDER.length - 1) {
          setAnimationDirection("up");
          stepKey.current += 1;
          setCurrentStep(STEP_ORDER[currentIndex + 1]);
        } else {
          form.handleSubmit();
        }
      }
    },
    [form]
  );

  const goBack = useCallback(() => {
    const currentIndex = STEP_ORDER.indexOf(currentStep as (typeof STEP_ORDER)[number]);
    if (currentIndex > 0) {
      setAnimationDirection("down");
      stepKey.current += 1;
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  }, [currentStep]);

  const handleKeyDown = useCallback(
    (
      e: React.KeyboardEvent,
      field: "name" | "email" | "message",
      schema: z.ZodSchema
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        validateAndAdvance(field, schema);
      }
    },
    [validateAndAdvance]
  );

  if (currentStep === "success") {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center">
        <div className="text-center animate-typeform-scale">
          <div className="mb-4 text-5xl animate-typeform-check">✓</div>
          <h2 className="mb-2 text-2xl font-bold text-white animate-typeform-fade" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>Message Sent!</h2>
          <p className="text-gray-400 animate-typeform-fade" style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}>
            Thanks for reaching out. I'll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[400px] flex-col justify-center">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        className="space-y-6"
      >
        {currentStep === "name" && (
          <div
            key={`name-${stepKey.current}`}
            className={`space-y-4 ${animationDirection === "up" ? "animate-typeform-up" : "animate-typeform-down"}`}
          >
            <label className="block">
              <span className="mb-2 block text-lg text-white">
                What's your name?
              </span>
              <form.Field name="name">
                {(field) => (
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={() =>
                      setStepErrors((prev) => ({
                        ...prev,
                        name: getZodError(field.state.value, nameSchema),
                      }))
                    }
                    onKeyDown={(e) => handleKeyDown(e, "name", nameSchema)}
                    placeholder="John Doe"
                    autoFocus
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                )}
              </form.Field>
              {stepErrors.name && (
                <span className="mt-2 block text-sm text-red-400 animate-typeform-fade">
                  {stepErrors.name}
                </span>
              )}
            </label>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => validateAndAdvance("name", nameSchema)}
                className="group relative rounded-lg bg-blue-600 px-6 py-2.5 text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {currentStep === "email" && (
          <div
            key={`email-${stepKey.current}`}
            className={`space-y-4 ${animationDirection === "up" ? "animate-typeform-up" : "animate-typeform-down"}`}
          >
            <label className="block">
              <span className="mb-2 block text-lg text-white">
                What's your email?
              </span>
              <form.Field name="email">
                {(field) => (
                  <input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={() =>
                      setStepErrors((prev) => ({
                        ...prev,
                        email: getZodError(field.state.value, emailSchema),
                      }))
                    }
                    onKeyDown={(e) => handleKeyDown(e, "email", emailSchema)}
                    placeholder="john@example.com"
                    autoFocus
                    className="w-full rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                )}
              </form.Field>
              {stepErrors.email && (
                <span className="mt-2 block text-sm text-red-400 animate-typeform-fade">
                  {stepErrors.email}
                </span>
              )}
            </label>
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={goBack}
                className="rounded-lg border border-gray-600 px-6 py-2.5 text-gray-300 transition-all duration-200 hover:border-gray-500 hover:bg-gray-800/50 active:scale-[0.98]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => validateAndAdvance("email", emailSchema)}
                className="group relative rounded-lg bg-blue-600 px-6 py-2.5 text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98]"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {currentStep === "message" && (
          <div
            key={`message-${stepKey.current}`}
            className={`space-y-4 ${animationDirection === "up" ? "animate-typeform-up" : "animate-typeform-down"}`}
          >
            <label className="block">
              <span className="mb-2 block text-lg text-white">
                What would you like to say?
              </span>
              <form.Field name="message">
                {(field) => (
                  <textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={() =>
                      setStepErrors((prev) => ({
                        ...prev,
                        message: getZodError(field.state.value, messageSchema),
                      }))
                    }
                    placeholder="Your message..."
                    rows={5}
                    autoFocus
                    className="w-full resize-none rounded-lg border border-gray-700 bg-gray-800 px-4 py-3 text-white placeholder-gray-500 transition-all duration-200 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  />
                )}
              </form.Field>
              {stepErrors.message && (
                <span className="mt-2 block text-sm text-red-400 animate-typeform-fade">
                  {stepErrors.message}
                </span>
              )}
            </label>
            {submitError && (
              <div className="rounded-lg bg-red-900/50 p-3 text-sm text-red-400 animate-typeform-fade">
                {submitError}
              </div>
            )}
            <div className="flex justify-between pt-2">
              <button
                type="button"
                onClick={goBack}
                className="rounded-lg border border-gray-600 px-6 py-2.5 text-gray-300 transition-all duration-200 hover:border-gray-500 hover:bg-gray-800/50 active:scale-[0.98]"
              >
                Back
              </button>
              <button
                type="button"
                onClick={() => validateAndAdvance("message", messageSchema)}
                disabled={isSubmitting}
                className="group relative rounded-lg bg-blue-600 px-6 py-2.5 text-white transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none"
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
