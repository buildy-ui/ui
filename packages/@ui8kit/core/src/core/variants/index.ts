// Export all variants and their types
export * from './spacing';
export * from './rounded';
export * from './shadow';
export * from './colors';
export * from './layout';
export * from './border';
export * from './sizing';
export * from './flex';

// Combined props type for convenience
import type { VariantSpacingProps } from './spacing';
import type { RoundedProps } from './rounded';
import type { ShadowProps } from './shadow';
import type { ColorProps } from './colors';
import type { VariantLayoutProps } from './layout';
import type { BorderProps } from './border';
import type { SizingProps } from './sizing';
import type { VariantFlexProps, VariantGridProps } from './flex';

// Universal props that can be applied to any component
export interface UniversalProps extends 
  VariantSpacingProps,
  RoundedProps,
  ShadowProps,
  ColorProps,
  VariantLayoutProps,
  BorderProps {}

// Layout-specific props for containers
export interface LayoutComponentProps extends
  UniversalProps,
  VariantFlexProps {}

// Grid-specific props
export interface GridComponentProps extends
  UniversalProps,
  VariantGridProps {} 