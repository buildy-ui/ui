import { forwardRef } from "react";
import { 
  ArrowRight, 
  CircleCheck,
  Briefcase,
  MapPin,
  Clock,
  DollarSign
} from "lucide-react";
import {
  Stack,
  Group,
  Title,
  Text,
  Badge,
  Button,
  Card,
  Image,
  Icon,
  Box
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

// Business item interfaces
interface BusinessCard {
  id: string;
  title: string;
  description: string;
  lucideIcon?: any;
  colSpan?: number;
  rowSpan?: number;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: string;
  monthlyPrice?: string;
  yearlyPrice?: string;
  features: string[];
  buttonText: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
  isPopular?: boolean;
}

interface CareerOpening {
  id: string;
  title: string;
  location: string;
  department?: string;
  type?: string;
  salary?: string;
  link?: string;
}

interface Solution {
  id: string;
  title: string;
  description: string;
  lucideIcon?: any;
  image?: {
    src: string;
    alt: string;
  };
  stats?: {
    value: string;
    label: string;
  };
}

// Business data interface
export interface GridBusinessData {
  badge?: string;
  promo?: string;
  title: string;
  description: string;
  buttonText?: string;
  cards?: BusinessCard[];
  plans?: PricingPlan[];
  openings?: CareerOpening[];
  solutions?: Solution[];
  categories?: Array<{
    id: string;
    category: string;
    openings: CareerOpening[];
  }>;
}

interface GridBusinessProps {
  content: GridBusinessData;
  variant?: "cardsGallery" | "solutionsGrid" | "pricing" | "pricingYear" | "career";
  cols?: "1" | "2" | "3" | "4" | "1-2" | "1-2-3" | "1-2-4";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  _showYearlyToggle?: boolean;
  className?: string;
}

// Custom content hooks for different business variants
const gridBusinessContentHooks = {
  // Business cards gallery variant
  cardsGallery: createLayoutContentHook({
    item: (card: BusinessCard, _index: number) => (
      <Card 
        key={card.id} 
        p="lg" 
        rounded={theme?.themeRounded.default}
        shadow="sm" 
        bg="card" 
        className={`hover:shadow-md transition-shadow ${
          card.colSpan === 2 ? "col-span-2" : ""
        } ${card.rowSpan === 2 ? "row-span-2" : ""}`}
      >
        <Stack gap="md" align="start" className="h-full">
          {card.lucideIcon && (
            <Box 
              p="sm" 
              bg="primary" 
              rounded={theme?.themeRounded.default} 
              className="inline-flex"
              data-class="business-icon"
            >
              <Icon
                lucideIcon={card.lucideIcon}
                c="primary-foreground"
              />
            </Box>
          )}

          <Stack gap="md" className="flex-1">
            <Title order={3} size="lg" fw="semibold">
              {card.title}
            </Title>
            
            <Text c="secondary-foreground" className="leading-relaxed">
              {card.description}
            </Text>
          </Stack>
        </Stack>
      </Card>
    )
  }),

  // Solutions grid variant
  solutionsGrid: createLayoutContentHook({
    item: (solution: Solution) => (
      <Card key={solution.id} p="xl" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="hover:shadow-lg transition-all duration-300 group">
        <Stack gap="lg" align="start">
          {solution.lucideIcon && (
            <Box 
              p="lg" 
              bg="primary" 
              rounded={theme?.themeRounded.default} 
              className="inline-flex group-hover:scale-110 transition-transform duration-300"
              data-class="solution-icon"
            >
              <Icon
                size="xl"
                lucideIcon={solution.lucideIcon}
                c="primary-foreground"
              />
            </Box>
          )}

          {solution.image && (
            <Image
              src={solution.image.src}
              alt={solution.image.alt}
              width="100%"
              height="200px"
              fit="cover"
              rounded={theme?.themeRounded.default}
            />
          )}

          <Stack gap="md" className="flex-1">
            <Title order={3} size="xl" fw="bold" className="group-hover:text-primary transition-colors">
              {solution.title}
            </Title>
            
            <Text c="secondary-foreground" className="leading-relaxed">
              {solution.description}
            </Text>
          </Stack>

          {solution.stats && (
            <Box 
              p="md" 
              bg="secondary" 
              rounded={theme?.themeRounded.default} 
              className="w-full"
              data-class="solution-stats"
            >
              <Stack gap="xs" align="center" ta="center">
                <Text size="2xl" fw="bold" c="primary">
                  {solution.stats.value}
                </Text>
                <Text c="secondary-foreground">
                  {solution.stats.label}
                </Text>
              </Stack>
            </Box>
          )}
        </Stack>
      </Card>
    )
  }),

  // Pricing variant
  pricing: createLayoutContentHook({
    item: (plan: PricingPlan) => (
      <Card 
        key={plan.id} 
        p="xl" 
        rounded={theme?.themeRounded.default} 
        shadow={plan.isPopular ? "lg" : "sm"} 
        bg="card" 
        className={`hover:shadow-xl transition-all duration-300 relative ${
          plan.isPopular ? "border-2 border-primary scale-105" : ""
        }`}
      >
        {plan.isPopular && (
          <Badge 
            variant="default" 
            size={theme?.themeButtonSize.badge}
            rounded={theme?.themeRounded.default} 
            className="absolute -top-3 left-1/2 transform -translate-x-1/2"
          >
            Most Popular
          </Badge>
        )}

        <Stack gap="lg" align="start">
          <Stack gap="md">
            <Title order={3} size="xl" fw="bold">
              {plan.name}
            </Title>
            
            <Text c="secondary-foreground">
              {plan.description}
            </Text>
          </Stack>

          <Group gap="xs" align="baseline">
            <Title order={2} size="3xl" fw="bold" c="primary">
              {plan.price}
            </Title>
            <Text c="secondary-foreground">
              /month
            </Text>
          </Group>

          <Stack gap="md" className="w-full">
            {plan.features.map((feature, idx) => (
              <Group key={idx} gap="md" align="start">
                <Icon
                  lucideIcon={CircleCheck}
                  c="primary"
                  className="mt-0.5 flex-shrink-0"
                />
                <Text size="sm" c="foreground">
                  {feature}
                </Text>
              </Group>
            ))}
          </Stack>

          <Button
            variant={plan.buttonVariant || "default"}
            rounded={theme?.themeRounded.default} 
            size={theme?.themeButtonSize.default}
            className="w-full"
            rightSection={
              <Icon lucideIcon={ArrowRight} />
            }
          >
            {plan.buttonText}
          </Button>
        </Stack>
      </Card>
    )
  }),

  // Pricing with year toggle variant
  pricingYear: createLayoutContentHook({
    beforeItems: (_content: GridBusinessData) => (
      <Group gap="md" align="center" justify="center" className="mb-lg">
        <Text c="secondary-foreground">Monthly</Text>
        <Button
            rounded={theme?.themeRounded.default}
            variant="outline"
            size={theme?.themeButtonSize.default}
            className="px-1"
          >
          <Box className="w-6 h-3 bg-primary rounded-full relative">
            <Box className="w-2.5 h-2.5 bg-white rounded-full absolute top-0.5 right-0.5" />
          </Box>
        </Button>
        <Text c="secondary-foreground">Yearly</Text>
        <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>Save 20%</Badge>
      </Group>
    ),
    item: (plan: PricingPlan) => (
      <Card 
        key={plan.id} 
        p="xl" 
        rounded={theme?.themeRounded.default} 
        shadow={plan.isPopular ? "lg" : "sm"} 
        bg="card" 
        className={`hover:shadow-xl transition-all duration-300 relative ${
          plan.isPopular ? "border-2 border-primary scale-105" : ""
        }`}
      >
        {plan.isPopular && (
          <Badge 
            variant="default" 
            size={theme?.themeButtonSize.badge}
            rounded={theme?.themeRounded.badge}
            className="absolute -top-3 left-1/2 transform -translate-x-1/2"
          >
            Most Popular
          </Badge>
        )}

        <Stack gap="lg" align="start">
          <Stack gap="md">
            <Title order={3} size="xl" fw="bold">
              {plan.name}
            </Title>
            
            <Text c="secondary-foreground">
              {plan.description}
            </Text>
          </Stack>

          <Stack gap="xs">
            <Group gap="xs" align="baseline">
              <Title order={2} size="3xl" fw="bold" c="primary">
                {plan.yearlyPrice || plan.price}
              </Title>
              <Text c="secondary-foreground">
                /month
              </Text>
            </Group>
            {plan.monthlyPrice && plan.yearlyPrice && (
              <Text size="xs" c="secondary-foreground" className="line-through">
                {plan.monthlyPrice}/month billed monthly
              </Text>
            )}
          </Stack>

          <Stack gap="md" className="w-full">
            {plan.features.map((feature, idx) => (
              <Group key={idx} gap="md" align="start">
                <Icon
                  lucideIcon={CircleCheck}
                  c="primary"
                  className="mt-0.5 flex-shrink-0"
                />
                <Text size="sm" c="foreground">
                  {feature}
                </Text>
              </Group>
            ))}
          </Stack>

          <Button
            rounded={theme?.themeRounded.default} 
            variant={plan.buttonVariant || "default"}
            size={theme?.themeButtonSize.default}
            className="w-full"
            rightSection={
              <Icon lucideIcon={ArrowRight} />
            }
          >
            {plan.buttonText}
          </Button>
        </Stack>
      </Card>
    )
  }),

  // Career openings variant
  career: createLayoutContentHook({
    item: (opening: CareerOpening) => (
      <Card key={opening.id} p="lg" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="hover:shadow-md transition-shadow">
        <Stack gap="md" align="start">
          <Group gap="md" align="start" justify="between" className="w-full">
            <Stack gap="xs" className="flex-1">
              <Title order={3} size="lg" fw="semibold">
                {opening.title}
              </Title>
              
              <Group gap="lg" align="center" className="flex-wrap">
                {opening.department && (
                  <Group gap="xs" align="center">
                    <Icon lucideIcon={Briefcase} c="secondary-foreground" />
                    <Text c="secondary-foreground">
                      {opening.department}
                    </Text>
                  </Group>
                )}

                <Group gap="xs" align="center">
                  <Icon lucideIcon={MapPin} c="secondary-foreground" />
                  <Text c="secondary-foreground">
                    {opening.location}
                  </Text>
                </Group>

                {opening.type && (
                  <Group gap="xs" align="center">
                    <Icon lucideIcon={Clock} c="secondary-foreground" />
                    <Text c="secondary-foreground">
                      {opening.type}
                    </Text>
                  </Group>
                )}

                {opening.salary && (
                  <Group gap="xs" align="center">
                    <Icon lucideIcon={DollarSign} c="secondary-foreground" />
                    <Text c="secondary-foreground">
                      {opening.salary}
                    </Text>
                  </Group>
                )}
              </Group>
            </Stack>

            <Badge variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              Open
            </Badge>
          </Group>

          <Button
            variant="outline"
            rounded={theme?.themeRounded.default}
            size={theme?.themeButtonSize.default}
            className="w-full"
            rightSection={
              <Icon lucideIcon={ArrowRight} />
            }
          >
            Apply Now
          </Button>
        </Stack>
      </Card>
    )
  })
};

export const GridBusiness = forwardRef<HTMLElement, GridBusinessProps>(
  ({ 
    content, 
    variant = "cardsGallery",
    cols = "1-2-3",
    useContainer = true,
    py = "lg",
    gap = "xl",
    _showYearlyToggle = false,
    className,
    ...props 
  }, ref) => {
    
    // Choose content hooks and layout settings based on variant
    const getVariantConfig = () => {
      switch (variant) {
        case "cardsGallery":
          return {
            contentHooks: gridBusinessContentHooks.cardsGallery,
            cols: "1-2-3" as const,
            gap: "lg" as const,
            items: content.cards || []
          };
        
        case "solutionsGrid":
          return {
            contentHooks: gridBusinessContentHooks.solutionsGrid,
            cols: "1-2-3" as const,
            gap: "xl" as const,
            items: content.solutions || []
          };
        
        case "pricing":
          return {
            contentHooks: gridBusinessContentHooks.pricing,
            cols: "1-2-3" as const,
            gap: "lg" as const,
            items: content.plans || []
          };
        
        case "pricingYear":
          return {
            contentHooks: gridBusinessContentHooks.pricingYear,
            cols: "1-2-3" as const,
            gap: "lg" as const,
            items: content.plans || []
          };
        
        case "career":
          return {
            contentHooks: gridBusinessContentHooks.career,
            cols: "1-2" as const,
            gap: "md" as const,
            items: content.openings || []
          };
        
        default:
          return {
            contentHooks: gridBusinessContentHooks.cardsGallery,
            cols: "1-2-3" as const,
            gap: "lg" as const,
            items: content.cards || []
          };
      }
    };

    const config = getVariantConfig();

    // Prepare content for LayoutBlock
    const layoutContent = {
      ...content,
      items: config.items
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

GridBusiness.displayName = "GridBusiness";

// Export template configurations
export const gridBusinessTemplates = {
  cardsGallery: {
    id: "gridBusinessCardsGallery",
    name: "Business Cards Gallery",
    description: "Grid layout with business feature cards",
    component: GridBusiness,
    defaultProps: { variant: "cardsGallery" as const }
  },
  
  solutionsGrid: {
    id: "gridBusinessSolutionsGrid",
    name: "Business Solutions Grid",
    description: "Grid layout with business solutions and stats",
    component: GridBusiness,
    defaultProps: { variant: "solutionsGrid" as const }
  },

  pricing: {
    id: "gridBusinessPricing",
    name: "Pricing Grid",
    description: "Grid layout with pricing plans",
    component: GridBusiness,
    defaultProps: { variant: "pricing" as const }
  },

  pricingYear: {
    id: "gridBusinessPricingYear",
    name: "Pricing Grid with Yearly Toggle",
    description: "Grid layout with monthly/yearly pricing toggle",
    component: GridBusiness,
    defaultProps: { variant: "pricingYear" as const, _showYearlyToggle: true }
  },

  career: {
    id: "gridBusinessCareer",
    name: "Career Openings Grid",
    description: "Grid layout for job openings",
    component: GridBusiness,
    defaultProps: { variant: "career" as const, cols: "1-2" as const }
  }
};