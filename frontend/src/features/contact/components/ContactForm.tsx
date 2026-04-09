import { useForm } from "@tanstack/react-form";
import { useState, useRef, useEffect } from "react";
import { z } from "zod";
import { cn } from "@lib/utils/cn";
import { Button } from "@components/Button";
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

const STEP_LABELS: Record<string, string> = {
  name: "Step 1 of 3",
  email: "Step 2 of 3",
  message: "Step 3 of 3",
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

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
        <div className="mb-4 flex justify-center animate-typeform-check">
          <CheckIcon className="w-14 h-14 text-vhs-green" />
        </div>
        <h2
          className="mb-2 text-2xl font-bold text-text-primary animate-typeform-fade"
          style={{ animationDelay: "0.2s", animationFillMode: "backwards" }}
        >
          Message Sent!
        </h2>
        <p
          className="text-text-secondary animate-typeform-fade"
          style={{ animationDelay: "0.4s", animationFillMode: "backwards" }}
        >
          Thanks for reaching out. I'll get back to you soon.
        </p>
        <div
          className="mt-6 flex items-center justify-center gap-2 text-text-secondary animate-typeform-fade"
          style={{ animationDelay: "0.6s", animationFillMode: "backwards" }}
        >
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

  const validateAndAdvance =
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
    };

  const goBack = () => {
    const currentIndex = STEP_ORDER.indexOf(currentStep as (typeof STEP_ORDER)[number]);
    if (currentIndex > 0) {
      setAnimationDirection("down");
      stepKey.current += 1;
      setCurrentStep(STEP_ORDER[currentIndex - 1]);
    }
  };

  const handleKeyDown =
    (
      e: React.KeyboardEvent,
      field: "name" | "email" | "message",
      schema: z.ZodSchema
    ) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        validateAndAdvance(field, schema);
      }
    };

  if (currentStep === "success") {
    return <SuccessMessage />;
  }

  const stepLabel = STEP_LABELS[currentStep] || "";

  return (
    <div className="flex min-h-[400px] flex-col justify-center">
      <div className="mb-6 flex items-center justify-between" aria-live="polite">
        <span className="text-sm font-medium text-text-secondary">{stepLabel}</span>
        <div className="flex gap-1.5">
          {STEP_ORDER.map((step, i) => (
            <div
              key={step}
              className={cn(
                "h-1.5 w-8 rounded-full transition-colors duration-300",
                STEP_ORDER.indexOf(currentStep as (typeof STEP_ORDER)[number]) >= i
                  ? "bg-accent"
                  : "bg-surface-secondary"
              )}
            />
          ))}
        </div>
      </div>

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
            className={cn("space-y-4", animationDirection === "up" ? "animate-typeform-up" : "animate-typeform-down")}
          >
            <label className="block">
              <span className="mb-2 block text-lg text-text-primary">
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
                    aria-describedby={stepErrors.name ? "name-error" : undefined}
                    aria-invalid={!!stepErrors.name}
                    className="w-full rounded-xl border-4 border-vhs-black dark:border-vhs-cream bg-background px-4 py-3 text-text-primary placeholder-text-secondary/50 transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                )}
              </form.Field>
              {stepErrors.name && (
                <span id="name-error" role="alert" className="mt-2 block text-sm text-vhs-red animate-typeform-fade">
                  {stepErrors.name}
                </span>
              )}
            </label>
            <div className="flex justify-end pt-2">
              <Button
                type="button"
                onClick={() => validateAndAdvance("name", nameSchema)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {currentStep === "email" && (
          <div
            key={`email-${stepKey.current}`}
            className={cn("space-y-4", animationDirection === "up" ? "animate-typeform-up" : "animate-typeform-down")}
          >
            <label className="block">
              <span className="mb-2 block text-lg text-text-primary">
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
                    aria-describedby={stepErrors.email ? "email-error" : undefined}
                    aria-invalid={!!stepErrors.email}
                    className="w-full rounded-xl border-4 border-vhs-black dark:border-vhs-cream bg-background px-4 py-3 text-text-primary placeholder-text-secondary/50 transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                )}
              </form.Field>
              {stepErrors.email && (
                <span id="email-error" role="alert" className="mt-2 block text-sm text-vhs-red animate-typeform-fade">
                  {stepErrors.email}
                </span>
              )}
            </label>
            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={goBack}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => validateAndAdvance("email", emailSchema)}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {currentStep === "message" && (
          <div
            key={`message-${stepKey.current}`}
            className={cn("space-y-4", animationDirection === "up" ? "animate-typeform-up" : "animate-typeform-down")}
          >
            <label className="block">
              <span className="mb-2 block text-lg text-text-primary">
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
                    aria-describedby={stepErrors.message ? "message-error" : undefined}
                    aria-invalid={!!stepErrors.message}
                    className="w-full resize-none rounded-xl border-4 border-vhs-black dark:border-vhs-cream bg-background px-4 py-3 text-text-primary placeholder-text-secondary/50 transition-all duration-200 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
                  />
                )}
              </form.Field>
              {stepErrors.message && (
                <span id="message-error" role="alert" className="mt-2 block text-sm text-vhs-red animate-typeform-fade">
                  {stepErrors.message}
                </span>
              )}
            </label>
            {submitError && (
              <div role="alert" className="rounded-xl border-2 border-vhs-red/30 bg-vhs-red/10 p-3 text-sm text-vhs-red animate-typeform-fade">
                {submitError}
              </div>
            )}
            <div className="flex justify-between pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={goBack}
              >
                Back
              </Button>
              <Button
                type="button"
                onClick={() => validateAndAdvance("message", messageSchema)}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
