import { cn } from "@lib/utils/cn";

export const CARD_VARIANT = {
  VHS: "vhs",
  OUTLINED: "outlined",
  PLAIN: "plain",
} as const;

export const CARD_PADDING = {
  SM: "sm",
  MD: "md",
  LG: "lg",
} as const;

export type CardVariant = (typeof CARD_VARIANT)[keyof typeof CARD_VARIANT];
export type CardPadding = (typeof CARD_PADDING)[keyof typeof CARD_PADDING];

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: CardVariant;
  padding?: CardPadding;
}

const VARIANT_CLASSES: Record<CardVariant, string> = {
  vhs: "border-4 border-border bg-surface text-ink shadow-vhs",
  outlined: "border-2 border-border bg-surface text-ink",
  plain: "border border-border-muted bg-transparent text-ink",
};

const PADDING_CLASSES: Record<CardPadding, string> = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({ children, className, variant = "vhs", padding = "md", ...props }: CardProps) {
  return (
    <div
      {...props}
      className={cn(
        "relative rounded-card",
        VARIANT_CLASSES[variant],
        PADDING_CLASSES[padding],
        className,
      )}
    >
      {children}
    </div>
  );
}
