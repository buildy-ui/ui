import { forwardRef } from "react";
import { 
  Eye,
  ExternalLink,
  Calendar,
  User,
  Briefcase,
  Code,
  Palette,
  ArrowRight,
  MessageSquare
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
  SplitBlock, 
  createContentHook, 
} from "@ui8kit/core";

// Portfolio interfaces (reuse from GridPortfolio)
export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  tags: string[];
  category?: string;
  client?: string;
  year?: string;
  status?: "completed" | "in-progress" | "featured";
  links?: {
    live?: string;
    github?: string;
    case_study?: string;
  };
  stats?: {
    views?: string;
    likes?: string;
    duration?: string;
  };
  lucideIcon?: any;
}

export interface PortfolioCategory {
  id: string;
  name: string;
  lucideIcon?: any;
  color?: string;
}

// Split Portfolio data interface
export interface SplitPortfolioData {
  badge?: string;
  title: string;
  description: string;
  buttonText?: string;
  categories?: PortfolioCategory[];
  projects: PortfolioProject[];
  stats?: {
    totalProjects: string;
    yearsExperience: string;
    happyClients: string;
    awards?: string;
  };
  skills?: string[];
  testimonial?: {
    text: string;
    author: string;
    role: string;
    company?: string;
  };
}

export interface SplitPortfolioProps {
  content: SplitPortfolioData;
  variant?: "showcase" | "about" | "skills" | "testimonial" | "process";
  leftMedia?: boolean;
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  gap?: "none" | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Custom content hooks for different split portfolio variants
const splitPortfolioContentHooks = {
  // Portfolio showcase
  showcase: createContentHook({
    content: (content: SplitPortfolioData) => (
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

        {/* Featured Projects */}
        <Stack gap="md" className="w-full">
          <Title order={3} size="lg" fw="semibold">
            Featured Work
          </Title>
          
          <Stack gap="md">
            {content.projects.slice(0, 3).map((project) => (
              <Card key={project.id} p="md" rounded={theme?.themeRounded.default} shadow="sm" bg="card" className="hover:shadow-md transition-shadow cursor-pointer">
                <Group gap="md" align="center">
                  <Box className="relative overflow-hidden rounded-md flex-shrink-0">
                    <Image
                      src={project.image.src}
                      alt={project.image.alt}
                      width="80px"
                      height="60px"
                      fit="cover"
                    />
                  </Box>
                  
                  <Stack gap="xs" className="flex-1">
                    <Group gap="md" align="center" justify="between">
                      <Title order={4} size="md" fw="semibold" className="line-clamp-1">
                        {project.title}
                      </Title>
                      {project.year && (
                        <Text size="xs" c="secondary-foreground">
                          {project.year}
                        </Text>
                      )}
                    </Group>
                    
                    <Text size="xs" c="secondary-foreground" className="line-clamp-1">
                      {project.description}
                    </Text>

                    <Group gap="xs">
                      {project.tags.slice(0, 2).map((tag, index) => (
                        <Badge key={index} variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                          {tag}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>

                  <Icon lucideIcon={ArrowRight} c="secondary-foreground" />
                </Group>
              </Card>
            ))}
          </Stack>
        </Stack>

        {/* Stats */}
        {content.stats && (
          <Grid cols="2" gap="md" className="w-full">
            <Stack gap="xs" align="center" ta="center">
              <Text size="3xl" fw="bold" c="primary">
                {content.stats.totalProjects}
              </Text>
              <Text c="secondary-foreground">
                Projects Completed
              </Text>
            </Stack>
            
            <Stack gap="xs" align="center" ta="center">
              <Text size="3xl" fw="bold" c="primary">
                {content.stats.yearsExperience}
              </Text>
              <Text c="secondary-foreground">
                Years Experience
              </Text>
            </Stack>
          </Grid>
        )}

        {content.buttonText && (
          <Button rounded={theme?.themeRounded.default} size="lg" className="w-full">
            {content.buttonText}
          </Button>
        )}
      </Stack>
    )
  }),

  // About/Bio section
  about: createContentHook({
    content: (content: SplitPortfolioData) => (
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

        {/* Experience Stats */}
        {content.stats && (
          <Grid cols="1" gap="md" className="w-full">
            <Group gap="md" align="center" justify="between">
              <Text c="secondary-foreground">Experience</Text>
              <Text size="sm" fw="semibold">{content.stats.yearsExperience} years</Text>
            </Group>
            
            <Group gap="md" align="center" justify="between">
              <Text c="secondary-foreground">Projects</Text>
              <Text size="sm" fw="semibold">{content.stats.totalProjects}+ completed</Text>
            </Group>
            
            <Group gap="md" align="center" justify="between">
              <Text c="secondary-foreground">Clients</Text>
              <Text size="sm" fw="semibold">{content.stats.happyClients} happy clients</Text>
            </Group>

            {content.stats.awards && (
              <Group gap="md" align="center" justify="between">
                <Text c="secondary-foreground">Awards</Text>
                <Text size="sm" fw="semibold">{content.stats.awards} awards</Text>
              </Group>
            )}
          </Grid>
        )}

        {/* Categories/Specializations */}
        {content.categories && (
          <Stack gap="md" className="w-full">
            <Title order={4} size="md" fw="semibold">
              Specializations
            </Title>
            
            <Grid cols="2" gap="md">
              {content.categories.map((category) => (
                <Group key={category.id} gap="md" align="center">
                  {category.lucideIcon && (
                    <Icon lucideIcon={category.lucideIcon} c="primary" />
                  )}
                  <Text size="sm" fw="medium">
                    {category.name}
                  </Text>
                </Group>
              ))}
            </Grid>
          </Stack>
        )}

        <Group gap="md">
          <Button rounded={theme?.themeRounded.default} size="md" variant="default">
            View Portfolio
          </Button>
          <Button rounded={theme?.themeRounded.default} size="md" variant="outline">
            Download CV
          </Button>
        </Group>
      </Stack>
    )
  }),

  // Skills showcase
  skills: createContentHook({
    content: (content: SplitPortfolioData) => (
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

        {/* Skills List */}
        {content.skills && (
          <Stack gap="md" className="w-full">
            <Title order={4} size="md" fw="semibold">
              Technical Skills
            </Title>
            
            <Group gap="md" className="flex-wrap">
              {content.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="px-md py-xs">
                  {skill}
                </Badge>
              ))}
            </Group>
          </Stack>
        )}

        {/* Categories with Icons */}
        {content.categories && (
          <Stack gap="md" className="w-full">
            <Title order={4} size="md" fw="semibold">
              Areas of Expertise
            </Title>
            
            <Stack gap="md">
              {content.categories.map((category) => (
                <Card key={category.id} p="md" rounded={theme?.themeRounded.default} shadow="sm" bg="card">
                  <Group gap="md" align="center">
                    {category.lucideIcon && (
                      <Box p="sm" bg="primary" rounded={theme?.themeRounded.default} data-class="skill-icon">
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
                        {content.projects.filter(p => p.category === category.name).length} projects
                      </Text>
                    </Stack>
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

  // Client testimonial
  testimonial: createContentHook({
    content: (content: SplitPortfolioData) => (
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

        {/* Testimonial */}
        {content.testimonial && (
          <Card p="lg" rounded={theme?.themeRounded.default} shadow="md" bg="card" className="w-full">
            <Stack gap="md">
              <Group gap="md" align="start">
                <Icon size="lg" lucideIcon={MessageSquare} c="primary" className="flex-shrink-0 mt-xs" />
                <Text size="lg" className="italic line-height-relaxed">
                  "{content.testimonial.text}"
                </Text>
              </Group>
              
              <Stack gap="xs">
                <Text size="md" fw="semibold">
                  {content.testimonial.author}
                </Text>
                <Text c="secondary-foreground">
                  {content.testimonial.role}
                  {content.testimonial.company && ` at ${content.testimonial.company}`}
                </Text>
              </Stack>
            </Stack>
          </Card>
        )}

        {/* Recent Projects */}
        <Stack gap="md" className="w-full">
          <Title order={4} size="md" fw="semibold">
            Recent Work
          </Title>
          
          <Grid cols="2" gap="md">
            {content.projects.slice(0, 4).map((project) => (
              <Box key={project.id} className="relative overflow-hidden group cursor-pointer" rounded={theme?.themeRounded.default}>
                <Image
                  src={project.image.src}
                  alt={project.image.alt}
                  width="100%"
                  height="150px"
                  fit="cover"
                  className="group-hover:scale-105 transition-transform duration-300"
                />
                
                <Box className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <Icon lucideIcon={Eye} c="primary-foreground" />
                </Box>

                <Box className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent" p="sm" data-class="testimonial-card-content">
                  <Text size="xs" c="primary-foreground" fw="medium" className="line-clamp-1">
                    {project.title}
                  </Text>
                </Box>
              </Box>
            ))}
          </Grid>
        </Stack>

        <Group gap="md">
          <Button rounded={theme?.themeRounded.default} size="md" variant="default">
            View All Work
          </Button>
          <Button rounded={theme?.themeRounded.default} size="md" variant="outline">
            Get in Touch
          </Button>
        </Group>
      </Stack>
    )
  }),

  // Work process
  process: createContentHook({
    content: (content: SplitPortfolioData) => (
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

        {/* Process Steps */}
        <Stack gap="lg" className="w-full">
          <Title order={4} size="md" fw="semibold">
            My Process
          </Title>
          
          <Stack gap="md">
            {[
              { step: "01", title: "Discovery", desc: "Understanding your needs and goals", icon: MessageSquare },
              { step: "02", title: "Planning", desc: "Creating strategy and roadmap", icon: Calendar },
              { step: "03", title: "Design", desc: "Crafting the visual experience", icon: Palette },
              { step: "04", title: "Development", desc: "Building with clean code", icon: Code },
              { step: "05", title: "Launch", desc: "Testing and going live", icon: ExternalLink }
            ].map((process, index) => (
              <Group key={index} gap="md" align="start">
                <Box className="flex-shrink-0">
                  <Text size="sm" fw="bold" c="primary" className="font-mono">
                    {process.step}
                  </Text>
                </Box>
                
                <Icon lucideIcon={process.icon} c="primary" className="flex-shrink-0 mt-xs" />
                
                <Stack gap="xs" className="flex-1">
                  <Text size="md" fw="semibold">
                    {process.title}
                  </Text>
                  <Text c="secondary-foreground">
                    {process.desc}
                  </Text>
                </Stack>
              </Group>
            ))}
          </Stack>
        </Stack>

        {/* Tools & Technologies */}
        {content.skills && (
          <Stack gap="md" className="w-full">
            <Title order={4} size="md" fw="semibold">
              Tools & Technologies
            </Title>
            
            <Group gap="xs" className="flex-wrap">
              {content.skills.slice(0, 8).map((skill, index) => (
                <Badge key={index} variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                  {skill}
                </Badge>
              ))}
            </Group>
          </Stack>
        )}

        {content.buttonText && (
          <Button rounded={theme?.themeRounded.default} size="lg" className="w-full">
            {content.buttonText}
          </Button>
        )}
      </Stack>
    )
  })
};

export const SplitPortfolio = forwardRef<HTMLElement, SplitPortfolioProps>(
  ({ 
    content, 
    variant = "showcase",
    leftMedia = false,
    useContainer = true,
    py = "lg",
    gap = "xl",
    className,
    ...props 
  }, ref) => {
    
    // Create media section based on variant and content
    const createMediaSection = () => {
      // Use first project image or create gradient based on variant
      const firstProject = content.projects[0];
      
      if (variant === "showcase" && firstProject) {
        return (
          <Block className="h-full relative overflow-hidden" rounded={theme?.themeRounded.default}>
            <Image
              src={firstProject.image.src}
              alt={firstProject.image.alt}
              width="100%"
              height="100%"
              fit="cover"
            />
            
            {/* Overlay */}
            <Box className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Featured Project Info */}
            <Box className="absolute bottom-0 left-0 right-0 text-white" p="lg" data-class="showcase-media-content">
              <Stack gap="md">
                <Group gap="md" align="center">
                  <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge} className="bg-white/20 text-white border-white/30">
                    Featured
                  </Badge>
                  {firstProject.year && (
                    <Text size="xs" c="primary-foreground">
                      {firstProject.year}
                    </Text>
                  )}
                </Group>
                
                <Title order={3} size="xl" fw="bold" c="primary-foreground">
                  {firstProject.title}
                </Title>
                
                <Text size="sm" c="primary-foreground" className="opacity-90">
                  {firstProject.description}
                </Text>

                <Group gap="xs" className="flex-wrap">
                  {firstProject.tags.slice(0, 3).map((tag, index) => (
                    <Text key={index} size="xs" c="primary-foreground" className="opacity-75">
                      #{tag}
                    </Text>
                  ))}
                </Group>
              </Stack>
            </Box>
          </Block>
        );
      }

      // Default gradient based on variant
      const gradientMap = {
        showcase: "from-primary/5 to-secondary/10",
        about: "from-primary/5 to-secondary/10",
        skills: "from-primary/5 to-secondary/10",
        testimonial: "from-primary/5 to-secondary/10",
        process: "from-primary/5 to-secondary/10"
      };

      // Icon map for decorative elements
      const iconMap = {
        showcase: Briefcase,
        about: User,
        skills: Code,
        testimonial: MessageSquare,
        process: Calendar
      };

      return (
        <Block 
          className={`h-full bg-gradient-to-br ${gradientMap[variant]} relative overflow-hidden rounded-${theme?.themeRounded.default}`}
          data-class="portfolio-gradient-background"
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
              data-class="portfolio-central-icon"
            >
              <Icon
                component="span"
                size="lg"
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
    const contentHooks = splitPortfolioContentHooks[variant] || splitPortfolioContentHooks.showcase;

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

SplitPortfolio.displayName = "SplitPortfolio";

// Export template configurations
export const splitPortfolioTemplates = {
  showcase: {
    id: "splitPortfolioShowcase",
    name: "Portfolio Showcase",
    description: "Split layout showcasing featured work and stats",
    component: SplitPortfolio,
    defaultProps: { variant: "showcase" as const }
  },
  
  about: {
    id: "splitPortfolioAbout",
    name: "About & Bio",
    description: "Personal introduction with experience and specializations",
    component: SplitPortfolio,
    defaultProps: { variant: "about" as const }
  },

  skills: {
    id: "splitPortfolioSkills",
    name: "Skills & Expertise",
    description: "Technical skills and areas of expertise showcase",
    component: SplitPortfolio,
    defaultProps: { variant: "skills" as const }
  },

  testimonial: {
    id: "splitPortfolioTestimonial",
    name: "Client Testimonials",
    description: "Client feedback with recent work samples",
    component: SplitPortfolio,
    defaultProps: { variant: "testimonial" as const }
  },

  process: {
    id: "splitPortfolioProcess",
    name: "Work Process",
    description: "Step-by-step work methodology and tools",
    component: SplitPortfolio,
    defaultProps: { variant: "process" as const }
  }
};