import type { SpacingProps } from "./types";

// Spacing scale mapping
const spacingScale = {
  0: "0",
  xs: "0.25rem",
  sm: "0.5rem", 
  md: "1rem",
  lg: "1.5rem",
  xl: "2rem",
  "2xl": "3rem",
} as const;

// Convert spacing value to Tailwind class
function getSpacingValue(value: string | number | undefined): string {
  if (value === undefined) return "";
  
  if (typeof value === "number") {
    return `${value}`;
  }
  
  if (value in spacingScale) {
    return spacingScale[value as keyof typeof spacingScale];
  }
  
  return value;
}

// Generate spacing classes from props
export function getSpacingClasses(props: SpacingProps): string[] {
  const classes: string[] = [];
  
  // Margin classes
  if (props.m !== undefined) classes.push(`m-[${getSpacingValue(props.m)}]`);
  if (props.mt !== undefined) classes.push(`mt-[${getSpacingValue(props.mt)}]`);
  if (props.mr !== undefined) classes.push(`mr-[${getSpacingValue(props.mr)}]`);
  if (props.mb !== undefined) classes.push(`mb-[${getSpacingValue(props.mb)}]`);
  if (props.ml !== undefined) classes.push(`ml-[${getSpacingValue(props.ml)}]`);
  if (props.mx !== undefined) classes.push(`mx-[${getSpacingValue(props.mx)}]`);
  if (props.my !== undefined) classes.push(`my-[${getSpacingValue(props.my)}]`);
  
  // Padding classes
  if (props.p !== undefined) classes.push(`p-[${getSpacingValue(props.p)}]`);
  if (props.pt !== undefined) classes.push(`pt-[${getSpacingValue(props.pt)}]`);
  if (props.pr !== undefined) classes.push(`pr-[${getSpacingValue(props.pr)}]`);
  if (props.pb !== undefined) classes.push(`pb-[${getSpacingValue(props.pb)}]`);
  if (props.pl !== undefined) classes.push(`pl-[${getSpacingValue(props.pl)}]`);
  if (props.px !== undefined) classes.push(`px-[${getSpacingValue(props.px)}]`);
  if (props.py !== undefined) classes.push(`py-[${getSpacingValue(props.py)}]`);
  
  return classes;
}

// Hook for spacing classes  
export function useSpacing(props: SpacingProps): string {
  return getSpacingClasses(props).join(" ");
} 