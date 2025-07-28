// Base variants
export * from './spacing';
export * from './rounded';
export * from './shadow';
export * from './colors';
export * from './layout';
export * from './border';
export * from './sizing';
export * from './flex';

// Component-specific variants
export * from './button';
export * from './badge';
export * from './typography';
export * from './image';

// Combined types for common use cases
import type { VariantSpacingProps } from './spacing';
import type { RoundedProps } from './rounded';
import type { ShadowProps } from './shadow';
import type { ColorProps } from './colors';
import type { BorderProps } from './border';
import type { VariantLayoutProps } from './layout';
import type { VariantFlexProps, VariantGridProps } from './flex';
import type { SizingProps, ContainerSizingProps, IconSizingProps } from './sizing';

import type {
  ButtonSizeProps,
  ButtonStyleProps
} from './button';

import type {
  BadgeSizeProps,
  BadgeStyleProps
} from './badge';

import type {
  TextSizeProps,
  FontWeightProps,
  TextAlignProps,
  LeadingProps,
  TypographyModifierProps
} from './typography';

import type {
  ImageFitProps,
  ImagePositionProps,
  AspectRatioProps
} from './image';

// Universal props interface
export interface UniversalProps extends 
  VariantSpacingProps,
  RoundedProps,
  ShadowProps,
  ColorProps,
  BorderProps {}

// Layout component props
export interface LayoutComponentProps extends 
  UniversalProps,
  VariantLayoutProps {}

// Grid component props  
export interface GridComponentProps extends
  LayoutComponentProps,
  VariantGridProps {}

// Typography props
export interface TypographyProps extends
  TextSizeProps,
  FontWeightProps,
  TextAlignProps,
  LeadingProps,
  TypographyModifierProps {}

// Button props
export interface ButtonVariantProps extends
  ButtonSizeProps,
  ButtonStyleProps {}

// Badge props
export interface BadgeVariantProps extends
  BadgeSizeProps,
  BadgeStyleProps {}

// Image props
export interface ImageVariantProps extends
  ImageFitProps,
  ImagePositionProps,
  AspectRatioProps {} 