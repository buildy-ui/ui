import { ReactNode, ElementType } from "react";

export interface DataAttributes {
  [key: `data-${string}`]: string | number | boolean | undefined;
}

// Base component props
export interface BaseComponentProps {
  className?: string;
  children?: ReactNode;
}

// Polymorphic component props
export interface PolymorphicComponentProps<T extends ElementType = "div"> {
  component?: T;
}

// Spacing props (Mantine style)
export interface SpacingProps {
  m?: string | number;
  mt?: string | number;
  mr?: string | number;
  mb?: string | number;
  ml?: string | number;
  mx?: string | number;
  my?: string | number;
  p?: string | number;
  pt?: string | number;
  pr?: string | number;
  pb?: string | number;
  pl?: string | number;
  px?: string | number;
  py?: string | number;
}

// Layout props
export interface LayoutProps {
  pos?: "static" | "relative" | "absolute" | "fixed" | "sticky";
  w?: string | number;
  h?: string | number;
  maw?: string | number;
  mah?: string | number;
  miw?: string | number;
  mih?: string | number;
}

// Typography props  
export interface TypographyProps {
  ta?: "left" | "center" | "right" | "justify";
  fw?: "normal" | "medium" | "semibold" | "bold";
  lh?: string | number;
  c?: string;
  size?: string;
}

// Responsive value type
export type ResponsiveValue<T> = T | {
  base?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  "2xl"?: T;
};

// Common component variants
export type ComponentSize = "xs" | "sm" | "md" | "lg" | "xl";
export type ComponentVariant = "default" | "secondary" | "destructive" | "outline" | "ghost";
export type ShadcnColors = 
  | "primary" 
  | "secondary" 
  | "destructive" 
  | "muted" 
  | "accent" 
  | "card" 
  | "popover" 
  | "background" 
  | "foreground"
  | "border" 
  | "input" 
  | "ring";
