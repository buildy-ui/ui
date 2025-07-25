import * as React from "react"
import { cn } from "@ui8kit/core";

function Header({ className, ...props }: React.ComponentProps<"header">) {
  return (
    <header
      data-class="header"
      className={cn(className)}
      {...props}
    />
  )
}

Header.displayName = "Header"

export { Header }