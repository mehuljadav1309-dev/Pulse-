import { cn } from "@/lib/utils";

export function Logo({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "large";
}) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-2.5",
        variant === "large" && "gap-3",
        className
      )}
    >
      <span
        className={cn(
          "relative grid place-items-center rounded-lg bg-gradient-to-br from-accent to-mint",
          variant === "large" ? "h-9 w-9" : "h-7 w-7"
        )}
      >
        <span
          className={cn(
            "font-display font-bold text-background",
            variant === "large" ? "text-lg" : "text-sm"
          )}
        >
          P
        </span>
        <span className="absolute -inset-1 -z-10 rounded-xl bg-gradient-to-br from-accent to-mint opacity-50 blur-lg" />
      </span>
    </div>
  );
}
