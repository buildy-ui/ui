import { cva } from 'class-variance-authority';

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

// Additional typography helpers (transforms, whitespace, breaking, hyphens)
export { 
  textTransformVariants,
  whitespaceVariants,
  breakVariants,
  hyphenVariants,
  type TextTransformProps,
  type WhitespaceProps,
  type BreakProps,
  type HyphenProps
} from './typography';

// Combined types for common use cases
import type { VariantSpacingProps } from './spacing';
import type { RoundedProps } from './rounded';
import type { ShadowProps } from './shadow';
import type { ColorProps } from './colors';
import type { BorderProps } from './border';
import type { VariantLayoutProps } from './layout';
import type { VariantGridProps, VariantFlexProps } from './flex';
import type {  } from './sizing';

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

export type { VariantFlexProps };

// Effects / interaction optional variants
export const opacityVariants = cva("", {
  variants: {
    opacity: {
      0: "opacity-0",
      5: "opacity-5",
      10: "opacity-10",
      20: "opacity-20",
      25: "opacity-25",
      30: "opacity-30",
      40: "opacity-40",
      50: "opacity-50",
      60: "opacity-60",
      70: "opacity-70",
      75: "opacity-75",
      80: "opacity-80",
      90: "opacity-90",
      95: "opacity-95",
      100: "opacity-100"
    }
  }
});

export const cursorVariants = cva("", {
  variants: {
    cursor: {
      auto: "cursor-auto",
      default: "cursor-default",
      pointer: "cursor-pointer",
      wait: "cursor-wait",
      text: "cursor-text",
      move: "cursor-move",
      help: "cursor-help",
      notAllowed: "cursor-not-allowed"
    }
  }
});

export const userSelectVariants = cva("", {
  variants: {
    select: {
      none: "select-none",
      text: "select-text",
      all: "select-all",
      auto: "select-auto"
    }
  }
});

export const overscrollVariants = cva("", {
  variants: {
    overscroll: {
      auto: "overscroll-auto",
      contain: "overscroll-contain",
      none: "overscroll-none"
    }
  }
});

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