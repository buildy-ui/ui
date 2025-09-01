import * as React from "react"


type SwitchProps = Omit<React.ComponentProps<"input">, "type">

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ className, ...props }, ref) => {
  return (
    <label data-class="switch" className={["inline-flex items-center gap-2", className].filter(Boolean).join(" ")}>
      <input
        type="checkbox"
        ref={ref}
        className="peer sr-only"
        {...props}
      />
      <span
        aria-hidden
        className={"relative inline-flex h-5 w-9 items-center rounded-full border border-input bg-input/50 transition-colors peer-disabled:opacity-50 peer-focus-visible:ring-[3px] peer-focus-visible:ring-ring/50 peer-focus-visible:border-ring peer-aria-invalid:ring-destructive/20 peer-aria-invalid:border-destructive"}
      >
        <span
          aria-hidden
          className={"absolute left-0.5 h-4 w-4 rounded-full bg-background shadow-xs transition-transform peer-checked:translate-x-4"}
        />
      </span>
    </label>
  )
})

export { Switch }


