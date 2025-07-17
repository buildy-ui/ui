import * as React from "react"
import { cn } from "@/lib/utils";

function H1({ className, ...props }: React.ComponentProps<"h1">) {
  return (
    <h1
      data-class="h1"
      className={cn("text-3xl font-bold mb-4", className)}
      {...props}
    />
  )
}

H1.displayName = "H1"

function H2({ className, ...props }: React.ComponentProps<"h2">) {
  return (
    <h2
      data-class="h2"
      className={cn("text-2xl font-bold mb-4", className)}
      {...props}
    />
  )
}

H2.displayName = "H2"

function H3({ className, ...props }: React.ComponentProps<"h3">) {
  return (
    <h3
      data-class="h3"
      className={cn("text-xl font-bold", className)}
      {...props}
    />
  )
}

H3.displayName = "H3"

function H4({ className, ...props }: React.ComponentProps<"h4">) {
  return (
    <h4
      data-class="h4"
      className={cn("text-xl font-bold", className)}
      {...props}
    />
  )
}

H4.displayName = "H4"

function H5({ className, ...props }: React.ComponentProps<"h5">) {
  return (
    <h5
      data-class="h5"
      className={cn("text-lg font-bold", className)}
      {...props}
    />
  )
}

H5.displayName = "H5"

function H6({ className, ...props }: React.ComponentProps<"h6">) {
  return (
    <h6
      data-class="h6"
      className={cn("text-base font-bold", className)}
      {...props}
    />
  )
}

H6.displayName = "H6"

function P({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-class="p"
      className={cn(className)}
      {...props}
    />
  )
}

P.displayName = "P"

function Figure({ className, ...props }: React.ComponentProps<"figure">) {
  return (
    <figure
      data-class="figure"
      className={cn(className)}
      {...props}
    />
  )
}

Figure.displayName = "Figure"

function Figcaption({ className, ...props }: React.ComponentProps<"figcaption">) {
  return (
    <figcaption
      data-class="figcaption"
      className={cn(className)}
      {...props}
    />
  )
}

Figcaption.displayName = "Figcaption"

function Blockquote({ className, ...props }: React.ComponentProps<"blockquote">) {
  return (
    <blockquote
      data-class="blockquote"
      className={cn(className)}
      {...props}
    />
  )
}

Blockquote.displayName = "Blockquote"

function Time({ className, ...props }: React.ComponentProps<"time">) {
  return (
    <time
      data-class="time"
      className={cn(className)}
      {...props}
    />
  )
}

Time.displayName = "Time"

function Address({ className, ...props }: React.ComponentProps<"address">) {
  return (
    <address
      data-class="address"
      className={cn(className)}
      {...props}
    />
  )
}

Address.displayName = "Address"

function Ul({ className, ...props }: React.ComponentProps<"ul">) {
  return (
    <ul
      data-class="ul"
      className={cn(className)}
      {...props}
    />
  )
}

Ul.displayName = "Ul"

function Ol({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-class="ol"
      className={cn(className)}
      {...props}
    />
  )
}

Ol.displayName = "Ol"

function Li({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-class="li"
      className={cn(className)}
      {...props}
    />
  )
}

Li.displayName = "Li"

export { H1, H2, H3, H4, H5, H6, P, Figure, Figcaption, Blockquote, Time, Address, Ul, Ol, Li }
