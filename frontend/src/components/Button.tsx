import { cn } from "@lib/utils/cn";

type ButtonVariant = "primary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: cn(
    "border-vhs-black dark:border-vhs-cream",
    "bg-accent text-vhs-cream dark:text-vhs-black",
  ),
  outline: cn(
    "border-vhs-black dark:border-vhs-cream",
  ),
  ghost: cn(
    "border-vhs-black/30 dark:border-vhs-cream/30",
    "text-text-secondary",
    "hover:border-vhs-black dark:hover:border-vhs-cream hover:text-text-primary",
  ),
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5",
  lg: "px-8 py-3 text-lg",
};

const SHADOW_CLASSES: Record<ButtonSize, string> = {
  sm: "vhs-shadow",
  md: "vhs-shadow",
  lg: "vhs-shadow-lg",
};

const BASE_CLASSES = cn(
  "inline-flex items-center justify-center",
  "rounded-xl border-4 font-bold",
  "transition-all duration-200 active:scale-[0.98]",
  "disabled:cursor-not-allowed disabled:opacity-50",
);

type ButtonElementProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: "button";
  href?: never;
};

type AnchorElementProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  as: "a";
  href: string;
};

type ButtonProps = (ButtonElementProps | AnchorElementProps) & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

export function Button({
  as,
  variant = "primary",
  size = "md",
  className,
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
    return <a className={classes} {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)} />;
  }

  return <button className={classes} {...(props as React.ButtonHTMLAttributes<HTMLButtonElement>)} />;
}
