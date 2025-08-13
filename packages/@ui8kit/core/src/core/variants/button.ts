import { cva, type VariantProps } from "class-variance-authority";

// Button size variants
export const buttonSizeVariants = cva("", {
  variants: {
    size: {
      xs: "h-6 px-2 text-xs",
      sm: "h-9 px-3 text-sm", 
      default: "h-10 px-4 py-2",
      md: "h-10 px-4 py-2",
      lg: "h-11 px-8",
      xl: "h-12 px-10 text-base",
      icon: "h-10 w-10"
    }
  },
  defaultVariants: {
    size: "default"
  }
});

// Button style variants
export const buttonStyleVariants = cva("", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      primary: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline"
    }
  },
  defaultVariants: {
    variant: "default"
  }
});

// Button content alignment variants (layout-only, no visual decoration)
export const buttonContentAlignVariants = cva("", {
  variants: {
    contentAlign: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between"
    }
  }
});

export interface ButtonSizeProps extends VariantProps<typeof buttonSizeVariants> {}
export interface ButtonStyleProps extends VariantProps<typeof buttonStyleVariants> {} 
export interface ButtonContentAlignProps extends VariantProps<typeof buttonContentAlignVariants> {}