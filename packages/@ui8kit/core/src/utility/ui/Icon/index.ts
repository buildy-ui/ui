export { Icon, type IconProps } from "./Icon";

// Utility function to create Icon with Lucide
export const createLucideIcon = (LucideIcon: any, props?: any) => {
  return {
    lucideIcon: LucideIcon,
    ...props
  };
};

// Common Lucide icon configurations
export const lucideIconSizes = {
  xs: { size: "xs" as const },
  sm: { size: "sm" as const },
  md: { size: "md" as const },
  lg: { size: "lg" as const },
  xl: { size: "xl" as const },
  "2xl": { size: "2xl" as const }
} as const; 