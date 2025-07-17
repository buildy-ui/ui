import * as React from "react"
import { cn } from "@/lib/utils";

function Aside({ className, ...props }: React.ComponentProps<"aside">) {
  return (
    <aside
      data-class="aside"
      className={cn(className)}
      {...props}
    />
  )
}

Aside.displayName = "Aside"

export { Aside }