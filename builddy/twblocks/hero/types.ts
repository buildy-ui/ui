import type { ButtonProps } from "@ui8kit/core";
import type { BadgeProps } from "@ui8kit/core";

// Base content type that can be extended by specific hero components
export interface BaseHeroContent {
  badge?: BadgeProps & {
    text: string;
  };
  title: string;
  description: string;
  buttons?: (ButtonProps & {
    id: string;
    text: string;
    icon?: React.ReactNode;
  })[];
} 