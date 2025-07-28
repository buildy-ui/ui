import { cva, type VariantProps } from "class-variance-authority";

export const colorVariants = cva("", {
  variants: {
    // Background colors
    bg: {
      transparent: "bg-transparent",
      background: "bg-background",
      foreground: "bg-foreground",
      primary: "bg-primary",
      "primary-foreground": "bg-primary-foreground",
      secondary: "bg-secondary",
      "secondary-foreground": "bg-secondary-foreground",
      muted: "bg-muted",
      "muted-foreground": "bg-muted-foreground",
      accent: "bg-accent",
      "accent-foreground": "bg-accent-foreground",
      destructive: "bg-destructive",
      "destructive-foreground": "bg-destructive-foreground",
      border: "bg-border",
      input: "bg-input",
      ring: "bg-ring",
      card: "bg-card",
      popover: "bg-popover"
    },
    // Text colors
    c: {
      foreground: "text-foreground",
      primary: "text-primary",
      "primary-foreground": "text-primary-foreground",
      secondary: "text-secondary",
      "secondary-foreground": "text-secondary-foreground",
      muted: "text-muted-foreground",
      accent: "text-accent-foreground",
      destructive: "text-destructive",
      "destructive-foreground": "text-destructive-foreground"
    },
    // Border colors
    borderColor: {
      transparent: "border-transparent",
      current: "border-current",
      border: "border-border",
      input: "border-input",
      ring: "border-ring",
      foreground: "border-foreground",
      primary: "border-primary",
      secondary: "border-secondary",
      destructive: "border-destructive",
      muted: "border-muted",
      accent: "border-accent"
    }
  }
});

// Types for color props
export interface ColorProps extends VariantProps<typeof colorVariants> {} 