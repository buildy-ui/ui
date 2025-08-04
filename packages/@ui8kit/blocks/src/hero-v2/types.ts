// Hero component types
export interface HeroData {
  badge?: string;
  title: string;
  description: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonIcon?: any;
  secondaryButtonIcon?: any;
  topButton?: {
    text: string;
    href?: string;
  };
  image?: {
    src: string;
    alt: string;
  };
  images?: Array<{
    id: string;
    src: string;
    alt: string;
  }>;
  imageUrl?: string;
  imageAlt?: string;
  stats?: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

// UI component props
export interface HeroBadgeProps {
  children: React.ReactNode;
}

export interface HeroTitleProps {
  children: React.ReactNode;
}

export interface HeroDescriptionProps {
  children: React.ReactNode;
}

export interface HeroButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost";
  icon?: any;
  onClick?: () => void;
}

export interface HeroActionsProps {
  children: React.ReactNode;
}

export interface HeroStatsProps {
  stats: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

// Component props
export interface HeroSectionProps {
  children: React.ReactNode;
  layout?: "split" | "centered";
}

export interface HeroContentProps {
  children: React.ReactNode;
  align?: "left" | "center";
}

export interface HeroMediaProps {
  src?: string;
  alt?: string;
  images?: Array<{
    id: string;
    src: string;
    alt: string;
  }>;
  variant?: "single" | "gallery";
}