import { Turnstile } from "@marsidev/react-turnstile";
import { useEffect, useRef, useState } from "react";
import { FormStatus } from "@components/forms/FormStatus";

import { TURNSTILE_ACTION } from "../contact.constant";
import { ContactForm } from "./ContactForm";

interface ContactFormWrapperProps {
  turnstileSiteKey: string;
}

export function ContactFormWrapper({ turnstileSiteKey }: ContactFormWrapperProps) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const [turnstileMessage, setTurnstileMessage] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!turnstileToken) return;

    formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea")?.focus();
  }, [turnstileToken]);

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
    setTurnstileMessage(null);
  };

  const handleTurnstileReset = () => {
    setTurnstileToken(null);
    setTurnstileKey((prev) => prev + 1);
  };

  const handleTurnstileFailure = (message: string) => {
    handleTurnstileReset();
    setTurnstileMessage(message);
  };

  return (
    <div>
      <div
        className={turnstileToken ? "hidden" : "flex min-h-[400px] flex-col items-center justify-center text-center"}
        aria-hidden={Boolean(turnstileToken)}
      >
        <p className="mb-4 text-base text-text-secondary">
          Please verify you're human before sending your message.
        </p>
        {turnstileMessage && <FormStatus tone="warning" live="assertive" className="mb-4 max-w-sm">{turnstileMessage}</FormStatus>}
        <div className="flex justify-center">
          <Turnstile
            key={turnstileKey}
            siteKey={turnstileSiteKey}
            onSuccess={handleTurnstileSuccess}
            onExpire={() => handleTurnstileFailure("Verification expired. Please complete the challenge again.")}
            onError={() => handleTurnstileFailure("Verification failed. Please try again.")}
            onTimeout={() => handleTurnstileFailure("Verification timed out. Please complete the challenge again.")}
            options={{
              theme: "auto",
              action: TURNSTILE_ACTION,
            }}
          />
        </div>
      </div>
      <div ref={formRef} className={turnstileToken ? undefined : "hidden"} aria-hidden={!turnstileToken}>
        <ContactForm
          turnstileToken={turnstileToken}
          onTurnstileReset={handleTurnstileReset}
        />
      </div>
    </div>
  );
}
