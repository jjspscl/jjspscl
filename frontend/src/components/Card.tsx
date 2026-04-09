import { cn } from "@lib/utils/cn";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "relative p-6 rounded-2xl border-4 cursor-pointer",
        "border-vhs-black dark:border-vhs-cream",
        "bg-vhs-cream dark:bg-vhs-black",
        "text-text-primary",
        "shadow-[8px_8px_0px_0px_rgba(0,0,0,0.8)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.3)]",
        "transition-shadow duration-200",
        "hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.8)] dark:hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
