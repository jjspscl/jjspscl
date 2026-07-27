import { cn } from "@lib/utils/cn";

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

export function TextArea({ className, invalid = false, ...props }: TextAreaProps) {
  return (
    <textarea
      {...props}
      aria-invalid={invalid || undefined}
      className={cn(
        "min-h-12 w-full rounded-control border-2 border-border bg-surface px-control-x py-control-y text-ink",
        "placeholder:text-ink-muted/60 transition-[color,background-color,border-color,box-shadow] duration-200 ease-vhs",
        "focus:border-action focus:outline-none focus:ring-2 focus:ring-action/20",
        "disabled:cursor-not-allowed disabled:opacity-60",
        invalid && "border-feedback-danger",
        className,
      )}
    />
  );
}
