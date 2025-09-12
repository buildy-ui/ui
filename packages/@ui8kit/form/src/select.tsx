import * as React from "react"

interface SelectProps extends React.ComponentProps<"select"> {
  className?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      data-class="select"
      className={[
        "border-input focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
})

Select.displayName = "Select"

function SelectTrigger({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      type="button"
      data-class="select-trigger"
      className={[
        "border-input flex h-9 w-full items-center justify-between rounded-md border bg-background px-3 py-1 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
}

function SelectValue({ placeholder, value }: { placeholder?: string; value?: string }) {
  return (
    <span data-class="select-value" className="text-muted-foreground">
      {value || placeholder || "Select"}
    </span>
  )
}

function SelectContent({ className, children, position, ...props }: React.ComponentProps<"div"> & { position?: "top" | "bottom" }) {
  // When a position is provided, we switch to absolute positioning relative to a positioned ancestor
  // and control vertical placement explicitly. Without position, preserve existing inline flow layout.
  const isPositioned = position === "top" || position === "bottom";

  return (
    <div
      data-class="select-content"
      {...props}
      className={[
        isPositioned
          ? [
              "border-input z-50 w-full min-w-40 rounded-md border bg-background p-1 shadow-md absolute left-0",
              position === "top" ? "bottom-full mb-1" : "top-full mt-1",
            ].join(" ")
          : "border-input z-50 mt-1 w-full min-w-40 rounded-md border bg-background p-1 shadow-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  )
}

function SelectItem({ className, children, value, onClick }: { className?: string; children: React.ReactNode; value: string; onClick?: (value: string) => void }) {
  return (
    <button
      type="button"
      data-class="select-item"
      className={[
        "hover:bg-accent hover:text-accent-foreground w-full cursor-pointer rounded-sm px-2 py-1 text-left text-xs",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={() => onClick?.(value)}
    >
      {children}
    </button>
  )
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }


