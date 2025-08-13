import * as React from "react"


function Checkbox({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type="checkbox"
      data-class="checkbox"
      className={[
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 h-4 w-4 rounded-sm border bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
}

export { Checkbox }


