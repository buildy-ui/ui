import { forwardRef } from "react";
import { 
  Building2,
  Mail,
  Phone,
  MapPin,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Github,
  ArrowRight,
  Send,
  Award,
  ExternalLink
} from "lucide-react";
import {
  Stack,
  Group,
  Title,
  Text,
  Button,
  Icon,
  Box,
  Card,
  type VariantSpacingProps
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

// Reuse footer interfaces from SplitFooter
interface FooterLink {
  name: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterContact {
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
}

interface FooterSocial {
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  facebook?: string;
  youtube?: string;
  github?: string;
}

export interface GridFooterData {
  brand: string;
  tagline?: string;
  description?: string;
  copyright: string;
  sections: FooterSection[];
  contact?: FooterContact;
  social?: FooterSocial;
  newsletter?: {
    title?: string;
    description?: string;
    placeholder?: string;
    buttonText?: string;
  };
  features?: {
    title?: string;
    items?: string[];
  };
}

interface GridFooterProps {
  content: GridFooterData;
  variant?: "columns" | "mega" | "compact" | "newsletter" | "sitemap";
  useContainer?: boolean;
  py?: VariantSpacingProps["py"];
  className?: string;
}

// Render social links component (reused)
const RenderSocialLinks = ({ social, size = "md" }: { social?: FooterSocial; size?: "sm" | "md" | "lg" }) => {
  if (!social) return null;
  
  const socialLinks = [
    { key: 'twitter', icon: Twitter, url: social.twitter },
    { key: 'instagram', icon: Instagram, url: social.instagram },
    { key: 'linkedin', icon: Linkedin, url: social.linkedin },
    { key: 'facebook', icon: Facebook, url: social.facebook },
    { key: 'youtube', icon: Youtube, url: social.youtube },
    { key: 'github', icon: Github, url: social.github }
  ].filter(link => link.url);

  return (
    <Group gap="md" align="center">
      {socialLinks.map(({ key, icon: LucideIcon, url: _url }) => (
        <Icon 
          key={key}
          rel="noopener noreferrer"
          size={size} 
          lucideIcon={LucideIcon} 
          c="secondary-foreground"
          className="hover:text-primary transition-colors cursor-pointer"
        />
      ))}
    </Group>
  );
};

// Custom content hooks for different grid footer variants
const gridFooterContentHooks = {
  // 1. Classic Columns Layout
  columns: createLayoutContentHook({
    header: (content: GridFooterData) => (
      <Stack gap="lg" align="start" className="col-span-full w-full">
        <Group gap="md" align="center">
          <Icon size="xl" lucideIcon={Building2} c="primary" />
          <Title order={2} size="2xl" fw="bold">
            {content.brand}
          </Title>
        </Group>
        
        {content.description && (
          <Text c="secondary-foreground">
            {content.description}
          </Text>
        )}

        <RenderSocialLinks social={content.social} size="md" />

        {/* Bottom Section */}
        <Box className="pt-lg border-t border-border w-full mt-lg">
          <Group gap="md" align="center" justify="between" className="w-full">
            <Text c="secondary-foreground">
              {content.copyright}
            </Text>
            
            <Group gap="md">
              <Text
                size="sm"
                c="secondary-foreground"
                className="hover:text-primary transition-colors"
              >
                Privacy Policy
              </Text>
              <Text
                size="sm"
                c="secondary-foreground"
                className="hover:text-primary transition-colors"
              >
                Terms of Service
              </Text>
            </Group>
          </Group>
        </Box>
      </Stack>
    ),
    
    item: (section: FooterSection) => (
      <Stack gap="md" className="w-full">
        <Title order={4} size="md" fw="semibold">
          {section.title}
        </Title>
        
        <Stack gap="md" className="w-full">
          {section.links.map((link) => (
            <Text
              key={link.name}
              size="sm"
              c="secondary-foreground"
              className="hover:text-primary transition-colors w-full"
            >
              {link.name}
            </Text>
          ))}
        </Stack>
      </Stack>
    )
  }),

  // 2. Mega Footer Layout
  mega: createLayoutContentHook({
    header: (content: GridFooterData) => (
      <Stack gap="xl" align="start" className="col-span-full w-full">
        {/* Top Section */}
        <Group gap="md" align="center" justify="between" className="w-full">
          <Group gap="md" align="center">
            <Icon size="2xl" lucideIcon={Building2} c="primary" />
            <Stack gap="xs">
              <Title order={2} size="2xl" fw="bold">
                {content.brand}
              </Title>
              {content.tagline && (
                <Text size="sm" c="primary" fw="medium">
                  {content.tagline}
                </Text>
              )}
            </Stack>
          </Group>
          
          {/* Newsletter Signup */}
          {content.newsletter && (
            <Card p="md" rounded={theme?.themeRounded.default} shadow="sm" className="bg-card border w-full">
              <Stack gap="md">
                <Text size="sm" fw="semibold">
                  {content.newsletter.title || "Newsletter"}
                </Text>
                <Group gap="md">
                  <Text
                    size="sm"
                    className="flex-1"
                  >{content.newsletter.placeholder || "Email"}</Text>
                  <Button rounded={theme?.themeRounded.default} size="sm" variant="default">
                    <Icon c="primary-foreground" lucideIcon={Send} />
                  </Button>
                </Group>
              </Stack>
            </Card>
          )}
        </Group>

        {/* Description and Features */}
        <Group gap="xl" align="start" className="w-full">
          <Stack gap="md" className="flex-1">
            {content.description && (
              <Text size="md" c="secondary-foreground">
                {content.description}
              </Text>
            )}
            
            {content.features && (
              <Stack gap="md">
                <Text size="sm" fw="semibold">
                  {content.features.title || "Features"}
                </Text>
                <Group gap="md" className="flex-wrap">
                  {content.features.items?.slice(0, 4).map((feature, index) => (
                    <Group key={index} gap="xs" align="center">
                      <Icon lucideIcon={Award} c="primary" />
                      <Text c="secondary-foreground">
                        {feature}
                      </Text>
                    </Group>
                  ))}
                </Group>
              </Stack>
            )}
          </Stack>

          {/* Contact Info */}
          {content.contact && (
            <Stack gap="md" className="flex-shrink-0">
              <Text size="sm" fw="semibold">
                Contact Info
              </Text>
              
              {content.contact.email && (
                <Group gap="xs" align="center">
                  <Icon lucideIcon={Mail} c="secondary-foreground" />
                  <Text
                    size="sm"
                    c="secondary-foreground"
                    className="hover:text-primary transition-colors"
                  >
                    {content.contact.email}
                  </Text>
                </Group>
              )}
              
              {content.contact.phone && (
                <Group gap="xs" align="center">
                  <Icon lucideIcon={Phone} c="secondary-foreground" />
                  <Text
                    size="sm"
                    c="secondary-foreground"
                    className="hover:text-primary transition-colors"
                  >
                    {content.contact.phone}
                  </Text>
                </Group>
              )}
              
              {content.contact.address && (
                <Group gap="xs" align="start">
                  <Icon lucideIcon={MapPin} c="secondary-foreground" className="mt-0.5" />
                  <Text c="secondary-foreground">
                    {content.contact.address}
                  </Text>
                </Group>
              )}
            </Stack>
          )}
        </Group>

        {/* Copyright */}
        <Box className="pt-lg border-t border-border w-full">
          <Group gap="md" align="center" justify="between" className="w-full">
            <Text c="secondary-foreground">
              {content.copyright}
            </Text>
            <RenderSocialLinks social={content.social} size="sm" />
          </Group>
        </Box>
      </Stack>
    ),
    
    item: (section: FooterSection) => (
      <Stack gap="md" className="w-full">
        <Title order={4} size="md" fw="semibold">
          {section.title}
        </Title>
        
        <Stack gap="md" className="w-full">
          {section.links.map((link) => (
            <Group key={link.name} gap="xs" align="center" className="w-full">
              <Text
                size="sm"
                c="secondary-foreground"
                className="hover:text-primary transition-colors flex-1"
              >
                {link.name}
              </Text>
              <Icon lucideIcon={ExternalLink} c="secondary-foreground" className="opacity-50" />
            </Group>
          ))}
        </Stack>
      </Stack>
    )
  }),

  // 3. Compact Layout
  compact: createLayoutContentHook({
    header: (content: GridFooterData) => (
      <Stack gap="md" align="center" ta="center" className="col-span-full w-full">
        <Group gap="md" align="center">
          <Icon size="lg" lucideIcon={Building2} c="primary" />
          <Title order={3} size="lg" fw="bold">
            {content.brand}
          </Title>
        </Group>
        
        {content.tagline && (
          <Text c="secondary-foreground">
            {content.tagline}
          </Text>
        )}

        <RenderSocialLinks social={content.social} size="sm" />

        {/* Copyright */}
        <Text size="xs" c="secondary-foreground" className="pt-md border-t border-border">
          {content.copyright}
        </Text>
      </Stack>
    ),
    
    item: (section: FooterSection) => (
      <Stack gap="md" align="center" ta="center" className="w-full">
        <Text size="sm" fw="semibold">
          {section.title}
        </Text>
        
        <Group gap="md" align="center" className="flex-wrap justify-center w-full">
          {section.links.slice(0, 4).map((link) => (
            <Text
              key={link.name}
              size="xs"
              c="secondary-foreground"
              className="hover:text-primary transition-colors"
            >
              {link.name}
            </Text>
          ))}
        </Group>
      </Stack>
    )
  }),

  // 4. Newsletter Focused Layout
  newsletter: createLayoutContentHook({
    header: (content: GridFooterData) => (
      <Stack gap="xl" align="center" ta="center" className="col-span-full w-full">
        {/* Newsletter Section */}
        <Card p="xl" rounded={theme?.themeRounded.default} shadow="lg" className="bg-primary/5 border-primary/20 w-full">
          <Stack gap="lg" align="center">
            <Group gap="md" align="center">
              <Icon size="xl" lucideIcon={Mail} c="primary" />
              <Title order={2} size="xl" fw="bold">
                {content.newsletter?.title || "Stay Updated"}
              </Title>
            </Group>
            
            <Text c="secondary-foreground" ta="center">
              {content.newsletter?.description || "Get the latest updates and news delivered to your inbox."}
            </Text>
            
            <Stack gap="md" className="w-full">
              <Text
                className="w-full"
              >{content.newsletter?.placeholder || "Enter your email"}</Text>
              <Button rounded={theme?.themeRounded.default} size="lg" variant="default" className="w-full">
                <Icon c="primary-foreground" lucideIcon={Send} />
                {content.newsletter?.buttonText || "Subscribe"}
              </Button>
            </Stack>
            
            <Text size="xs" c="secondary-foreground" ta="center">
              No spam, unsubscribe at any time
            </Text>
          </Stack>
        </Card>

        {/* Brand Section */}
        <Stack gap="md" align="center">
          <Group gap="md" align="center">
            <Icon size="lg" lucideIcon={Building2} c="primary" />
            <Title order={3} size="lg" fw="bold">
              {content.brand}
            </Title>
          </Group>
          
          {content.description && (
            <Text c="secondary-foreground" ta="center">
              {content.description}
            </Text>
          )}
        </Stack>

        {/* Social & Copyright */}
        <Stack gap="md" align="center" className="pt-lg border-t border-border w-full">
          <RenderSocialLinks social={content.social} size="md" />
          <Text c="secondary-foreground">
            {content.copyright}
          </Text>
        </Stack>
      </Stack>
    ),
    
    item: (section: FooterSection) => (
      <Stack gap="md" align="center" ta="center" className="w-full">
        <Text size="sm" fw="semibold">
          {section.title}
        </Text>
        
        <Stack gap="xs" align="center" className="w-full">
          {section.links.slice(0, 3).map((link) => (
            <Text
              key={link.name}
              size="sm"
              c="secondary-foreground"
              className="hover:text-primary transition-colors w-full"
            >
              {link.name}
            </Text>
          ))}
        </Stack>
      </Stack>
    )
  }),

  // 5. Sitemap Layout
  sitemap: createLayoutContentHook({
    header: (content: GridFooterData) => (
      <Stack gap="lg" align="start" className="col-span-full w-full">
        <Group gap="md" align="center" justify="between" className="w-full">
          <Stack gap="md">
            <Group gap="md" align="center">
              <Icon size="xl" lucideIcon={Building2} c="primary" />
              <Title order={2} size="xl" fw="bold">
                {content.brand}
              </Title>
            </Group>
            
            {content.description && (
              <Text c="secondary-foreground">
                {content.description}
              </Text>
            )}
          </Stack>
          
          <Button rounded={theme?.themeRounded.default} size="sm" variant="outline">
            <Icon lucideIcon={ArrowRight} />
            View Sitemap
          </Button>
        </Group>

        {/* Stats */}
        <Group gap="xl" align="center" className="w-full">
          <Stack gap="xs" align="center">
            <Text size="xl" fw="bold" c="primary">
              500+
            </Text>
            <Text size="xs" c="secondary-foreground" className="text-center">
              Pages
            </Text>
          </Stack>
          
          <Stack gap="xs" align="center">
            <Text size="xl" fw="bold" c="primary">
              50+
            </Text>
            <Text size="xs" c="secondary-foreground" className="text-center">
              Categories
            </Text>
          </Stack>
          
          <Stack gap="xs" align="center">
            <Text size="xl" fw="bold" c="primary">
              10+
            </Text>
            <Text size="xs" c="secondary-foreground" className="text-center">
              Languages
            </Text>
          </Stack>
        </Group>

        {/* Copyright */}
        <Box className="pt-lg border-t border-border w-full">
          <Group gap="md" align="center" justify="between" className="w-full">
            <Text c="secondary-foreground">
              {content.copyright}
            </Text>
            <RenderSocialLinks social={content.social} size="sm" />
          </Group>
        </Box>
      </Stack>
    ),
    
    item: (section: FooterSection, _index: number) => (
      <Card p="md" rounded={theme?.themeRounded.default} shadow="sm" className="bg-card border h-full w-full">
        <Stack gap="md" className="w-full">
          <Group gap="md" align="center" className="w-full">
            <Box className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center">
              <Text size="xs" fw="bold" c="primary">
                {section.links.length}
              </Text>
            </Box>
            <Title order={4} size="md" fw="semibold" className="flex-1">
              {section.title}
            </Title>
          </Group>
          
          <Stack gap="xs" className="w-full">
            {section.links.map((link) => (
              <Group key={link.name} gap="xs" align="center" className="w-full">
                <Box className="w-1 h-1 bg-secondary-foreground rounded-full" />
                <Text
                  size="sm"
                  c="secondary-foreground"
                  className="hover:text-primary transition-colors flex-1"
                >
                  {link.name}
                </Text>
              </Group>
            ))}
          </Stack>
          
          {section.links.length > 5 && (
            <Text
              size="xs"
              c="primary"
              className="hover:underline w-full"
            >
              View all {section.links.length} items →
            </Text>
          )}
        </Stack>
      </Card>
    )
  })
};

export const GridFooter = forwardRef<HTMLElement, GridFooterProps>(
  ({ 
    content, 
    variant = "columns",
    useContainer = true,
    py = "xl",
    className,
    ...props 
  }, ref) => {
    
    // Choose content hooks based on variant
    const contentHooks = gridFooterContentHooks[variant] || gridFooterContentHooks.columns;

    // Determine layout type and grid configuration based on variant
    const getLayoutConfig = () => {
      switch (variant) {
        case "mega":
          return { layout: "grid" as const, cols: "1-3-6", containerSize: "6xl" as const };
        case "compact":
          return { layout: "grid" as const, cols: "1-2-4", containerSize: "4xl" as const };
        case "newsletter":
          return { layout: "grid" as const, cols: "1-2-4", containerSize: "4xl" as const };
        case "sitemap":
          return { layout: "grid" as const, cols: "1-2-4", containerSize: "6xl" as const };
        default: // columns
          return { layout: "grid" as const, cols: "1-2-6", containerSize: "4xl" as const };
      }
    };

    const layoutConfig = getLayoutConfig();

    return (
      <LayoutBlock
        ref={ref}
        layout={layoutConfig.layout}
        cols={layoutConfig.cols as any}
        useContainer={useContainer}
        containerSize={layoutConfig.containerSize}
        py={py}
        showHeader={true}
        content={{ 
          ...content, 
          items: content.sections.map((section, index) => ({
            ...section,
            id: `section-${index}`,
            description: `${section.links.length} links`
          }))
        }}
        contentHooks={contentHooks}
        className={className}
        {...props}
      />
    );
  }
);

GridFooter.displayName = "GridFooter";

// Export template configurations
export const gridFooterTemplates = {
  columns: {
    id: "gridFooterColumns",
    name: "Classic Columns Footer",
    description: "Traditional footer with brand section and link columns",
    component: GridFooter,
    defaultProps: { variant: "columns" as const }
  },
  
  mega: {
    id: "gridFooterMega",
    name: "Mega Footer",
    description: "Comprehensive footer with all information and features",
    component: GridFooter,
    defaultProps: { variant: "mega" as const }
  },

  compact: {
    id: "gridFooterCompact",
    name: "Compact Footer",
    description: "Minimal footer with essential links and information",
    component: GridFooter,
    defaultProps: { variant: "compact" as const }
  },

  newsletter: {
    id: "gridFooterNewsletter",
    name: "Newsletter Footer",
    description: "Footer with prominent newsletter signup section",
    component: GridFooter,
    defaultProps: { variant: "newsletter" as const }
  },

  sitemap: {
    id: "gridFooterSitemap",
    name: "Sitemap Footer",
    description: "Organized footer showing site structure and navigation",
    component: GridFooter,
    defaultProps: { variant: "sitemap" as const }
  }
};