import { cn } from "@lib/utils/cn";

interface FormStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  tone: "info" | "success" | "warning" | "error";
  live?: "polite" | "assertive" | "off";
  busy?: boolean;
}

const TONE_CLASSES: Record<FormStatusProps["tone"], string> = {
  info: "border-feedback-info bg-feedback-info-surface text-feedback-info",
  success: "border-feedback-success bg-feedback-success-surface text-feedback-success",
  warning: "border-feedback-warning bg-feedback-warning-surface text-feedback-warning",
  error: "border-feedback-danger bg-feedback-danger-surface text-feedback-danger",
};

export function FormStatus({ className, tone, live = "off", busy = false, ...props }: FormStatusProps) {
  return (
    <div
      {...props}
      className={cn("rounded-card border-2 p-3 text-sm", TONE_CLASSES[tone], className)}
      role={live === "assertive" ? "alert" : undefined}
      aria-live={live === "off" ? undefined : live}
      aria-busy={busy || undefined}
    />
  );
}
