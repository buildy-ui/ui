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
  MapPin
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

// Team member interfaces
interface TeamMember {
  id: string;
  name: string;
  position: string;
  description: string;
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

export interface SplitTeamData {
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

interface SplitTeamProps {
  content: SplitTeamData;
  variant?: "leadership" | "showcase" | "hiring" | "culture" | "departments";
  mediaPosition?: "left" | "right";
  useContainer?: boolean;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

// Render social links component
const RenderSocialLinks = ({ social, size = "sm" }: { social?: TeamMember['social']; size?: "xs" | "sm" | "md" }) => {
  if (!social) return null;
  
  return (
    <Group gap="md" align="center">
      {social.linkedin && (
        <Icon
          lucideIcon={Linkedin} 
          c="secondary-foreground"
          className="hover:text-primary transition-colors cursor-pointer"
        />
      )}
      {social.twitter && (
        <Icon
          lucideIcon={Twitter} 
          c="secondary-foreground"
          className="hover:text-primary transition-colors cursor-pointer"
        />
      )}
      {social.website && (
        <Icon
          lucideIcon={Globe} 
          c="secondary-foreground"
          className="hover:text-primary transition-colors cursor-pointer"
        />
      )}
      {social.email && (
        <Icon
          lucideIcon={Mail} 
          c="secondary-foreground"
          className="hover:text-primary transition-colors cursor-pointer"
        />
      )}
    </Group>
  );
};

// Custom content hooks for different split team variants
const splitTeamContentHooks = {
  // 1. Leadership Team Focus
  leadership: createContentHook({
    content: (content: SplitTeamData) => (
      <Stack gap="xl" align="start">
        {content.badge && (
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            <Icon lucideIcon={Award} />
            {content.badge}
          </Badge>
        )}
        
        <Title order={1} size="4xl" fw="bold">
          {content.title}
        </Title>
        
        {content.description && (
          <Text c="secondary-foreground">
            {content.description}
          </Text>
        )}

        {/* Featured Leadership Members */}
        <Stack gap="lg" className="w-full">
          {content.members.filter(member => member.featured).slice(0, 3).map((member) => (
            <Card key={member.id} p="lg" rounded={theme?.themeRounded.default} shadow="sm" className="bg-card border">
              <Group gap="lg" align="start">
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
                    <Icon size="xl" lucideIcon={User} c="primary" />
                  </Box>
                )}
                
                <Stack gap="md" className="flex-1">
                  <Stack gap="xs">
                    <Title order={3} size="lg" fw="semibold">
                      {member.name}
                    </Title>
                    <Text size="md" c="primary" fw="medium">
                      {member.position}
                    </Text>
                    {member.department && (
                      <Text c="secondary-foreground">
                        {member.department}
                      </Text>
                    )}
                  </Stack>
                  
                  {member.bio && (
                    <Text c="secondary-foreground" className="leading-relaxed">
                      {member.bio}
                    </Text>
                  )}
                  
                  <Group gap="md" align="center" justify="between">
                    <RenderSocialLinks social={member.social} />
                    {member.location && (
                      <Group gap="xs" align="center">
                        <Icon lucideIcon={MapPin} c="secondary-foreground" />
                        <Text size="xs" c="secondary-foreground">{member.location}</Text>
                      </Group>
                    )}
                  </Group>
                </Stack>
              </Group>
            </Card>
          ))}
        </Stack>
      </Stack>
    )
  }),

  // 2. Team Showcase with Skills
  showcase: createContentHook({
    content: (content: SplitTeamData) => (
      <Stack gap="xl" align="start">
        <Stack gap="lg">
          {content.badge && (
            <Badge variant="outline" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
              <Icon lucideIcon={Users} />
              {content.badge}
            </Badge>
          )}
          
          <Title order={1} size="3xl" fw="bold">
            {content.title}
          </Title>
          
          {content.subtitle && (
            <Text c="secondary-foreground">
              {content.subtitle}
            </Text>
          )}
        </Stack>

        {/* Team Members Showcase */}
        <Stack gap="md" className="w-full">
          {content.members.slice(0, 4).map((member) => (
            <Box key={member.id} className="bg-card/50 border hover:bg-card transition-colors" p="md" rounded={theme?.themeRounded.default} data-class="member-card">
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
                    <Icon lucideIcon={User} c="primary" />
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
                    </Stack>
                    <RenderSocialLinks social={member.social} size="xs" />
                  </Group>
                  
                  {member.skills && (
                    <Group gap="xs" className="flex-wrap">
                      {member.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                          {skill}
                        </Badge>
                      ))}
                    </Group>
                  )}
                </Stack>
              </Group>
            </Box>
          ))}
        </Stack>

        {content.members.length > 4 && (
          <Text c="secondary-foreground">
            +{content.members.length - 4} more team members
          </Text>
        )}
      </Stack>
    )
  }),

  // 3. Hiring & Recruitment Focus
  hiring: createContentHook({
    content: (content: SplitTeamData) => (
      <Stack gap="xl" align="start">
        <Stack gap="lg">
          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>
          
          {content.description && (
            <Text c="secondary-foreground">
              {content.description}
            </Text>
          )}
        </Stack>

        {/* Hiring Stats */}
        {content.hiring && (
          <Card p="lg" rounded={theme?.themeRounded.default} shadow="sm" className="bg-primary/5 border-primary/20 w-full">
            <Stack gap="md">
              <Group gap="md" align="center">
                <Icon lucideIcon={Briefcase} c="primary" />
                <Text size="md" fw="semibold" c="primary">
                  {content.hiring.title || "We're Hiring!"}
                </Text>
              </Group>
              
              {content.hiring.description && (
                <Text c="secondary-foreground">
                  {content.hiring.description}
                </Text>
              )}
              
              {content.hiring.openPositions && (
                <Group gap="md" align="center">
                  <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                    {content.hiring.openPositions} Open Positions
                  </Badge>
                </Group>
              )}
            </Stack>
          </Card>
        )}

        {/* Sample Team Members */}
        <Stack gap="md" className="w-full">
          {content.members.slice(0, 3).map((member) => (
            <Group key={member.id} gap="md" align="center" className="bg-card rounded-lg" p="sm"  data-class="hiring-member-card">
              {member.avatar ? (
                <Image
                  src={member.avatar.src}
                  alt={member.avatar.alt}
                  width="40px"
                  height="40px"
                  fit="cover"
                  rounded="full"
                />
              ) : (
                <Box 
                  className="w-[40px] h-[40px] bg-primary/10 rounded-full flex items-center justify-center"
                  data-class="avatar-placeholder"
                >
                  <Icon lucideIcon={User} c="primary" />
                </Box>
              )}
              
              <Stack gap="xs" className="flex-1">
                <Text size="sm" fw="medium">
                  {member.name}
                </Text>
                <Text size="xs" c="secondary-foreground">
                  {member.position}
                </Text>
              </Stack>
            </Group>
          ))}
        </Stack>

        {content.hiring?.ctaText && (
          <Group gap="md" align="center">
            <Button rounded={theme?.themeRounded.default} size="lg" variant="default">
              {content.hiring.ctaText}
            </Button>
            <Button rounded={theme?.themeRounded.default} size="lg" variant="outline">
              <Icon c="primary-foreground" lucideIcon={Users} />
              Meet the Team
            </Button>
          </Group>
        )}
      </Stack>
    )
  }),

  // 4. Company Culture Focus
  culture: createContentHook({
    content: (content: SplitTeamData) => (
      <Stack gap="xl" align="start">
        <Stack gap="lg">
          <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
            <Icon lucideIcon={Heart} />
            {content.badge || "Our Culture"}
          </Badge>
          
          <Title order={1} size="3xl" fw="bold">
            {content.title}
          </Title>
          
          {content.subtitle && (
            <Text c="secondary-foreground">
              {content.subtitle}
            </Text>
          )}
        </Stack>

        {/* Culture Stats */}
        {content.stats && (
          <Group gap="xl" align="center" className="w-full">
            {content.stats.totalMembers && (
              <Stack gap="xs" align="center">
                <Text size="2xl" fw="bold" c="primary">
                  {content.stats.totalMembers}
                </Text>
                <Text size="xs" c="secondary-foreground" className="text-center">
                  Team Members
                </Text>
              </Stack>
            )}
            
            {content.stats.locations && (
              <Stack gap="xs" align="center">
                <Text size="2xl" fw="bold" c="primary">
                  {content.stats.locations}
                </Text>
                <Text size="xs" c="secondary-foreground" className="text-center">
                  Locations
                </Text>
              </Stack>
            )}
            
            {content.stats.departments && (
              <Stack gap="xs" align="center">
                <Text size="2xl" fw="bold" c="primary">
                  {content.stats.departments}
                </Text>
                <Text size="xs" c="secondary-foreground" className="text-center">
                  Departments
                </Text>
              </Stack>
            )}
          </Group>
        )}

        {/* Featured Culture Highlights */}
        <Stack gap="md" className="w-full">
          <Group gap="md" align="center" className="bg-card border rounded-lg" p="md"  data-class="culture-feature">
            <Icon size="lg" lucideIcon={Coffee} c="primary" />
            <Stack gap="xs">
              <Text size="sm" fw="semibold">Remote-First Culture</Text>
              <Text size="xs" c="secondary-foreground">Work from anywhere in the world</Text>
            </Stack>
          </Group>
          
          <Group gap="md" align="center" className="bg-card border rounded-lg" p="md"  data-class="culture-feature">
            <Icon size="lg" lucideIcon={Target} c="primary" />
            <Stack gap="xs">
              <Text size="sm" fw="semibold">Growth Mindset</Text>
              <Text size="xs" c="secondary-foreground">Continuous learning and development</Text>
            </Stack>
          </Group>
          
          <Group gap="md" align="center" className="bg-card border rounded-lg" p="md"  data-class="culture-feature">
            <Icon size="lg" lucideIcon={Users} c="primary" />
            <Stack gap="xs">
              <Text size="sm" fw="semibold">Collaborative Spirit</Text>
              <Text size="xs" c="secondary-foreground">We succeed together as one team</Text>
            </Stack>
          </Group>
        </Stack>
      </Stack>
    )
  }),

  // 5. Departments Overview
  departments: createContentHook({
    content: (content: SplitTeamData) => (
      <Stack gap="xl" align="start">
        <Stack gap="lg">
          <Title order={1} size="4xl" fw="bold">
            {content.title}
          </Title>
          
          {content.description && (
            <Text c="secondary-foreground">
              {content.description}
            </Text>
          )}
        </Stack>

        {/* Department Breakdown */}
        <Stack gap="lg" className="w-full">
          {/* Group members by department */}
          {Array.from(new Set(content.members.map(m => m.department).filter(Boolean))).map((department) => {
            const departmentMembers = content.members.filter(m => m.department === department);
            
            return (
              <Card key={department} p="lg" rounded={theme?.themeRounded.default} shadow="sm" className="bg-card border">
                <Stack gap="md">
                  <Group gap="md" align="center" justify="between">
                    <Title order={3} size="lg" fw="semibold">
                      {department}
                    </Title>
                    <Badge variant="secondary" size={theme?.themeButtonSize.badge} rounded={theme?.themeRounded.badge}>
                      {departmentMembers.length} members
                    </Badge>
                  </Group>
                  
                  <Stack gap="md">
                    {departmentMembers.slice(0, 3).map((member) => (
                      <Group key={member.id} gap="md" align="center">
                        {member.avatar ? (
                          <Image
                            src={member.avatar.src}
                            alt={member.avatar.alt}
                            width="30px"
                            height="30px"
                            fit="cover"
                            rounded="full"
                          />
                        ) : (
                          <Box 
                            className="w-[30px] h-[30px] bg-primary/10 rounded-full flex items-center justify-center"
                            data-class="avatar-placeholder"
                          >
                            <Icon lucideIcon={User} c="primary" />
                          </Box>
                        )}
                        
                        <Stack gap="xs" className="flex-1">
                          <Text size="sm" fw="medium">
                            {member.name}
                          </Text>
                          <Text size="xs" c="secondary-foreground">
                            {member.position}
                          </Text>
                        </Stack>
                      </Group>
                    ))}
                    
                    {departmentMembers.length > 3 && (
                      <Text size="xs" c="secondary-foreground" className="pl-[38px]">
                        +{departmentMembers.length - 3} more members
                      </Text>
                    )}
                  </Stack>
                </Stack>
              </Card>
            );
          })}
        </Stack>
      </Stack>
    )
  })
};

export const SplitTeam = forwardRef<HTMLElement, SplitTeamProps>(
  ({ 
    content, 
    variant = "leadership",
    mediaPosition = "right",
    useContainer = true,
    py = "xl",
    className,
    ...props 
  }, ref) => {
    
    // Choose content hooks based on variant
    const contentHooks = splitTeamContentHooks[variant] || splitTeamContentHooks.leadership;

    // Create media section with team-related visuals
    const createMediaSection = (): React.ReactNode => {
      switch (variant) {
        case "leadership":
          return (
            <Box className="relative h-full w-full bg-gradient-to-br from-primary/20 via-primary/10 to-transparent overflow-hidden flex items-center justify-center" rounded={theme?.themeRounded.default} p="xl" data-class="leadership-media">
              <Stack gap="xl" align="center" className="relative z-10">
                <Box className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
                  <Icon size="lg" lucideIcon={Award} c="primary" />
                </Box>
                <Stack gap="md" align="center">
                  <Text size="lg" fw="semibold" c="primary">
                    Leadership Excellence
                  </Text>
                  <Text size="sm" c="primary" ta="center" className="max-w-xs">
                    Experienced leaders driving innovation and growth
                  </Text>
                </Stack>
              </Stack>
            </Box>
          );

        case "showcase":
          return (
            <Box className="relative h-full w-full bg-gradient-to-br from-blue-500/20 via-green-500/20 to-purple-500/20 overflow-hidden flex items-center justify-center" rounded={theme?.themeRounded.default} p="xl" data-class="showcase-media">
              <Stack gap="lg" align="center" className="relative z-10">
                <Box className="grid grid-cols-2 gap-md max-w-sm">
                  {[Users, Target, Briefcase, Heart].map((LucideIcon, index) => (
                    <Box 
                      key={index}
                      className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center"
                    >
                      <Icon size="lg" lucideIcon={LucideIcon} c="primary-foreground" />
                    </Box>
                  ))}
                </Box>
                <Text size="md" fw="medium" c="primary-foreground" ta="center">
                  Talented professionals working together
                </Text>
              </Stack>
            </Box>
          );

        case "hiring":
          return (
            <Box className="relative h-full w-full bg-gradient-to-br from-green-500/20 via-blue-500/20 to-indigo-500/20 overflow-hidden flex items-center justify-center" rounded={theme?.themeRounded.default} p="xl" data-class="hiring-media">
              <Stack gap="xl" align="center" className="relative z-10">
                <Box className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Icon size="lg" lucideIcon={Briefcase} c="primary-foreground" />
                </Box>
                <Stack gap="md" align="center">
                  <Text size="lg" fw="semibold" c="primary-foreground">
                    Join Our Team
                  </Text>
                  <Text size="sm" c="primary-foreground" ta="center" className="max-w-xs">
                    Exciting opportunities for passionate professionals
                  </Text>
                </Stack>
              </Stack>
            </Box>
          );

        case "culture":
          return (
            <Box className="relative h-full w-full bg-gradient-to-br from-pink-500/20 via-orange-500/20 to-yellow-500/20 overflow-hidden flex items-center justify-center" rounded={theme?.themeRounded.default} p="xl" data-class="culture-media">
              <Stack gap="lg" align="center" className="relative z-10">
                <Box className="grid grid-cols-3 gap-md max-w-md">
                  {[
                    { icon: Heart, label: "Culture" },
                    { icon: Coffee, label: "Remote" },
                    { icon: Users, label: "Team" }
                  ].map((item, index) => (
                    <Stack key={index} gap="md" align="center">
                      <Box className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Icon lucideIcon={item.icon} c="primary-foreground" />
                      </Box>
                      <Text size="xs" c="primary-foreground" ta="center">
                        {item.label}
                      </Text>
                    </Stack>
                  ))}
                </Box>
                <Text size="md" fw="medium" c="primary-foreground" ta="center">
                  Building an amazing workplace culture
                </Text>
              </Stack>
            </Box>
          );

        case "departments":
          return (
            <Box className="relative h-full w-full bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 overflow-hidden flex items-center justify-center" rounded={theme?.themeRounded.default} p="xl" data-class="departments-media">
              <Stack gap="xl" align="center" className="relative z-10">
                <Box className="w-32 h-32 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <Icon size="lg" lucideIcon={Target} c="primary-foreground" />
                </Box>
                <Stack gap="md" align="center">
                  <Text size="lg" fw="semibold" c="primary-foreground">
                    Cross-Functional Teams
                  </Text>
                  <Text size="sm" c="primary-foreground" ta="center" className="max-w-xs">
                    Diverse expertise across all departments
                  </Text>
                </Stack>
              </Stack>
            </Box>
          );

        default:
          return (
            <Box className="relative h-full w-full bg-gradient-to-br from-primary/20 to-transparent flex items-center justify-center" rounded={theme?.themeRounded.default} p="xl" data-class="default-media">
              <Icon size="lg" lucideIcon={Users} c="primary" className="opacity-20" />
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
        className={`min-h-[500px] ${className || ''}`}
        {...props}
      />
    );
  }
);

SplitTeam.displayName = "SplitTeam";

// Export template configurations
export const splitTeamTemplates = {
  leadership: {
    id: "splitTeamLeadership",
    name: "Leadership Team",
    description: "Showcase leadership team with detailed profiles and achievements",
    component: SplitTeam,
    defaultProps: { variant: "leadership" as const }
  },
  
  showcase: {
    id: "splitTeamShowcase", 
    name: "Team Showcase",
    description: "Display team members with skills and social links",
    component: SplitTeam,
    defaultProps: { variant: "showcase" as const }
  },

  hiring: {
    id: "splitTeamHiring",
    name: "Hiring & Recruitment",
    description: "Team section focused on recruitment and open positions",
    component: SplitTeam,
    defaultProps: { variant: "hiring" as const }
  },

  culture: {
    id: "splitTeamCulture",
    name: "Company Culture",
    description: "Highlight company culture and team statistics",
    component: SplitTeam,
    defaultProps: { variant: "culture" as const }
  },

  departments: {
    id: "splitTeamDepartments",
    name: "Departments Overview",
    description: "Organize team members by departments and roles",
    component: SplitTeam,
    defaultProps: { variant: "departments" as const }
  }
};