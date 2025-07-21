import { 
  Info, 
  Rocket, 
  ArrowRight, 
  Play, 
  Star, 
  Heart, 
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Download,
  Upload,
  Edit,
  Trash,
  Plus,
  Minus,
  Home,
  Settings,
  LucideIcon 
} from "lucide-react";
import { cn } from "@ui8kit/core";

// Маппинг строковых названий иконок к компонентам Lucide
const iconMap: Record<string, LucideIcon> = {
  Info,
  Rocket,
  ArrowRight,
  Play,
  Star,
  Heart,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Menu,
  Search,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Download,
  Upload,
  Edit,
  Trash,
  Plus,
  Minus,
  Home,
  Settings,
};

// Компонент для динамического рендеринга Lucide иконок
export interface LucideProps {
  component: string | LucideIcon;
  size?: number;
  className?: string;
  strokeWidth?: number;
}

export const Lucide = ({ 
  component, 
  size = 16, 
  className,
  strokeWidth = 2 
}: LucideProps) => {
  const IconComponent = typeof component === 'string' ? iconMap[component] : component;
  
  if (!IconComponent) {
    console.warn(`Icon "${component}" not found in iconMap`);
    return null;
  }
  
  return (
    <IconComponent 
      size={size} 
      strokeWidth={strokeWidth}
      className={cn("inline-block", className)} 
    />
  );
};

// Экспорт иконок для прямого использования
export { iconMap };
export type { LucideIcon }; 