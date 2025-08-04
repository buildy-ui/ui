// Blog component types
export interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  readTime: string;
  image?: {
    src: string;
    alt: string;
  };
  category: string;
  categoryId?: string;
}

export interface BlogData {
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  tagline?: string;
  viewAllText?: string;
  buttonText?: string;
  categories?: Array<{
    id: string;
    name: string;
  }>;
  posts: BlogPost[];
  featuredPost?: BlogPost;
}

// UI component props (NO className!)
export interface BlogBadgeProps {
  children: React.ReactNode;
}

export interface BlogTitleProps {
  children: React.ReactNode;
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: string;
}

export interface BlogDescriptionProps {
  children: React.ReactNode;
}

export interface BlogButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost";
  rightSection?: React.ReactNode;
  onClick?: () => void;
}

export interface BlogActionsProps {
  children: React.ReactNode;
}

export interface BlogCategoryProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
}

export interface BlogAuthorProps {
  name: string;
  avatar?: string;
}

export interface BlogMetaProps {
  date: string;
  readTime: string;
}

export interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "compact" | "featured";
}

// Component props (NO className!)
export interface BlogSectionProps {
  children: React.ReactNode;
  layout?: "grid" | "split";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

export interface BlogContentProps {
  children: React.ReactNode;
  align?: "left" | "center";
}

export interface BlogGridProps {
  children: React.ReactNode;
  cols?: "1" | "2" | "3" | "4" | "1-2" | "1-2-3" | "1-2-4";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

export interface BlogFiltersProps {
  categories: Array<{
    id: string;
    name: string;
  }>;
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}

export interface BlogListProps {
  posts: BlogPost[];
  variant?: "default" | "compact" | "timeline";
}