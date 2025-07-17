import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DataClassName } from './bem-types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Conditionally adds data-class only when className contains utility classes
 * Returns data-class prop only if className has actual classes, undefined otherwise
 */
export function withDataClass(
  className: string | undefined,
  dataClass: DataClassName | string
): { 'data-class'?: DataClassName | string } {
  // Check if className has actual utility classes (not just empty string or whitespace)
  const hasUtilityClasses = className && className.trim().length > 0;
  
  return hasUtilityClasses ? { 'data-class': dataClass } : {};
}

/**
 * Smart component props helper that only includes data-class when needed
 */
export function createComponentProps(
  className: string | undefined,
  dataClass: DataClassName | string | undefined,
  restProps: Record<string, any> = {}
): Record<string, any> {
  // Only include data-class if className has utility classes
  const dataClassProps = dataClass ? withDataClass(className, dataClass) : {};
  
  return {
    ...restProps,
    className,
    ...dataClassProps
  };
}

/**
 * Check if a string contains Tailwind utility classes
 */
export function hasUtilityClasses(className: string | undefined): boolean {
  if (!className || !className.trim()) return false;
  
  // Common Tailwind utility patterns
  const utilityPatterns = [
    /\b(flex|grid|block|inline|hidden)\b/,           // Display
    /\b(w-|h-|max-w-|max-h-|min-w-|min-h-)\w+/,     // Sizing
    /\b(p-|px-|py-|m-|mx-|my-|pt-|pb-|pl-|pr-)\w+/, // Spacing
    /\b(text-|font-|leading-|tracking-)\w+/,         // Typography
    /\b(bg-|border-|rounded-|shadow-)\w+/,           // Background/Border
    /\b(justify-|items-|content-|self-)\w+/,         // Flexbox/Grid
    /\b(absolute|relative|fixed|sticky)\b/,          // Position
    /\b(hover:|focus:|active:|group-hover:)\w+/,     // States
    /\b(sm:|md:|lg:|xl:|2xl:)\w+/,                   // Responsive
    /\b(gap-|space-x-|space-y-)\w+/                 // Spacing utilities
  ];
  
  return utilityPatterns.some(pattern => pattern.test(className));
} 