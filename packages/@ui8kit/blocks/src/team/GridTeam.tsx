import { forwardRef } from "react";
import { 
  Users,
  User,
  Linkedin,
  Twitter,
  Globe,
  Mail,
  Award,
  Target,
  Briefcase,
  Heart,
  Coffee,
  MapPin,
  Calendar,
  Star,
  Badge as BadgeIcon,
  Image as ImageIcon
} from "lucide-react";
import {
  Stack,
  Group,
  Title,
  Text,
  Badge,
  Button,
  Image,
  Icon,
  Box,
  Card
} from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";

export const currentTheme = skyOSTheme;

export const theme = {
  theme: currentTheme,
  themeRounded: currentTheme.rounded,
  themeButtonSize: currentTheme.buttonSize
}
import { 
  LayoutBlock,
  createLayoutContentHook,
  type LayoutContentHooks
} from "@ui8kit/core/factory/LayoutBlock";

// Reuse team member interfaces from SplitTeam
export interface TeamMember {
  id: string;
  name: string;
  position: string;
  department?: string;
  bio?: string;
  avatar?: {
    src: string;
    alt: string;
  };
  social?: {
    linkedin?: string;
    twitter?: string;
    website?: string;
    email?: string;
  };
  skills?: string[];
  location?: string;
  joinDate?: string;
  featured?: boolean;
}

export interface GridTeamData {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  members: TeamMember[];
  stats?: {
    totalMembers?: string;
    departments?: string;
    locations?: string;
  };
  hiring?: {
    title?: string;
    description?: string;
    ctaText?: string;
    openPositions?: number;
  };
}

export interface GridTeamProps {
  content: GridTeamData;
  variant?: "grid" | "cards" | "minimal" | "showcase" | "directory";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

// Render social links component (reused from SplitTeam)
const RenderSocialLinks = ({ social, size = "sm" }: { social?: TeamMember['social']; size?: "xs" | "sm" | "md" }) => {
  if (!social) return null;
  
  return (
    <Group gap="sm" align="center">
      {social.linkedin && (
        <Icon 
          component="a" 
          href={social.linkedin} 
          target="_blank" 
          rel="noopener noreferrer"
          size={size} 
          lucideIcon={Linkedin} 
          c="secondary-foreground"
          className="hover:text-primary transition-colors cursor-pointer"
        />
      )}
      {social.twitter && (
        <Icon 
          component="a" 
          href={social.twitter} 
          target="_blank" 
          rel="noopener noreferrer"
          size={size} 
          lucideIcon={Twitter} 
          c="secondary-foreground"
          className="hover:text-primary transition-colors cursor-pointer"
        />
      )}
      {social.website && (
        <Icon 
          component="a" 
          href={social.website} 
          target="_blank" 
          rel="noopener noreferrer"
          size={size} 
          lucideIcon={Globe} 
          c="secondary-foreground"
          className="hover:text-primary transition-colors cursor-pointer"
        />
      )}
      {social.email && (
        <Icon 
          component="a" 
          href={`mailto:${social.email}`}
          size={size} 
          lucideIcon={Mail} 
          c="secondary-foreground"
          className="hover:text-primary transition-colors cursor-pointer"
        />
      )}
    </Group>
  );
};

// Custom content hooks for different grid team variants
const gridTeamContentHooks = {
  // 1. Classic Grid Layout
  grid: createLayoutContentHook({
    header: (content: GridTeamData) => (
      <Stack gap="lg" align="center" ta="center" className="max-w-3xl mx-auto">
        {content.badge && (
          <Badge variant="secondary" size="lg" rounded="md">
            <Icon component="span" size="xs" lucideIcon={Users} />
            {content.badge}
          </Badge>
        )}
        
        <Title order={1} size="4xl" fw="bold" ta="center">
          {content.title}
        </Title>
        
        {content.description && (
          <Text c="secondary-foreground" ta="center">
            {content.description}
          </Text>
        )}

        {content.stats && (
          <Group gap="xl" align="center">
            {content.stats.totalMembers && (
              <Stack gap="xs" align="center">
                <Text size="2xl" fw="bold" c="primary">
                  {content.stats.totalMembers}
                </Text>
                <Text size="sm" c="secondary-foreground" className="text-center">
                  Team Members
                </Text>
              </Stack>
            )}
            {content.stats.departments && (
              <Stack gap="xs" align="center">
                <Text size="2xl" fw="bold" c="primary">
                  {content.stats.departments}
                </Text>
                <Text size="sm" c="secondary-foreground" className="text-center">
                  Departments
                </Text>
              </Stack>
            )}
            {content.stats.locations && (
              <Stack gap="xs" align="center">
                <Text size="2xl" fw="bold" c="primary">
                  {content.stats.locations}
                </Text>
                <Text size="sm" c="secondary-foreground" className="text-center">
                  Locations
                </Text>
              </Stack>
            )}
          </Group>
        )}
      </Stack>
    ),
    
    item: (member: TeamMember) => (
      <Card p="lg" rounded="lg" shadow="sm" className="h-full text-center">
        <Stack gap="md" align="center">
          {member.avatar ? (
            <Image
              src={member.avatar.src}
              alt={member.avatar.alt}
              width="80px"
              height="80px"
              fit="cover"
              rounded="full"
              className="border-4 border-primary/10"
            />
          ) : (
            <Box 
              className="w-[80px] h-[80px] bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20"
              data-class="avatar-placeholder"
            >
              <Icon component="span" size="xl" lucideIcon={User} c="primary" />
            </Box>
          )}
          
          <Stack gap="xs" align="center">
            <Title order={3} size="lg" fw="semibold">
              {member.name}
            </Title>
            <Text size="sm" c="primary" fw="medium">
              {member.position}
            </Text>
            {member.department && (
              <Text size="xs" c="secondary-foreground">
                {member.department}
              </Text>
            )}
          </Stack>
          
          {member.bio && (
            <Text size="sm" c="secondary-foreground" ta="center" className="line-clamp-3">
              {member.bio}
            </Text>
          )}
          
          <Group gap="md" align="center" justify="center" className="mt-auto">
            <RenderSocialLinks social={member.social} />
          </Group>
        </Stack>
      </Card>
    )
  }),

  // 2. Detailed Card Layout
  cards: createLayoutContentHook({
    header: (content: GridTeamData) => (
      <Stack gap="lg" align="center" ta="center">
        <Badge variant="secondary" size="lg" rounded="md" className="px-lg py-sm">
          <Icon component="span" size="xs" lucideIcon={Award} />
          {content.badge || "Our Team"}
        </Badge>
        
        <Title order={1} size="4xl" fw="bold" ta="center">
          {content.title}
        </Title>
        
        {content.subtitle && (
          <Text c="secondary-foreground" ta="center" className="max-w-2xl">
            {content.subtitle}
          </Text>
        )}
      </Stack>
    ),
    
    item: (member: TeamMember) => (
      <Card p="xl" rounded="xl" shadow="lg" className="h-full bg-card border hover:shadow-xl transition-shadow">
        <Stack gap="lg" align="center">
          {/* Avatar */}
          {member.avatar ? (
            <Image
              src={member.avatar.src}
              alt={member.avatar.alt}
              width="100px"
              height="100px"
              fit="cover"
              rounded="full"
              className="border-4 border-primary/10"
            />
          ) : (
            <Box 
              className="w-[100px] h-[100px] bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20"
              data-class="avatar-placeholder"
            >
              <Icon component="span" size="2xl" lucideIcon={User} c="primary" />
            </Box>
          )}
          
          {/* Member Info */}
          <Stack gap="sm" align="center">
            <Stack gap="xs" align="center">
              <Title order={3} size="xl" fw="bold">
                {member.name}
              </Title>
              <Text size="md" c="primary" fw="semibold">
                {member.position}
              </Text>
              {member.department && (
                <Badge variant="secondary" size="sm" rounded="md">
                  {member.department}
                </Badge>
              )}
            </Stack>
            
            {member.location && (
              <Group gap="xs" align="center">
                <Icon component="span" size="xs" lucideIcon={MapPin} c="secondary-foreground" />
                <Text size="sm" c="secondary-foreground">{member.location}</Text>
              </Group>
            )}
          </Stack>
          
          {/* Bio */}
          {member.bio && (
            <Text size="sm" c="secondary-foreground" ta="center" className="leading-relaxed">
              {member.bio}
            </Text>
          )}
          
          {/* Skills */}
          {member.skills && (
            <Group gap="xs" className="flex-wrap justify-center">
              {member.skills.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="outline" size="xs" rounded="md">
                  {skill}
                </Badge>
              ))}
            </Group>
          )}
          
          {/* Social Links */}
          <Group gap="md" align="center" justify="center" className="mt-auto">
            <RenderSocialLinks social={member.social} size="md" />
          </Group>
        </Stack>
      </Card>
    )
  }),

  // 3. Minimal Layout
  minimal: createLayoutContentHook({
    header: (content: GridTeamData) => (
      <Stack gap="md" align="center" ta="center" className="max-w-2xl mx-auto">
        <Text size="xs" fw="semibold" c="primary" className="uppercase tracking-widest">
          {content.badge || "Team"}
        </Text>
        
        <Title order={1} size="3xl" fw="light" ta="center" className="font-serif">
          {content.title}
        </Title>
        
        {content.subtitle && (
          <Text size="md" c="secondary-foreground" ta="center" className="italic">
            {content.subtitle}
          </Text>
        )}
      </Stack>
    ),
    
    item: (member: TeamMember) => (
      <Box className="text-center p-lg hover:bg-card/30 rounded-md transition-colors">
        <Stack gap="md" align="center">
          {member.avatar ? (
            <Image
              src={member.avatar.src}
              alt={member.avatar.alt}
              width="60px"
              height="60px"
              fit="cover"
              rounded="full"
              className="border-2 border-primary/20"
            />
          ) : (
            <Box 
              className="w-[60px] h-[60px] bg-primary/10 rounded-full flex items-center justify-center border-2 border-primary/20"
              data-class="avatar-placeholder"
            >
              <Icon component="span" size="lg" lucideIcon={User} c="primary" />
            </Box>
          )}
          
          <Stack gap="xs" align="center">
            <Text size="md" fw="semibold">
              {member.name}
            </Text>
            <Text size="sm" c="secondary-foreground" className="font-light">
              {member.position}
            </Text>
          </Stack>
          
          <RenderSocialLinks social={member.social} size="xs" />
        </Stack>
      </Box>
    )
  }),

  // 4. Showcase with Highlights
  showcase: createLayoutContentHook({
    header: (content: GridTeamData) => (
      <Stack gap="lg" align="center" ta="center">
        <Title order={1} size="5xl" fw="bold" ta="center">
          {content.title}
        </Title>
        {content.description && (
          <Text c="secondary-foreground" ta="center" className="max-w-3xl">
            {content.description}
          </Text>
        )}
        
        {content.hiring && (
          <Card p="lg" rounded="lg" shadow="md" className="bg-primary/5 border-primary/20 max-w-md">
            <Stack gap="md" align="center">
              <Group gap="sm" align="center">
                <Icon component="span" size="md" lucideIcon={Briefcase} c="primary" />
                <Text size="md" fw="semibold" c="primary">
                  {content.hiring.title || "We're Hiring!"}
                </Text>
              </Group>
              {content.hiring.openPositions && (
                <Badge variant="secondary" size="md" rounded="md">
                  {content.hiring.openPositions} Open Positions
                </Badge>
              )}
            </Stack>
          </Card>
        )}
      </Stack>
    ),
    
    item: (member: TeamMember, index: number) => {
      const isFeatured = member.featured || index % 6 === 0;
      
      return (
        <Card 
          p={isFeatured ? "xl" : "lg"} 
          rounded="lg" 
          shadow={isFeatured ? "xl" : "sm"} 
          className={`${isFeatured ? "bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20" : "bg-card"} hover:shadow-lg transition-shadow`}
        >
          <Stack gap="md" align="center">
            {isFeatured && (
              <Badge variant="secondary" size="xs" rounded="full">
                <Icon component="span" size="xs" lucideIcon={Star} />
                Featured
              </Badge>
            )}
            
            {member.avatar ? (
              <Image
                src={member.avatar.src}
                alt={member.avatar.alt}
                width={isFeatured ? "90px" : "70px"}
                height={isFeatured ? "90px" : "70px"}
                fit="cover"
                rounded="full"
                className={`border-4 ${isFeatured ? "border-primary/20" : "border-primary/10"}`}
              />
            ) : (
              <Box 
                className={`${isFeatured ? "w-[90px] h-[90px]" : "w-[70px] h-[70px]"} bg-primary/10 rounded-full flex items-center justify-center border-4 ${isFeatured ? "border-primary/20" : "border-primary/10"}`}
                data-class="avatar-placeholder"
              >
                <Icon component="span" size={isFeatured ? "xl" : "lg"} lucideIcon={User} c="primary" />
              </Box>
            )}
            
            <Stack gap="xs" align="center">
              <Title order={3} size={isFeatured ? "lg" : "md"} fw="semibold">
                {member.name}
              </Title>
              <Text size="sm" c="primary" fw="medium">
                {member.position}
              </Text>
              {member.department && (
                <Text size="xs" c="secondary-foreground">
                  {member.department}
                </Text>
              )}
            </Stack>
            
            {member.skills && isFeatured && (
              <Group gap="xs" className="flex-wrap justify-center">
                {member.skills.slice(0, 3).map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="secondary" size="xs" rounded="md">
                    {skill}
                  </Badge>
                ))}
              </Group>
            )}
            
            <RenderSocialLinks social={member.social} size="sm" />
          </Stack>
        </Card>
      );
    }
  }),

  // 5. Directory Style
  directory: createLayoutContentHook({
    header: (content: GridTeamData) => (
      <Stack gap="lg" align="start">
        <Group gap="md" align="center" justify="between" className="w-full">
          <Stack gap="sm">
            <Title order={1} size="3xl" fw="bold">
              {content.title}
            </Title>
            {content.description && (
              <Text size="md" c="secondary-foreground">
                {content.description}
              </Text>
            )}
          </Stack>
          
          <Group gap="sm">
            <Button rounded={theme?.themeRounded.default} size="sm" variant="outline">
              <Icon component="span" size="xs" lucideIcon={Users} />
              All Members
            </Button>
            <Button rounded={theme?.themeRounded.default} size="sm" variant="outline">
              <Icon component="span" size="xs" lucideIcon={Target} />
              Departments
            </Button>
          </Group>
        </Group>
        
        {content.stats && (
          <Group gap="lg" align="center">
            {content.stats.totalMembers && (
              <Group gap="xs" align="center">
                <Icon component="span" size="sm" lucideIcon={Users} c="primary" />
                <Text size="sm" fw="medium">{content.stats.totalMembers} Members</Text>
              </Group>
            )}
            {content.stats.departments && (
              <Group gap="xs" align="center">
                <Icon component="span" size="sm" lucideIcon={Target} c="primary" />
                <Text size="sm" fw="medium">{content.stats.departments} Departments</Text>
              </Group>
            )}
            {content.stats.locations && (
              <Group gap="xs" align="center">
                <Icon component="span" size="sm" lucideIcon={MapPin} c="primary" />
                <Text size="sm" fw="medium">{content.stats.locations} Locations</Text>
              </Group>
            )}
          </Group>
        )}
      </Stack>
    ),
    
    item: (member: TeamMember) => (
      <Card p="md" rounded="md" shadow="sm" className="bg-card border hover:bg-card/80 transition-colors">
        <Group gap="md" align="center">
          {member.avatar ? (
            <Image
              src={member.avatar.src}
              alt={member.avatar.alt}
              width="50px"
              height="50px"
              fit="cover"
              rounded="full"
            />
          ) : (
            <Box 
              className="w-[50px] h-[50px] bg-primary/10 rounded-full flex items-center justify-center"
              data-class="avatar-placeholder"
            >
              <Icon component="span" size="md" lucideIcon={User} c="primary" />
            </Box>
          )}
          
          <Stack gap="xs" className="flex-1">
            <Group gap="md" align="center" justify="between">
              <Stack gap="xs">
                <Text size="sm" fw="semibold">
                  {member.name}
                </Text>
                <Text size="xs" c="secondary-foreground">
                  {member.position}
                </Text>
                {member.department && (
                  <Badge variant="secondary" size="xs" rounded="md">
                    {member.department}
                  </Badge>
                )}
              </Stack>
              
              <Group gap="sm" align="center">
                {member.location && (
                  <Group gap="xs" align="center">
                    <Icon component="span" size="xs" lucideIcon={MapPin} c="secondary-foreground" />
                    <Text size="xs" c="secondary-foreground">{member.location}</Text>
                  </Group>
                )}
                <RenderSocialLinks social={member.social} size="xs" />
              </Group>
            </Group>
          </Stack>
        </Group>
      </Card>
    )
  })
};

export const GridTeam = forwardRef<HTMLElement, GridTeamProps>(
  ({ 
    content, 
    variant = "grid",
    useContainer = true,
    py = "xl",
    className,
    ...props 
  }, ref) => {
    
    // Choose content hooks based on variant
    const contentHooks = gridTeamContentHooks[variant] || gridTeamContentHooks.grid;

    // Determine layout type and grid configuration based on variant
    const getLayoutConfig = () => {
      switch (variant) {
        case "cards":
          return { layout: "grid" as const, cols: "1-2-3" };
        case "minimal":
          return { layout: "grid" as const, cols: "1-2-3-4" };
        case "showcase":
          return { layout: "grid" as const, cols: "1-2-3" };
        case "directory":
          return { layout: "grid" as const, cols: "1-2" };
        default: // grid
          return { layout: "grid" as const, cols: "1-2-3-4" };
      }
    };

    const layoutConfig = getLayoutConfig();

    return (
      <LayoutBlock
        ref={ref}
        layout={layoutConfig.layout}
        cols={layoutConfig.cols}
        useContainer={useContainer}
        py={py}
        showHeader={true}
        content={{ ...content, items: content.members }}
        contentHooks={contentHooks}
        className={className}
        {...props}
      />
    );
  }
);

GridTeam.displayName = "GridTeam";

// Export template configurations
export const gridTeamTemplates = {
  grid: {
    id: "gridTeamGrid",
    name: "Classic Team Grid",
    description: "Traditional grid layout with team member cards",
    component: GridTeam,
    defaultProps: { variant: "grid" as const }
  },
  
  cards: {
    id: "gridTeamCards",
    name: "Detailed Team Cards",
    description: "Rich card layout with detailed member information",
    component: GridTeam,
    defaultProps: { variant: "cards" as const }
  },

  minimal: {
    id: "gridTeamMinimal",
    name: "Minimal Team Display",
    description: "Clean, minimal team member presentation",
    component: GridTeam,
    defaultProps: { variant: "minimal" as const }
  },

  showcase: {
    id: "gridTeamShowcase",
    name: "Team Showcase",
    description: "Highlighted team members with featured profiles",
    component: GridTeam,
    defaultProps: { variant: "showcase" as const }
  },

  directory: {
    id: "gridTeamDirectory",
    name: "Team Directory",
    description: "Compact directory-style team member listing",
    component: GridTeam,
    defaultProps: { variant: "directory" as const }
  }
};