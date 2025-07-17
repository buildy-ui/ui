import { forwardRef, HTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, withDataClass } from "../../../core/utils";
import { DataClassName } from "../../../core/bem-types";

const cardVariants = cva(
  "rounded-lg border bg-card text-card-foreground shadow-sm",
  {
    variants: {
      variant: {
        default: "border-border",
        outlined: "border-border shadow-none",
        filled: "border-transparent bg-muted/50"
      },
      padding: {
        none: "p-0",
        sm: "p-3",
        md: "p-6",
        lg: "p-8"
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "md"
    }
  }
);

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  'data-class'?: DataClassName | string;
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, 'data-class': dataClass, ...props }, ref) => (
    <div
      ref={ref}
      {...withDataClass(className, dataClass || "card")}
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

// Card Header
const cardHeaderVariants = cva("flex flex-col space-y-1.5 p-6", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-6", 
      lg: "p-8"
    }
  },
  defaultVariants: {
    padding: "md"
  }
});

export interface CardHeaderProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardHeaderVariants> {}

const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, padding, ...props }, ref) => (
    <div
      ref={ref}
      data-class="card-header"
      className={cn(cardHeaderVariants({ padding }), className)}
      {...props}
    />
  )
);
CardHeader.displayName = "CardHeader";

// Card Title
const cardTitleVariants = cva("text-2xl font-semibold leading-none tracking-tight", {
  variants: {
    size: {
      sm: "text-lg",
      md: "text-xl",
      lg: "text-2xl",
      xl: "text-3xl"
    }
  },
  defaultVariants: {
    size: "lg"
  }
});

export interface CardTitleProps
  extends HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof cardTitleVariants> {}

const CardTitle = forwardRef<HTMLParagraphElement, CardTitleProps>(
  ({ className, size, ...props }, ref) => (
    <h3
      ref={ref}
      data-class="card-title"
      className={cn(cardTitleVariants({ size }), className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

// Card Description
const CardDescription = forwardRef<
  HTMLParagraphElement,
  HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-class="card-description"
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

// Card Content
const cardContentVariants = cva("p-6 pt-0", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-3 pt-0", 
      md: "p-6 pt-0",
      lg: "p-8 pt-0"
    }
  },
  defaultVariants: {
    padding: "md"
  }
});

export interface CardContentProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardContentVariants> {}

const CardContent = forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, padding, ...props }, ref) => (
    <div
      ref={ref}
      data-class="card-content"
      className={cn(cardContentVariants({ padding }), className)}
      {...props}
    />
  )
);
CardContent.displayName = "CardContent";

// Card Footer
const cardFooterVariants = cva("flex items-center p-6 pt-0", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-3 pt-0",
      md: "p-6 pt-0", 
      lg: "p-8 pt-0"
    }
  },
  defaultVariants: {
    padding: "md"
  }
});

export interface CardFooterProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardFooterVariants> {}

const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, padding, ...props }, ref) => (
    <div
      ref={ref}
      data-class="card-footer"
      className={cn(cardFooterVariants({ padding }), className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Card Section (for flexible content areas)
const cardSectionVariants = cva("", {
  variants: {
    padding: {
      none: "p-0",
      sm: "p-3",
      md: "p-6",
      lg: "p-8"
    },
    withBorder: {
      true: "border-t border-border",
      false: ""
    }
  },
  defaultVariants: {
    padding: "md",
    withBorder: false
  }
});

export interface CardSectionProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardSectionVariants> {}

const CardSection = forwardRef<HTMLDivElement, CardSectionProps>(
  ({ className, padding, withBorder, ...props }, ref) => (
    <div
      ref={ref}
      data-class="card-section"
      className={cn(cardSectionVariants({ padding, withBorder }), className)}
      {...props}
    />
  )
);
CardSection.displayName = "CardSection";

// Compound exports
const CompoundCard = Object.assign(Card, {
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Content: CardContent,
  Footer: CardFooter,
  Section: CardSection,
});

export {
  CompoundCard as Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardSection
}; 