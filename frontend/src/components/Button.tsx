import { cn } from "@lib/utils/cn";

export const BUTTON_VARIANT = {
  PRIMARY: "primary",
  OUTLINE: "outline",
  GHOST: "ghost",
} as const;

export const BUTTON_SIZE = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

export type ButtonVariant = (typeof BUTTON_VARIANT)[keyof typeof BUTTON_VARIANT];
export type ButtonSize = (typeof BUTTON_SIZE)[keyof typeof BUTTON_SIZE];

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: cn(
    "border-border bg-action text-action-contrast",
    "hover:bg-action-hover",
  ),
  outline: cn(
    "border-border bg-surface text-ink",
    "hover:bg-surface-muted",
  ),
  ghost: cn(
    "border-transparent bg-transparent text-ink-muted",
    "hover:border-border hover:text-ink",
  ),
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "min-h-11 px-4 py-1.5 text-sm",
  md: "min-h-11 px-6 py-2.5",
  lg: "min-h-12 px-8 py-3 text-lg",
};

const SHADOW_CLASSES: Record<ButtonSize, string> = {
  sm: "shadow-vhs hover:shadow-vhs-active",
  md: "shadow-vhs hover:shadow-vhs-active",
  lg: "shadow-vhs hover:shadow-vhs-active",
};

const BASE_CLASSES = cn(
  "inline-flex items-center justify-center",
  "gap-2 rounded-control border-4 font-bold",
  "transition-[color,background-color,border-color,box-shadow,transform] duration-200 ease-vhs",
  "active:translate-x-px active:translate-y-px",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

interface ButtonSharedProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

interface ButtonElementProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonSharedProps {
  as?: "button";
  href?: never;
  isLoading?: boolean;
  loadingLabel?: string;
}

interface AnchorElementProps extends React.AnchorHTMLAttributes<HTMLAnchorElement>, ButtonSharedProps {
  as: "a";
  href: string;
  isLoading?: never;
  loadingLabel?: never;
}

export type ButtonProps = ButtonElementProps | AnchorElementProps;

export function Button({
  as,
  variant = "primary",
  size = "md",
  className,
  isLoading = false,
  loadingLabel = "Loading",
  children,
  ...props
}: ButtonProps) {
  const classes = cn(
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    variant !== "ghost" && SHADOW_CLASSES[size],
    className,
  );

  if (as === "a") {
    return <a className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}>{children}</a>;
  }

  const { disabled, type = "button", ...buttonProps } = props as React.ButtonHTMLAttributes<HTMLButtonElement>;

  return (
    <button
      {...buttonProps}
      type={type}
      className={classes}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
      aria-disabled={isLoading || undefined}
    >
      {isLoading && (
        <svg aria-hidden="true" className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" />
          <path className="opacity-90" d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
        </svg>
      )}
      <span>{isLoading ? loadingLabel : children}</span>
    </button>
  );
}
