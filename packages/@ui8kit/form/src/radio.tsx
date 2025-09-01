import * as React from "react"


const Radio = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="radio"
      data-class="radio"
      className={[
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 h-4 w-4 rounded-full border bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
})

Radio.displayName = "Radio"

function RadioGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-class="radio-group" className={["flex gap-3", className].filter(Boolean).join(" ")} {...props} />
}

export { Radio, RadioGroup }


