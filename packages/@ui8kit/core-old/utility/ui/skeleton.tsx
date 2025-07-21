import { cn } from "@ui8kit/core"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-class="skeleton"
      className={cn("bg-accent animate-pulse rounded-md", className)}
      {...props}
    />
  )
}

export { Skeleton }