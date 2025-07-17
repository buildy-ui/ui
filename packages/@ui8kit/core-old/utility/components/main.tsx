import * as React from "react"
import { cn } from "@/lib/utils";

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