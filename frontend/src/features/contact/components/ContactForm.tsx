import { useForm } from "@tanstack/react-form";
import { useState, useCallback, useRef, useEffect } from "react";
import { z } from "zod";
import {
  nameSchema,
  emailSchema,
  messageSchema,
} from "../contact.schema";
import { getZodError, submitContactFormRequest } from "../contact.util";

interface ContactFormProps {
  turnstileToken: string;
  onTurnstileReset?: () => void;
}

type FormStep = "name" | "email" | "message" | "success";

const STEP_ORDER: FormStep[] = ["name", "email", "message"];

const REDIRECT_DELAY_MS = 5000;

function SuccessMessage() {
  const [countdown, setCountdown] = useState(Math.ceil(REDIRECT_DELAY_MS / 1000));

  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      window.location.href = "/";
    }, REDIRECT_DELAY_MS);

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => {
      clearTimeout(redirectTimer);
      clearInterval(countdownInterval);
    };
  }, []);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <div className="text-center animate-typeform-scale">
        <div className="mb-4 text-5xl animate-typeform-check">✓</div>
        <h2 className="mb-2 text-2xl font-bold text-white animate-typeform-fade" style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}>Message Sent!</h2>
        <p className="text-gray-400 animate-typeform-fade" style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}>
          Thanks for reaching out. I'll get back to you soon.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-gray-500 animate-typeform-fade" style={{ animationDelay: "0.6s", animationFillMode: "backwards" }}>
          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-sm">Redirecting in {countdown}s...</span>
        </div>
      </div>
    </div>
  );
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
        await submitContactFormRequest({
          ...value,
          turnstileToken,
        });

        setCurrentStep("success");
      } catch (error) {
        setSubmitError(
          error instanceof Error ? error.message : "Something went wrong"
        );
        onTurnstileReset?.();
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
    return <SuccessMessage />;
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
