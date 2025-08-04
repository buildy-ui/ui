import { forwardRef } from "react";
import { 
  LifeBuoy,
  MessageSquare
} from "lucide-react";
import {
  Stack,
  Group,
  Title,
  Text,
  Badge,
  Button,
  Card,
  Icon,
  Box,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent
} from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";

const currentTheme = skyOSTheme;

const theme = {
  theme: currentTheme,
  themeRounded: currentTheme.rounded,
  themeButtonSize: currentTheme.buttonSize
}
import { 
  LayoutBlock,
  createLayoutContentHook
} from "@ui8kit/core";

// FAQ interfaces
interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  lucideIcon?: any;
  priority?: "high" | "medium" | "low";
}

interface FAQCategory {
  id: string;
  name: string;
  lucideIcon?: any;
  color?: string;
}

// Grid FAQ data interface
interface GridFAQData {
  badge?: string;
  title: string;
  description: string;
  buttonText?: string;
  categories?: FAQCategory[];
  faqs: FAQItem[];
  contactInfo?: {
    title: string;
    description: string;
    email?: string;
    phone?: string;
  };
}

interface GridFAQProps {
  content: GridFAQData;
  variant?: "cards" | "accordion" | "categories" | "compact" | "support";
  cols?: "1" | "2" | "3" | "4" | "1-2" | "1-2-3" | "1-2-4";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

// Custom content hooks for different grid FAQ variants
const gridFAQContentHooks = {
  // FAQ cards grid
  cards: createLayoutContentHook({
    item: (faq: FAQItem) => (
      <Card key={faq.id} p="lg" rounded={theme?.themeRounded.default} shadow="sm" bg="card">
        <Stack gap="md" align="start">
          <Group gap="md" align="center">
            {faq.lucideIcon && (
              <Box 
                p="sm" 
                bg="primary" 
                rounded={theme?.themeRounded.default}
                className="flex-shrink-0"
                data-class="faq-icon"
              >
                <Icon
                  component="span"
                  size="sm"
                  lucideIcon={faq.lucideIcon}
                  c="primary-foreground"
                />
              </Box>
            )}
            {faq.category && (
              <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}> 
                {faq.category}
              </Badge>
            )}
          </Group>

          <Stack gap="md">
            <Title order={3} size="lg" fw="semibold">
              {faq.question}
            </Title>
            
            <Text c="secondary-foreground" className="line-clamp-3">
              {faq.answer}
            </Text>
          </Stack>

          <Button rounded={theme?.themeRounded.default} variant="ghost" size="sm" className="w-full mt-auto">
            Read Full Answer
          </Button>
        </Stack>
      </Card>
    )
  }),

  // Accordion style FAQ
  accordion: createLayoutContentHook({
    item: (faq: FAQItem, index: number) => (
      <Card key={faq.id} rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="overflow-hidden">
        <Accordion type="single" collapsible>
          <AccordionItem value={`faq-${index}`} className="border-none">
            <AccordionTrigger className="px-lg py-md hover:no-underline">
              <Group gap="md" align="center" className="flex-1 text-left">
                {faq.lucideIcon && (
                  <Icon
                    component="span"
                    size="sm"
                    lucideIcon={faq.lucideIcon}
                    c="primary"
                    className="flex-shrink-0"
                  />
                )}
                <Text size="md" fw="medium">
                  {faq.question}
                </Text>
              </Group>
            </AccordionTrigger>
            <AccordionContent className="px-lg pb-md">
              <Text c="secondary-foreground">
                {faq.answer}
              </Text>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    )
  }),

  // Categorized FAQ
  categories: createLayoutContentHook({
    item: (faq: FAQItem) => (
      <Card key={faq.id} p="md" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="h-full">
        <Stack gap="md" align="start" className="h-full">
          <Group gap="xs" align="center">
            {faq.lucideIcon && (
              <Icon
                component="span"
                size="xs"
                lucideIcon={faq.lucideIcon}
                c="primary"
              />
            )}
            {faq.category && (
              <Badge variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                {faq.category}
              </Badge>
            )}
            {faq.priority === "high" && (
              <Badge variant="destructive" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                Priority
              </Badge>
            )}
          </Group>

          <Title order={4} size="md" fw="semibold" className="line-clamp-2">
            {faq.question}
          </Title>
          
          <Text size="xs" c="secondary-foreground" className="line-clamp-2 flex-1">
            {faq.answer}
          </Text>

          <Button rounded={theme?.themeRounded.default} variant="ghost" size="xs" className="w-full">
            <Icon lucideIcon={MessageSquare} />
            View Details
          </Button>
        </Stack>
      </Card>
    )
  }),

  // Compact FAQ list
  compact: createLayoutContentHook({
    item: (faq: FAQItem) => (
      <Card key={faq.id} p="md" rounded={theme?.themeRounded.default} shadow="sm" bg="card">
        <Group gap="md" align="start">
          {faq.lucideIcon && (
            <Icon
              component="span"
              size="sm"
              lucideIcon={faq.lucideIcon}
              c="primary"
              className="mt-1 flex-shrink-0"
            />
          )}
          
          <Stack gap="xs" className="flex-1">
            <Title order={4} size="sm" fw="semibold">
              {faq.question}
            </Title>
            
            <Text size="xs" c="secondary-foreground">
              {faq.answer}
            </Text>

            {faq.category && (
              <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="w-fit">
                {faq.category}
              </Badge>
            )}
          </Stack>
        </Group>
      </Card>
    )
  }),

  // Support center FAQ
  support: createLayoutContentHook({
    item: (faq: FAQItem) => (
      <Card key={faq.id} p="lg" rounded={theme?.themeRounded.default} shadow="md" bg="card" className="h-full hover:shadow-lg transition-shadow">
        <Stack gap="md" align="center" ta="center" className="h-full">
          {faq.lucideIcon && (
            <Box 
              p="md" 
              bg="primary" 
              rounded="full" 
              data-class="support-icon"
            >
              <Icon
                component="span"
                size="lg"
                lucideIcon={faq.lucideIcon}
                c="primary-foreground"
              />
            </Box>
          )}

          <Stack gap="md" align="center" ta="center" className="flex-1">
            {faq.category && (
              <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                {faq.category}
              </Badge>
            )}
            
            <Title order={3} size="lg" fw="semibold" ta="center">
              {faq.question}
            </Title>
            
            <Text c="secondary-foreground" ta="center" className="line-clamp-3">
              {faq.answer}
            </Text>
          </Stack>

          <Group gap="md" className="w-full">
            <Button rounded={theme?.themeRounded.default} variant="outline" size="sm" className="flex-1">
              Learn More
            </Button>
            <Button rounded={theme?.themeRounded.default} variant="ghost" size="sm">
              <Icon lucideIcon={LifeBuoy} />
            </Button>
          </Group>
        </Stack>
      </Card>
    )
  })
};

export const GridFAQ = forwardRef<HTMLElement, GridFAQProps>(
  ({ 
    content, 
    variant = "cards",
    cols,
    gap,
    useContainer = true,
    py = "lg",
    className,
    ...props 
  }, ref) => {
    
    // Determine layout configuration based on variant
    const getVariantConfig = () => {
      switch (variant) {
        case "cards":
          return {
            contentHooks: gridFAQContentHooks.cards,
            cols: "1-2-3" as const,
            gap: "lg" as const
          };
        
        case "accordion":
          return {
            contentHooks: gridFAQContentHooks.accordion,
            cols: "1" as const,
            gap: "lg" as const
          };
        
        case "categories":
          return {
            contentHooks: gridFAQContentHooks.categories,
            cols: "1-2-4" as const,
            gap: "lg" as const
          };
        
        case "compact":
          return {
            contentHooks: gridFAQContentHooks.compact,
            cols: "1" as const,
            gap: "lg" as const
          };
        
        case "support":
          return {
            contentHooks: gridFAQContentHooks.support,
            cols: "1-2-3" as const,
            gap: "lg" as const
          };
        
        default:
          return {
            contentHooks: gridFAQContentHooks.cards,
            cols: "1-2-3" as const,
            gap: "lg" as const
          };
      }
    };

    const config = getVariantConfig();

    // Transform faqs to items for LayoutBlock
    const layoutContent = {
      ...content,
      items: content.faqs
    };

    return (
      <LayoutBlock
        ref={ref}
        layout="grid"
        useContainer={useContainer}
        py={py}
        cols={cols || config.cols}
        gap={gap || config.gap}
        content={layoutContent as any}
        contentHooks={config.contentHooks}
        className={className}
        {...props}
      />
    );
  }
);

GridFAQ.displayName = "GridFAQ";

// Export template configurations
export const gridFAQTemplates = {
  cards: {
    id: "gridFAQCards",
    name: "FAQ Cards Grid",
    description: "Grid layout with FAQ cards",
    component: GridFAQ,
    defaultProps: { variant: "cards" as const, cols: "1-2-3" as const }
  },
  
  accordion: {
    id: "gridFAQAccordion",
    name: "FAQ Accordion List",
    description: "Single column accordion FAQ list",
    component: GridFAQ,
    defaultProps: { variant: "accordion" as const, cols: "1" as const }
  },

  categories: {
    id: "gridFAQCategories",
    name: "Categorized FAQ Grid",
    description: "Compact grid with category-based FAQ items",
    component: GridFAQ,
    defaultProps: { variant: "categories" as const, cols: "1-2-4" as const }
  },

  compact: {
    id: "gridFAQCompact",
    name: "Compact FAQ List",
    description: "Minimal single-column FAQ list",
    component: GridFAQ,
    defaultProps: { variant: "compact" as const, cols: "1" as const }
  },

  support: {
    id: "gridFAQSupport",
    name: "Support Center FAQ",
    description: "Support-focused FAQ with prominent icons",
    component: GridFAQ,
    defaultProps: { variant: "support" as const, cols: "1-2-3" as const }
  }
};