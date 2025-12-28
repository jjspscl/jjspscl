import { Turnstile } from "@marsidev/react-turnstile";
import { useCallback, useState } from "react";

import { ContactForm } from "./ContactForm";

interface ContactFormWrapperProps {
  turnstileSiteKey: string;
}

export function ContactFormWrapper({ turnstileSiteKey }: ContactFormWrapperProps) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const handleTurnstileSuccess = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileReset = useCallback(() => {
    setTurnstileToken(null);
    setTurnstileKey((prev) => prev + 1);
  }, []);

  if (!turnstileToken) {
    return (
      <div className="text-center">
        <p className="text-base text-text-secondary mb-6">
          Please verify you're human to access the contact form.
        </p>
        <div className="flex justify-center">
          <Turnstile
            key={turnstileKey}
            siteKey={turnstileSiteKey}
            onSuccess={handleTurnstileSuccess}
            options={{
              theme: "auto",
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <ContactForm
      turnstileToken={turnstileToken}
      onTurnstileReset={handleTurnstileReset}
    />
  );
}
