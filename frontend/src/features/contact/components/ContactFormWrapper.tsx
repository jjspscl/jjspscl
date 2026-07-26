import { Turnstile } from "@marsidev/react-turnstile";
import { useEffect, useRef, useState } from "react";

import { ContactForm } from "./ContactForm";

interface ContactFormWrapperProps {
  turnstileSiteKey: string;
}

export function ContactFormWrapper({ turnstileSiteKey }: ContactFormWrapperProps) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!turnstileToken) return;

    formRef.current?.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea")?.focus();
  }, [turnstileToken]);

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
  };

  const handleTurnstileReset = () => {
    setTurnstileToken(null);
    setTurnstileKey((prev) => prev + 1);
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
        <div className="flex justify-center">
          <Turnstile
            key={turnstileKey}
            siteKey={turnstileSiteKey}
            onSuccess={handleTurnstileSuccess}
            onExpire={handleTurnstileReset}
            onError={handleTurnstileReset}
            onTimeout={handleTurnstileReset}
            options={{
              theme: "auto",
              action: "contact",
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
