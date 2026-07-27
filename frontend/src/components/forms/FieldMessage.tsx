import { cn } from "@lib/utils/cn";

interface FieldMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  tone?: "help" | "error";
}

export function FieldMessage({ className, tone = "help", ...props }: FieldMessageProps) {
  return (
    <p
      {...props}
      role={tone === "error" ? "alert" : undefined}
      className={cn("mt-2 text-sm", tone === "error" ? "text-feedback-danger" : "text-ink-muted", className)}
    />
  );
}
