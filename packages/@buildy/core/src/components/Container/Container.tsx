import { clsx } from "clsx";
import { cva } from "class-variance-authority";

export const containerVariants = cva("px-6 lg:px-8", {
  variants: {
    size: {
      sm: "max-w-2xl lg:max-w-4xl",
      md: "max-w-4xl lg:max-w-6xl",
      lg: "max-w-6xl lg:max-w-8xl",
    },
  },
});

export function Container({
  className,
  children,
  size = "md",
}: {
  className?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      data-slot="container"
      className={clsx("mx-auto", className, containerVariants({ size }))}>
      {children}
    </div>
  );
}
