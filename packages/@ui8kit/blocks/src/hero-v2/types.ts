// Hero component types
interface HeroData {
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
interface HeroBadgeProps {
  children: React.ReactNode;
}

interface HeroTitleProps {
  children: React.ReactNode;
}

interface HeroDescriptionProps {
  children: React.ReactNode;
}

interface HeroButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost";
  icon?: any;
  onClick?: () => void;
}

interface HeroActionsProps {
  children: React.ReactNode;
}

interface HeroStatsProps {
  stats: Array<{
    id: string;
    value: string;
    label: string;
  }>;
}

// Component props
interface HeroSectionProps {
  children: React.ReactNode;
  layout?: "split" | "centered";
}

interface HeroContentProps {
  children: React.ReactNode;
  align?: "left" | "center";
}

interface HeroMediaProps {
  src?: string;
  alt?: string;
  images?: Array<{
    id: string;
    src: string;
    alt: string;
  }>;
  variant?: "single" | "gallery";
}