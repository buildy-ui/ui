import type { ReactNode, HTMLAttributes } from "react";
import { forwardRef } from "react";
import { cn } from "../../core";

export interface SheetProps extends HTMLAttributes<HTMLDivElement> {
  id?: string;
  side?: "left" | "right";
  openLabel?: string;
  closeLabel?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  title?: string;
  showTrigger?: boolean;
  children?: ReactNode;
}

export const Sheet = forwardRef<HTMLDivElement, SheetProps>(
  (
    {
      id = "sheet",
      side = "right",
      openLabel = "Open",
      closeLabel = "Close",
      size = "md",
      title,
      showTrigger = true,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const sidePosition = side === "left" ? "left-0" : "right-0";
    const sideBorder = side === "left" ? "border-r" : "border-l";
    const sizeClass =
      size === "sm"
        ? "w-64"
        : size === "md"
        ? "w-80"
        : size === "lg"
        ? "w-96"
        : size === "xl"
        ? "w-[28rem]"
        : "w-full";

    return (
      <div ref={ref} className={cn("relative", className)} data-class="sheet" {...props}>
        <input id={id} type="checkbox" className="peer hidden" />

        {showTrigger && (
          <label
            htmlFor={id}
            data-class="sheet-open-button"
            className={cn(
              "inline-flex items-center gap-2 px-4 py-2 rounded-md border",
              "border-border bg-card text-muted-foreground cursor-pointer"
            )}
          >
            {openLabel}
          </label>
        )}

        <div className="fixed inset-0 z-50 hidden peer-checked:block" data-class="sheet-portal">
          <label
            htmlFor={id}
            aria-label="Close overlay"
            data-class="sheet-overlay"
            className="absolute inset-0 bg-card/50 cursor-pointer"
          />

          <div
            role="dialog"
            aria-modal="true"
            data-class="sheet-panel"
            className={cn(
              "absolute top-0 h-full max-w-full p-4 bg-card",
              sidePosition,
              sideBorder,
              "border-border",
              sizeClass
            )}
          >
            <div className="flex items-center justify-between" data-class="sheet-header">
              {title ? (
                <span className="text-sm text-muted-foreground" data-class="sheet-title">
                  {title}
                </span>
              ) : (
                <span />
              )}
              <label
                htmlFor={id}
                aria-label={closeLabel}
                data-class="sheet-close-button"
                className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-border text-muted-foreground cursor-pointer"
              >
                ✕
              </label>
            </div>
            <div className="mt-4" data-class="sheet-content">
              {children}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

Sheet.displayName = "Sheet";
