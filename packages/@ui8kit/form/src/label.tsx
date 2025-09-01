import * as React from "react"


const Label = React.forwardRef<HTMLLabelElement, React.ComponentProps<"label">>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      data-class="label"
      className={[
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  )
})

export { Label }