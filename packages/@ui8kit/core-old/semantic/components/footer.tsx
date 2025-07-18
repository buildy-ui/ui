import * as React from "react"
import { cn } from "@/lib/utils";

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