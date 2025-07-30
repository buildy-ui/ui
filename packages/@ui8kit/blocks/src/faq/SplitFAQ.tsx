import { forwardRef } from "react";
import { 
  HelpCircle,
  MessageSquare,
  Shield,
  Zap,
  Users,
  Settings,
  FileText,
  CreditCard,
  Smartphone,
  Globe,
  Lock,
  LifeBuoy,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  ArrowRight,
  Search
} from "lucide-react";
import {
  Block,
  Stack,
  Grid,
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

export const currentTheme = skyOSTheme;

export const theme = {
  theme: currentTheme,
  themeRounded: currentTheme.rounded,
  themeButtonSize: currentTheme.buttonSize
}
import { 
  SplitBlock, 
  createContentHook, 
  defaultContentHooks, 
  advancedContentHooks,
  type ContentHooks 
} from "@ui8kit/core/factory/SplitBlock";

// FAQ interfaces (reuse from GridFAQ)
export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  lucideIcon?: any;
  priority?: "high" | "medium" | "low";
}

export interface FAQCategory {
  id: string;
  name: string;
  lucideIcon?: any;
  color?: string;
}

// Split FAQ data interface
export interface SplitFAQData {
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
    hours?: string;
  };
  searchPlaceholder?: string;
  stats?: {
    totalQuestions: string;
    avgResponseTime: string;
    satisfactionRate: string;
  };
}

export interface SplitFAQProps {
  content: SplitFAQData;
  variant?: "contact" | "search" | "categories" | "support" | "accordion";
  leftMedia?: boolean;
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Custom content hooks for different split FAQ variants
const splitFAQContentHooks = {
  // FAQ with contact information
  contact: createContentHook({
    content: (content: SplitFAQData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          {content.badge && (
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge}
            </Badge>
          )}

          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {/* Contact Information */}
        {content.contactInfo && (
          <Card p="lg" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="w-full">
            <Stack gap="md">
              <Title order={3} size="lg" fw="semibold">
                {content.contactInfo.title}
              </Title>
              
              <Text c="secondary-foreground">
                {content.contactInfo.description}
              </Text>

              <Stack gap="md">
                {content.contactInfo.email && (
                  <Group gap="md" align="center">
                    <Icon lucideIcon={Mail} c="primary" />
                    <Text size="sm">{content.contactInfo.email}</Text>
                  </Group>
                )}
                
                {content.contactInfo.phone && (
                  <Group gap="md" align="center">
                    <Icon lucideIcon={Phone} c="primary" />
                    <Text size="sm">{content.contactInfo.phone}</Text>
                  </Group>
                )}
                
                {content.contactInfo.hours && (
                  <Group gap="md" align="center">
                    <Icon lucideIcon={Clock} c="primary" />
                    <Text size="sm">{content.contactInfo.hours}</Text>
                  </Group>
                )}
              </Stack>

              {content.buttonText && (
                <Button rounded={theme?.themeRounded.default} size="sm" className="w-full">
                  {content.buttonText}
                </Button>
              )}
            </Stack>
          </Card>
        )}

        {/* Quick FAQ List */}
        <Stack gap="md" className="w-full">
          <Title order={4} size="md" fw="semibold">
            Popular Questions
          </Title>
          {content.faqs.slice(0, 3).map((faq) => (
            <Group key={faq.id} gap="md" align="start" className="p-sm hover:bg-muted rounded-md cursor-pointer">
              <Icon
                component="span"
                size="xs"
                lucideIcon={faq.lucideIcon || HelpCircle}
                c="primary"
                className="mt-1 flex-shrink-0"
              />
              <Stack gap="xs">
                <Text size="sm" fw="medium">
                  {faq.question}
                </Text>
                <Text size="xs" c="secondary-foreground" className="line-clamp-2">
                  {faq.answer}
                </Text>
              </Stack>
            </Group>
          ))}
        </Stack>
      </Stack>
    )
  }),

  // FAQ with search functionality
  search: createContentHook({
    content: (content: SplitFAQData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          {content.badge && (
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge}
            </Badge>
          )}

          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {/* Search Box */}
        <Card p="md" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="w-full">
          <Group gap="md">
            <Text className="flex-1" >Search FAQ... <Icon lucideIcon={Search} /></Text>
            <Button rounded={theme?.themeRounded.default} size="sm">
              Search
            </Button>
          </Group>
        </Card>

        {/* Categories */}
        {content.categories && (
          <Stack gap="md" className="w-full">
            <Title order={4} size="md" fw="semibold">
              Browse by Category
            </Title>
            <Grid cols="2" gap="md">
              {content.categories.slice(0, 4).map((category) => (
                <Button rounded={theme?.themeRounded.default}
                  key={category.id}
                  variant="outline"
                  size="sm"
                  leftSection={category.lucideIcon ? (
                    <Icon lucideIcon={category.lucideIcon} />
                  ) : undefined}
                  className="justify-start"
                >
                  {category.name}
                </Button>
              ))}
            </Grid>
          </Stack>
        )}

        {/* Stats */}
        {content.stats && (
          <Grid cols="1" gap="md" className="w-full">
            <Group gap="md" align="center">
              <Icon lucideIcon={FileText} c="primary" />
              <Text size="sm">{content.stats.totalQuestions} Questions</Text>
            </Group>
            <Group gap="md" align="center">
              <Icon lucideIcon={Clock} c="primary" />
              <Text size="sm">{content.stats.avgResponseTime} Avg Response</Text>
            </Group>
            <Group gap="md" align="center">
              <Icon lucideIcon={CheckCircle} c="primary" />
              <Text size="sm">{content.stats.satisfactionRate} Satisfaction</Text>
            </Group>
          </Grid>
        )}
      </Stack>
    )
  }),

  // FAQ with category navigation
  categories: createContentHook({
    content: (content: SplitFAQData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          {content.badge && (
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge}
            </Badge>
          )}

          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {/* Category Cards */}
        {content.categories && (
          <Stack gap="md" className="w-full">
            <Title order={4} size="md" fw="semibold">
              Help Categories
            </Title>
            <Stack gap="md">
              {content.categories.map((category) => (
                <Card key={category.id} p="md" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="hover:shadow-md transition-shadow cursor-pointer">
                  <Group gap="md" align="center">
                    {category.lucideIcon && (
                      <Box p="sm" bg="primary" rounded={theme?.themeRounded.default} data-class="category-icon">
                        <Icon
                          component="span"
                          size="sm"
                          lucideIcon={category.lucideIcon}
                          c="primary-foreground"
                        />
                      </Box>
                    )}
                    
                    <Stack gap="xs" className="flex-1">
                      <Text size="md" fw="semibold">
                        {category.name}
                      </Text>
                      <Text size="xs" c="secondary-foreground">
                        {content.faqs.filter(faq => faq.category === category.name).length} questions
                      </Text>
                    </Stack>

                    <Icon lucideIcon={ArrowRight} c="secondary-foreground" />
                  </Group>
                </Card>
              ))}
            </Stack>
          </Stack>
        )}

        {content.buttonText && (
          <Button rounded={theme?.themeRounded.default} size="lg" className="w-full">
            {content.buttonText}
          </Button>
        )}
      </Stack>
    )
  }),

  // Support center FAQ
  support: createContentHook({
    content: (content: SplitFAQData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          {content.badge && (
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge}
            </Badge>
          )}

          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {/* Support Options */}
        <Stack gap="md" className="w-full">
          <Title order={4} size="md" fw="semibold">
            Get Help
          </Title>
          
          <Grid cols="1" gap="md">
            <Button rounded={theme?.themeRounded.default} variant="outline" size="lg" leftSection={
              <Icon lucideIcon={MessageSquare} />
            }>
              Live Chat Support
            </Button>
            
            <Button rounded={theme?.themeRounded.default} variant="outline" size="lg" leftSection={
              <Icon lucideIcon={Mail} />
            }>
              Email Support
            </Button>
            
            <Button rounded={theme?.themeRounded.default} variant="outline" size="lg" leftSection={
              <Icon lucideIcon={Phone} />
            }>
              Phone Support
            </Button>
          </Grid>
        </Stack>

        {/* Support Stats */}
        {content.stats && (
          <Card p="lg" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="w-full">
            <Stack gap="md">
              <Title order={4} size="md" fw="semibold">
                Support Statistics
              </Title>
              
              <Grid cols="1" gap="md">
                <Group gap="md" align="center" justify="between">
                  <Text c="secondary-foreground">Response Time</Text>
                  <Text size="sm" fw="semibold">{content.stats.avgResponseTime}</Text>
                </Group>
                
                <Group gap="md" align="center" justify="between">
                  <Text c="secondary-foreground">Satisfaction Rate</Text>
                  <Text size="sm" fw="semibold">{content.stats.satisfactionRate}</Text>
                </Group>
                
                <Group gap="md" align="center" justify="between">
                  <Text c="secondary-foreground">Total Questions</Text>
                  <Text size="sm" fw="semibold">{content.stats.totalQuestions}</Text>
                </Group>
              </Grid>
            </Stack>
          </Card>
        )}
      </Stack>
    )
  }),

  // Accordion FAQ
  accordion: createContentHook({
    content: (content: SplitFAQData) => (
      <Stack gap="xl" align="start">
        <Stack gap="md" align="start">
          {content.badge && (
            <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              {content.badge}
            </Badge>
          )}

          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>

          <Text c="secondary-foreground">
            {content.description}
          </Text>
        </Stack>

        {/* FAQ Accordion */}
        <Stack gap="md" className="w-full">
          <Title order={4} size="md" fw="semibold">
            Frequently Asked Questions
          </Title>
          
          <Accordion type="single" collapsible className="w-full">
            {content.faqs.slice(0, 5).map((faq, index) => (
              <AccordionItem key={faq.id} value={`faq-${index}`}>
                <AccordionTrigger>
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
                <AccordionContent>
                  <Text c="secondary-foreground">
                    {faq.answer}
                  </Text>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Stack>

        {content.buttonText && (
          <Button rounded={theme?.themeRounded.default} size="lg" variant="outline" className="w-full">
            {content.buttonText}
          </Button>
        )}
      </Stack>
    )
  })
};

export const SplitFAQ = forwardRef<HTMLElement, SplitFAQProps>(
  ({ 
    content, 
    variant = "contact",
    leftMedia = false,
    useContainer = true,
    py = "xl",
    gap = "md",
    className,
    ...props 
  }, ref) => {
    
    // Create media section based on variant and content
    const createMediaSection = () => {
      // Default gradient based on variant
      const gradientMap = {
        contact: "from-primary/5 to-secondary/10",
        search: "from-primary/5 to-secondary/10",
        categories: "from-primary/5 to-secondary/10",
        support: "from-primary/5 to-secondary/10",
        accordion: "from-primary/5 to-secondary/10"
      };

      // Icon map for decorative elements
      const iconMap = {
        contact: MessageSquare,
        search: Search,
        categories: FileText,
        support: LifeBuoy,
        accordion: HelpCircle
      };

      return (
        <Block 
          className={`h-full bg-gradient-to-br ${gradientMap[variant]} relative overflow-hidden`}
          data-class="faq-gradient-background"
        >
          <Box className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
          
          {/* Decorative Elements */}
          <Box className="absolute top-10 right-10 w-24 h-24 bg-primary/20 rounded-full blur-xl" />
          <Box className="absolute bottom-10 left-10 w-32 h-32 bg-secondary/20 rounded-full blur-2xl" />
          
          {/* Central Icon */}
          <Box className="absolute inset-0 flex items-center justify-center">
            <Box 
              p="2xl" 
              bg="primary/10" 
              rounded="full" 
              data-class="faq-central-icon"
            >
              <Icon
                component="span"
                size="2xl"
                lucideIcon={iconMap[variant]}
                c="primary"
                className="opacity-30"
              />
            </Box>
          </Box>
        </Block>
      );
    };

    // Choose content hooks based on variant
    const contentHooks = splitFAQContentHooks[variant] || splitFAQContentHooks.contact;

    return (
      <SplitBlock
        ref={ref}
        mediaSection={createMediaSection()}
        content={content}
        contentHooks={contentHooks}
        leftMedia={leftMedia}
        splitSection={!useContainer}
        py={py}
        gap={gap}
        className={className}
        {...props}
      />
    );
  }
);

SplitFAQ.displayName = "SplitFAQ";

// Export template configurations
export const splitFAQTemplates = {
  contact: {
    id: "splitFAQContact",
    name: "FAQ with Contact Info",
    description: "Split layout with FAQ content and contact information",
    component: SplitFAQ,
    defaultProps: { variant: "contact" as const }
  },
  
  search: {
    id: "splitFAQSearch",
    name: "FAQ with Search",
    description: "Split layout with search functionality and categories",
    component: SplitFAQ,
    defaultProps: { variant: "search" as const }
  },

  categories: {
    id: "splitFAQCategories",
    name: "FAQ with Categories",
    description: "Split layout with category navigation",
    component: SplitFAQ,
    defaultProps: { variant: "categories" as const }
  },

  support: {
    id: "splitFAQSupport",
    name: "FAQ Support Center",
    description: "Support-focused FAQ with contact options",
    component: SplitFAQ,
    defaultProps: { variant: "support" as const }
  },

  accordion: {
    id: "splitFAQAccordion",
    name: "FAQ with Accordion",
    description: "Split layout with accordion-style FAQ list",
    component: SplitFAQ,
    defaultProps: { variant: "accordion" as const }
  }
};