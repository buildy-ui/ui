import * as React from "react"
import { cn } from "@ui8kit/core";

function Main({ className, ...props }: React.ComponentProps<"main">) {
  return (
    <main
      data-class="main"
      className={cn("flex-1", className)}
      {...props}
    />
  )
}

Main.displayName = "Main"

export { Main }