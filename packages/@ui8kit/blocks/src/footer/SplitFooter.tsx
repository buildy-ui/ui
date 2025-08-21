import { forwardRef } from "react";
import { 
  Building2,
  Mail,
  Phone,
  MapPin,
  Globe,
  Twitter,
  Instagram,
  Linkedin,
  Facebook,
  Youtube,
  Github,
  ArrowRight,
  Send,
  Award,
  Zap
} from "lucide-react";
import {
  Stack,
  Group,
  Title,
  Text,
  Button,
  Icon,
  Box,
  Card
} from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";

const currentTheme = skyOSTheme;

const theme = {
  theme: currentTheme,
  themeRounded: currentTheme.rounded,
  themeButtonSize: currentTheme.buttonSize
}
import { 
  SplitBlock,
  createContentHook
} from "@ui8kit/core";

// Footer interfaces
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

export interface SplitFooterData {
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

interface SplitFooterProps {
  content: SplitFooterData;
  variant?: "brand" | "newsletter" | "contact" | "social" | "minimal";
  mediaPosition?: "left" | "right";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

// Render social links component
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
          component="a" 
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

// Custom content hooks for different split footer variants
const splitFooterContentHooks = {
  // 1. Brand Focus
  brand: createContentHook({
    content: (content: SplitFooterData) => (
      <Stack gap="xl" align="start">
        <Stack gap="lg">
          <Group gap="md" align="center">
            <Icon size="xl" lucideIcon={Building2} c="primary" />
            <Title order={2} size="2xl" fw="bold">
              {content.brand}
            </Title>
          </Group>
          
          {content.tagline && (
            <Text size="lg" c="primary" fw="medium">
              {content.tagline}
            </Text>
          )}
          
          {content.description && (
            <Text c="secondary-foreground" className="max-w-md">
              {content.description}
            </Text>
          )}
        </Stack>

        {/* Features/Benefits */}
        {content.features && (
          <Stack gap="md" className="w-full">
            <Text size="sm" fw="semibold" c="foreground">
              {content.features.title || "Why Choose Us"}
            </Text>
            <Stack gap="md">
              {content.features.items?.slice(0, 4).map((feature, index) => (
                <Group key={index} gap="md" align="center">
                  <Icon lucideIcon={Award} c="primary" />
                  <Text c="secondary-foreground">
                    {feature}
                  </Text>
                </Group>
              ))}
            </Stack>
          </Stack>
        )}

        {/* Social Links */}
        <Stack gap="md" className="w-full">
          <Text size="sm" fw="semibold" c="foreground">
            Follow Us
          </Text>
          <RenderSocialLinks social={content.social} size="sm" />
        </Stack>

        {/* Copyright */}
        <Box className="pt-lg border-t border-border w-full">
          <Text c="secondary-foreground">
            {content.copyright}
          </Text>
        </Box>
      </Stack>
    )
  }),

  // 2. Newsletter Focus
  newsletter: createContentHook({
    content: (content: SplitFooterData) => (
      <Stack gap="xl" align="start">
        <Stack gap="lg">
          <Title order={2} size="sm" fw="bold">
            {content.newsletter?.title || "Stay Updated"}
          </Title>
          
          <Text c="secondary-foreground" className="max-w-md">
            {content.newsletter?.description || "Get the latest updates and news delivered to your inbox."}
          </Text>
        </Stack>

        {/* Newsletter Signup */}
        <Card p="lg" rounded={theme?.themeRounded.default} shadow="sm" className="bg-card border w-full max-w-md">
          <Stack gap="md">
            <Group gap="md" align="center">
              <Icon lucideIcon={Mail} c="primary" />
              <Text size="sm" fw="semibold">
                Newsletter Signup
              </Text>
            </Group>
            
            <Stack gap="md">
              <Text
                size="sm"
                className="w-full"
              >Enter your email</Text>
              <Button rounded={theme?.themeRounded.default} size="sm" variant="default" className="w-full">
                <Icon c="primary-foreground" lucideIcon={Send} />
                {content.newsletter?.buttonText || "Subscribe"}
              </Button>
            </Stack>
            
            <Text size="xs" c="secondary-foreground" className="text-center">
              No spam, unsubscribe at any time
            </Text>
          </Stack>
        </Card>

        {/* Quick Links */}
        <Stack gap="md" className="w-full">
          <Text size="sm" fw="semibold">
            Quick Links
          </Text>
          <Group gap="lg" className="flex-wrap">
            {content.sections.slice(0, 2).map((section) => (
              <Stack key={section.title} gap="md">
                <Text size="sm" fw="semibold" c="foreground">
                  {section.title}
                </Text>
                <Stack gap="xs">
                  {section.links.slice(0, 3).map((link) => (
                    <Text
                      key={link.name}
                      size="sm"
                      c="secondary-foreground"
                      className="hover:text-primary transition-colors"
                    >
                      {link.name}
                    </Text>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Group>
        </Stack>

        {/* Copyright */}
        <Box className="pt-lg border-t border-border w-full">
          <Text c="secondary-foreground">
            {content.copyright}
          </Text>
        </Box>
      </Stack>
    )
  }),

  // 3. Contact Focus
  contact: createContentHook({
    content: (content: SplitFooterData) => (
      <Stack gap="xl" align="start">
        <Stack gap="lg">
          <Title order={2} size="sm" fw="bold">
            Get in Touch
          </Title>
          
          <Text c="secondary-foreground" className="max-w-md">
            Ready to start your project? Contact us today and let's build something amazing together.
          </Text>
        </Stack>

        {/* Contact Information */}
        {content.contact && (
          <Stack gap="lg" className="w-full">
            {content.contact.email && (
              <Group gap="md" align="center">
                <Box className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon lucideIcon={Mail} c="primary" />
                </Box>
                <Stack gap="xs">
                  <Text size="sm" fw="semibold">
                    Email
                  </Text>
                  <Text
                    size="sm"
                    c="secondary-foreground"
                    className="hover:text-primary transition-colors"
                  >
                    {content.contact.email}
                  </Text>
                </Stack>
              </Group>
            )}

            {content.contact.phone && (
              <Group gap="md" align="center">
                <Box className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon lucideIcon={Phone} c="primary" />
                </Box>
                <Stack gap="xs">
                  <Text size="sm" fw="semibold">
                    Phone
                  </Text>
                  <Text
                    component="a"
                    size="sm"
                    c="secondary-foreground"
                    className="hover:text-primary transition-colors"
                  >
                    {content.contact.phone}
                  </Text>
                </Stack>
              </Group>
            )}

            {content.contact.address && (
              <Group gap="md" align="center">
                <Box className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon lucideIcon={MapPin} c="primary" />
                </Box>
                <Stack gap="xs">
                  <Text size="sm" fw="semibold">
                    Address
                  </Text>
                  <Text c="secondary-foreground">
                    {content.contact.address}
                  </Text>
                </Stack>
              </Group>
            )}

            {content.contact.website && (
              <Group gap="md" align="center">
                <Box className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon lucideIcon={Globe} c="primary" />
                </Box>
                <Stack gap="xs">
                  <Text size="sm" fw="semibold">
                    Website
                  </Text>
                  <Text
                    rel="noopener noreferrer"
                    size="sm"
                    c="secondary-foreground"
                    className="hover:text-primary transition-colors"
                  >
                    {content.contact.website}
                  </Text>
                </Stack>
              </Group>
            )}
          </Stack>
        )}

        {/* CTA Button */}
        <Group gap="md" align="center">
          <Button rounded={theme?.themeRounded.default} size="lg" variant="default">
            <Icon c="primary-foreground" lucideIcon={ArrowRight} />
            Start a Project
          </Button>
          <Button rounded={theme?.themeRounded.default} size="lg" variant="outline">
            View Portfolio
          </Button>
        </Group>

        {/* Copyright */}
        <Box className="pt-lg border-t border-border w-full">
          <Text c="secondary-foreground">
            {content.copyright}
          </Text>
        </Box>
      </Stack>
    )
  }),

  // 4. Social Focus
  social: createContentHook({
    content: (content: SplitFooterData) => (
      <Stack gap="xl" align="start">
        <Stack gap="lg">
          <Title order={2} size="sm" fw="bold">
            Join Our Community
          </Title>
          
          <Text c="secondary-foreground" className="max-w-md">
            Connect with us on social media and be part of our growing community of creators and innovators.
          </Text>
        </Stack>

        {/* Social Media Cards */}
        <Stack gap="md" className="w-full">
          {content.social && (
            <Group gap="md" className="flex-wrap">
              {content.social.twitter && (
                <Card p="md" rounded={theme?.themeRounded.default} shadow="sm" className="bg-card border hover:shadow-md transition-shadow cursor-pointer">
                  <Group gap="md" align="center">
                    <Icon size="lg" lucideIcon={Twitter} c="primary" />
                    <Stack gap="xs">
                      <Text size="sm" fw="semibold">
                        Twitter
                      </Text>
                      <Text size="xs" c="secondary-foreground">
                        Follow for updates
                      </Text>
                    </Stack>
                  </Group>
                </Card>
              )}

              {content.social.linkedin && (
                <Card p="md" rounded={theme?.themeRounded.default} shadow="sm" className="bg-card border hover:shadow-md transition-shadow cursor-pointer">
                  <Group gap="md" align="center">
                    <Icon size="lg" lucideIcon={Linkedin} c="primary" />
                    <Stack gap="xs">
                      <Text size="sm" fw="semibold">
                        LinkedIn
                      </Text>
                      <Text size="xs" c="secondary-foreground">
                        Professional network
                      </Text>
                    </Stack>
                  </Group>
                </Card>
              )}

              {content.social.github && (
                <Card p="md" rounded={theme?.themeRounded.default} shadow="sm" className="bg-card border hover:shadow-md transition-shadow cursor-pointer">
                  <Group gap="md" align="center">
                    <Icon size="lg" lucideIcon={Github} c="foreground" />
                    <Stack gap="xs">
                      <Text size="sm" fw="semibold">
                        GitHub
                      </Text>
                      <Text size="xs" c="secondary-foreground">
                        Open source projects
                      </Text>
                    </Stack>
                  </Group>
                </Card>
              )}
            </Group>
          )}
        </Stack>

        {/* Community Stats */}
        <Group gap="xl" align="center" className="w-full">
          <Stack gap="xs" align="center">
            <Text size="2xl" fw="bold" c="primary">
              10K+
            </Text>
            <Text c="secondary-foreground" className="text-center">
              Followers
            </Text>
          </Stack>
          
          <Stack gap="xs" align="center">
            <Text size="2xl" fw="bold" c="primary">
              500+
            </Text>
            <Text c="secondary-foreground" className="text-center">
              Contributors
            </Text>
          </Stack>
          
          <Stack gap="xs" align="center">
            <Text size="2xl" fw="bold" c="primary">
              50+
            </Text>
            <Text c="secondary-foreground" className="text-center">
              Countries
            </Text>
          </Stack>
        </Group>

        {/* Quick Links */}
        <Stack gap="md" className="w-full">
          <Text size="sm" fw="semibold">
            Resources
          </Text>
          <Group gap="md" className="flex-wrap">
            {content.sections[0]?.links.slice(0, 4).map((link) => (
              <Text
                key={link.name}
                size="sm"
                c="secondary-foreground"
                className="hover:text-primary transition-colors"
              >
                {link.name}
              </Text>
            ))}
          </Group>
        </Stack>

        {/* Copyright */}
        <Box className="pt-lg border-t border-border w-full">
          <Text c="secondary-foreground">
            {content.copyright}
          </Text>
        </Box>
      </Stack>
    )
  }),

  // 5. Minimal Focus
  minimal: createContentHook({
    content: (content: SplitFooterData) => (
      <Stack gap="lg" align="start">
        <Stack gap="md">
          <Group gap="md" align="center">
            <Icon size="lg" lucideIcon={Zap} c="primary" />
            <Title order={3} size="xl" fw="bold">
              {content.brand}
            </Title>
          </Group>
          
          {content.tagline && (
            <Text c="secondary-foreground" className="max-w-sm">
              {content.tagline}
            </Text>
          )}
        </Stack>

        {/* Essential Links */}
        <Group gap="lg" className="flex-wrap">
          {content.sections.slice(0, 3).map((section) => (
            <Stack key={section.title} gap="md">
              <Text size="sm" fw="semibold" c="foreground">
                {section.title}
              </Text>
              <Stack gap="xs">
                {section.links.slice(0, 3).map((link) => (
                  <Text
                    key={link.name}
                    size="sm"
                    c="secondary-foreground"
                    className="hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Text>
                ))}
              </Stack>
            </Stack>
          ))}
        </Group>

        {/* Bottom Section */}
        <Group gap="md" align="center" justify="between" className="w-full pt-md border-t border-border">
          <Text c="secondary-foreground">
            {content.copyright}
          </Text>
          
          <RenderSocialLinks social={content.social} size="sm" />
        </Group>
      </Stack>
    )
  })
};

export const SplitFooter = forwardRef<HTMLElement, SplitFooterProps>(
  ({ 
    content, 
    variant = "brand",
    mediaPosition = "right",
    useContainer = true,
    py = "xl",
    className,
    ...props 
  }, ref) => {
    
    // Choose content hooks based on variant
    const contentHooks = splitFooterContentHooks[variant] || splitFooterContentHooks.brand;

    // Create media section with footer-related visuals
    const createMediaSection = (): React.ReactNode => {
      switch (variant) {
        case "brand":
          return (
            <Box className="relative h-full w-full p-6 bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-lg overflow-hidden flex items-center justify-center">
              <Stack gap="xl" align="center" className="relative z-10">
                <Box className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon lucideIcon={Building2} c="primary" />
                </Box>
                <Stack gap="md" align="center">
                  <Text size="lg" fw="semibold" c="primary">
                    Trusted Brand
                  </Text>
                  <Text size="sm" c="primary" ta="center" className="max-w-xs">
                    Building lasting relationships with quality and innovation
                  </Text>
                </Stack>
              </Stack>
            </Box>
          );

        case "newsletter":
          return (
            <Box className="relative h-full w-full p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-tertiary/20 rounded-lg overflow-hidden flex items-center justify-center">
              <Stack gap="xl" align="center" className="relative z-10">
                <Box className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Icon lucideIcon={Mail} c="secondary-foreground" />
                </Box>
                <Stack gap="md" align="center">
                  <Text size="lg" fw="semibold" c="secondary-foreground">
                    Stay Connected
                  </Text>
                  <Text size="sm" c="primary" ta="center" className="max-w-xs">
                    Join thousands of subscribers getting the latest updates
                  </Text>
                </Stack>
              </Stack>
            </Box>
          );

        case "contact":
          return (
            <Box className="relative h-full w-full p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-tertiary/20 rounded-lg overflow-hidden flex items-center justify-center">
              <Stack gap="lg" align="center" className="relative z-10">
                <Box className="grid grid-cols-2 max-w-sm" gap="md">
                  {[Phone, Mail, MapPin, Globe].map((LucideIcon, index) => (
                    <Box 
                      key={index}
                      className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center"
                    >
                      <Icon size="lg" lucideIcon={LucideIcon} c="secondary-foreground" />
                    </Box>
                  ))}
                </Box>
                <Text size="sm" fw="medium" c="secondary-foreground" ta="center">
                  Multiple ways to reach us
                </Text>
              </Stack>
            </Box>
          );

        case "social":
          return (
            <Box className="relative h-full w-full p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-tertiary/20 rounded-lg overflow-hidden flex items-center justify-center">
              <Stack gap="lg" align="center" className="relative z-10">
                <Box className="grid grid-cols-3 gap-md max-w-md">
                  {[
                    { icon: Twitter, label: "Twitter" },
                    { icon: Instagram, label: "Instagram" },
                    { icon: Linkedin, label: "LinkedIn" },
                    { icon: Facebook, label: "Facebook" },
                    { icon: Youtube, label: "YouTube" },
                    { icon: Github, label: "GitHub" }
                  ].map((item, index) => (
                    <Stack key={index} gap="md" align="center">
                      <Box className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Icon lucideIcon={item.icon} c="secondary-foreground" />
                      </Box>
                      <Text size="xs" c="secondary-foreground" ta="center">
                        {item.label}
                      </Text>
                    </Stack>
                  ))}
                </Box>
                <Text size="sm" fw="medium" c="secondary-foreground" ta="center">
                  Join our vibrant community
                </Text>
              </Stack>
            </Box>
          );

        case "minimal":
          return (
            <Box className="relative h-full w-full p-6 bg-gradient-to-br from-primary/20 via-secondary/20 to-tertiary/20 rounded-lg overflow-hidden flex items-center justify-center">
              <Stack gap="xl" align="center" className="relative z-10">
                <Box className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Icon lucideIcon={Zap} c="secondary-foreground" />
                </Box>
                <Stack gap="md" align="center">
                  <Text size="lg" fw="semibold" c="secondary-foreground">
                    Simple & Effective
                  </Text>
                  <Text size="sm" c="primary" ta="center" className="max-w-xs">
                    Clean design with essential information
                  </Text>
                </Stack>
              </Stack>
            </Box>
          );

        default:
          return (
            <Box className="relative h-full w-full p-6 bg-gradient-to-br from-primary/20 to-transparent rounded-lg flex items-center justify-center">
              <Icon lucideIcon={Building2} c="primary" className="opacity-20" />
            </Box>
          );
      }
    };

    return (
      <SplitBlock
        ref={ref}
        leftMedia={mediaPosition === "left"}
        mediaSection={createMediaSection()}
        contentHooks={contentHooks}
        content={content}
        splitSection={!useContainer}
        containerSize="lg"
        py={py}
        gap="lg"
        className={className}
        {...props}
      />
    );
  }
);

SplitFooter.displayName = "SplitFooter";

// Export template configurations
// brand, newsletter, contact, social, minimal
/*
export const splitFooterTemplates = {
  brand: {
    id: "splitFooterBrand",
    name: "Brand Footer",
    description: "Footer focused on brand identity and company features",
    component: SplitFooter,
    defaultProps: { variant: "brand" as const }
  },
  
  newsletter: {
    id: "splitFooterNewsletter", 
    name: "Newsletter Footer",
    description: "Footer with newsletter signup and quick links",
    component: SplitFooter,
    defaultProps: { variant: "newsletter" as const }
  },

  contact: {
    id: "splitFooterContact",
    name: "Contact Footer",
    description: "Footer focused on contact information and CTAs",
    component: SplitFooter,
    defaultProps: { variant: "contact" as const }
  },

  social: {
    id: "splitFooterSocial",
    name: "Social Footer",
    description: "Footer highlighting social media and community",
    component: SplitFooter,
    defaultProps: { variant: "social" as const }
  },

  minimal: {
    id: "splitFooterMinimal",
    name: "Minimal Footer",
    description: "Clean, minimal footer with essential information",
    component: SplitFooter,
    defaultProps: { variant: "minimal" as const }
  }
};*/