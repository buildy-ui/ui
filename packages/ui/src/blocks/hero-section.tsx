import React from "react"
import { cn } from "../lib/utils"

interface HeroSectionProps extends React.HTMLAttributes<HTMLElement> {
  title?: string
  subtitle?: string
  ctaText?: string
  onCtaClick?: () => void
}

export function HeroSection({
  className,
  title = "Welcome to Buildy",
  subtitle = "Build beautiful UI components for your Vite React projects",
  ctaText = "Get Started",
  onCtaClick,
  ...props
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        "flex min-h-[500px] flex-col items-center justify-center space-y-6 text-center px-4",
        className
      )}
      {...props}
    >
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          {title}
        </h1>
        <p className="mx-auto max-w-[600px] text-lg text-muted-foreground sm:text-xl">
          {subtitle}
        </p>
      </div>
      
      {onCtaClick && (
        <button
          onClick={onCtaClick}
          className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
        >
          {ctaText}
        </button>
      )}
    </section>
  )
} 