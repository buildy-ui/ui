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
    // Accent color utility
    accentColor: {
      auto: "accent-auto",
      inherit: "accent-inherit",
      current: "accent-current"
    },
    // Placeholder color
    placeholder: {
      foreground: "placeholder-foreground",
      muted: "placeholder-muted-foreground"
    },
    // Caret color
    caret: {
      primary: "caret-primary",
      secondary: "caret-secondary",
      accent: "caret-accent",
      foreground: "caret-foreground",
      current: "caret-current",
      transparent: "caret-transparent"
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
    },
    // Selection color (requires global selection styles support)
    selectionBg: {
      primary: "selection:bg-primary",
      secondary: "selection:bg-secondary",
      accent: "selection:bg-accent"
    },
    selectionText: {
      foreground: "selection:text-foreground",
      primary: "selection:text-primary"
    }
  }
});

// Types for color props
export interface ColorProps extends VariantProps<typeof colorVariants> {} 