// Blog component types
interface BlogPost {
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

interface BlogData {
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
interface BlogBadgeProps {
  children: React.ReactNode;
}

interface BlogTitleProps {
  children: React.ReactNode;
  order?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: string;
}

interface BlogDescriptionProps {
  children: React.ReactNode;
}

interface BlogButtonProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "secondary" | "ghost";
  rightSection?: React.ReactNode;
  onClick?: () => void;
}

interface BlogActionsProps {
  children: React.ReactNode;
}

interface BlogCategoryProps {
  children: React.ReactNode;
  variant?: "default" | "outline";
}

interface BlogAuthorProps {
  name: string;
  avatar?: string;
}

interface BlogMetaProps {
  date: string;
  readTime: string;
}

interface BlogCardProps {
  post: BlogPost;
  variant?: "default" | "compact" | "featured";
}

// Component props (NO className!)
interface BlogSectionProps {
  children: React.ReactNode;
  layout?: "grid" | "split";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
}

interface BlogContentProps {
  children: React.ReactNode;
  align?: "left" | "center";
}

interface BlogGridProps {
  children: React.ReactNode;
  cols?: "1" | "2" | "3" | "4" | "1-2" | "1-2-3" | "1-2-4";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
}

interface BlogFiltersProps {
  categories: Array<{
    id: string;
    name: string;
  }>;
  activeCategory?: string;
  onCategoryChange?: (categoryId: string) => void;
}

interface BlogListProps {
  posts: BlogPost[];
  variant?: "default" | "compact" | "timeline";
}