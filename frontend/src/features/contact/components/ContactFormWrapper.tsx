import { Turnstile } from "@marsidev/react-turnstile";
import { useState } from "react";

import { ContactForm } from "./ContactForm";

interface ContactFormWrapperProps {
  turnstileSiteKey: string;
}

export function ContactFormWrapper({ turnstileSiteKey }: ContactFormWrapperProps) {
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileKey, setTurnstileKey] = useState(0);

  const handleTurnstileSuccess = (token: string) => {
    setTurnstileToken(token);
  };

  const handleTurnstileReset = () => {
    setTurnstileToken(null);
    setTurnstileKey((prev) => prev + 1);
  };

  return (
    <div>
      <div className="mb-6 text-center">
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
      <ContactForm
        turnstileToken={turnstileToken}
        onTurnstileReset={handleTurnstileReset}
      />
    </div>
  );
}
