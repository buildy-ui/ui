import * as React from "react"
import { cn } from "@ui8kit/core";

function Footer({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      data-class="footer"
      className={cn(className)}
      {...props}
    />
  )
}

Footer.displayName = "Footer"

export { Footer }