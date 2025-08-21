import { createElement } from "react";
import type { ReactNode } from "react";
import { GridTeam } from "./GridTeam";
import { SplitTeam } from "./SplitTeam";
import { createBlocksRegistry } from "../registry";
import { Users, User, Linkedin, Twitter, Globe, Mail, Award, Target, Briefcase, MapPin, Star } from "lucide-react";

// Shared team types
export type TeamTypeId = "team.gridteam" | "team.splitteam";

export type TeamVariant = string;

export interface TeamBlockNode {
  id?: string;
  type: TeamTypeId;
  variant?: TeamVariant;
  props?: Record<string, any>;
  slots?: Record<string, TeamBlockNode[] | TeamBlockNode | undefined>;
}

export interface TeamBlockPreset {
  id: string;
  type: TeamTypeId;
  variant?: TeamVariant;
  name: string;
  description?: string;
  props: Record<string, any>;
  version?: number;
}

export interface TeamBlockDefinition {
  type: TeamTypeId;
  name: string;
  variants: TeamVariant[];
  render: (node: TeamBlockNode, renderedSlots?: Record<string, ReactNode>) => ReactNode;
  presets?: TeamBlockPreset[];
  version?: number;
  migrate?: (props: Record<string, any>, fromVersion: number) => Record<string, any>;
}

// Intentionally no per-domain registry implementation.
// Use the common createBlocksRegistry and register team definitions via helpers below.

// ===== Presets (kept close to team code) =====

const gridTeamPresets: TeamBlockPreset[] = [
  {
    id: "preset:team.gridteam:default:leadership-team",
    type: "team.gridteam",
    variant: "default",
    name: "Leadership Team",
    description: "Grid layout showcasing company leadership and team members",
    props: {
      content: {
        badge: "Our Team",
        title: "Meet the People Behind Our Success",
        description: "Our diverse team of passionate professionals brings together years of experience and innovative thinking to deliver exceptional results for our clients.",
        buttonText: "Join Our Team",
        members: [
          {
            id: "1",
            name: "Sarah Mitchell",
            role: "Chief Executive Officer",
            bio: "Visionary leader with 15+ years in tech strategy and business development. Previously led successful exits at two SaaS companies.",
            avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            social: {
              linkedin: "https://linkedin.com/in/sarah-mitchell",
              twitter: "https://twitter.com/sarahmitchell"
            },
            skills: ["Strategy", "Leadership", "Business Development"],
            achievements: ["15+ years experience", "2 successful exits", "Forbes 30 under 30"]
          },
          {
            id: "2",
            name: "Alex Rodriguez",
            role: "Chief Technology Officer",
            bio: "Full-stack architect specializing in scalable systems and cloud infrastructure. Open source contributor and tech conference speaker.",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            social: {
              linkedin: "https://linkedin.com/in/alex-rodriguez",
              github: "https://github.com/alexrodriguez"
            },
            skills: ["Full-Stack Development", "System Architecture", "Cloud Infrastructure"],
            achievements: ["10+ years development", "Open source maintainer", "Tech speaker"]
          },
          {
            id: "3",
            name: "Emma Davis",
            role: "Head of Design",
            bio: "Award-winning UX designer with a passion for creating delightful user experiences. Led design teams at top digital agencies.",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            social: {
              linkedin: "https://linkedin.com/in/emma-davis",
              behance: "https://behance.net/emmadavis"
            },
            skills: ["UX Design", "Product Design", "Design Systems"],
            achievements: ["Red Dot Award winner", "12+ years design", "Published author"]
          },
          {
            id: "4",
            name: "Michael Chen",
            role: "VP of Engineering",
            bio: "Engineering leader focused on building high-performance teams and scalable products. Previously at Google and Microsoft.",
            avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            social: {
              linkedin: "https://linkedin.com/in/michael-chen"
            },
            skills: ["Engineering Leadership", "Team Building", "Product Development"],
            achievements: ["Google alum", "Microsoft veteran", "Mentor & advisor"]
          },
          {
            id: "5",
            name: "Lisa Wang",
            role: "Head of Marketing",
            bio: "Growth marketing expert with proven track record in B2B SaaS. Led marketing teams that drove 10x growth at previous companies.",
            avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            social: {
              linkedin: "https://linkedin.com/in/lisa-wang",
              twitter: "https://twitter.com/lisawang"
            },
            skills: ["Growth Marketing", "B2B SaaS", "Content Strategy"],
            achievements: ["10x growth specialist", "Marketing leader", "Industry speaker"]
          },
          {
            id: "6",
            name: "David Kim",
            role: "VP of Sales",
            bio: "Enterprise sales leader with expertise in closing complex deals and building strategic partnerships.",
            avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
            social: {
              linkedin: "https://linkedin.com/in/david-kim"
            },
            skills: ["Enterprise Sales", "Strategic Partnerships", "Negotiation"],
            achievements: ["$50M+ in deals", "Sales excellence", "Team leadership"]
          }
        ]
      },
      useContainer: true,
      cols: "1-2-3"
    },
    version: 1
  }
];

const splitTeamPresets: TeamBlockPreset[] = [
  {
    id: "preset:team.splitteam:leadership:executive-team",
    type: "team.splitteam",
    variant: "leadership",
    name: "Executive Team",
    description: "Split layout highlighting executive leadership team",
    props: {
      content: {
        badge: "Leadership",
        title: "Visionary Leaders Driving Innovation",
        description: "Our executive team combines decades of experience with fresh perspectives to guide our company toward continued success and innovation.",
        primaryButtonText: "Meet the Full Team",
        secondaryButtonText: "Our Values",
        featuredMember: {
          name: "Sarah Mitchell",
          role: "Chief Executive Officer",
          bio: "Sarah brings over 15 years of experience in scaling technology companies. Her vision and leadership have been instrumental in our growth from startup to industry leader. She holds an MBA from Stanford and previously led successful exits at two SaaS companies.",
          avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5bc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
          social: {
            linkedin: "https://linkedin.com/in/sarah-mitchell",
            twitter: "https://twitter.com/sarahmitchell"
          },
          achievements: [
            "15+ years in tech leadership",
            "Led 2 successful company exits",
            "Stanford MBA",
            "Forbes 30 under 30"
          ],
          skills: ["Strategic Planning", "Business Development", "Team Leadership"]
        },
        teamStats: [
          {
            id: "1",
            value: "15+",
            label: "Years Experience",
            description: "Combined leadership experience"
          },
          {
            id: "2",
            value: "3",
            label: "Companies Founded",
            description: "Successful ventures launched"
          },
          {
            id: "3",
            value: "50+",
            label: "Team Members",
            description: "Growing our talented team"
          }
        ],
        otherMembers: [
          {
            id: "1",
            name: "Alex Rodriguez",
            role: "Chief Technology Officer",
            bio: "Technical visionary leading our engineering excellence",
            avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
          },
          {
            id: "2",
            name: "Emma Davis",
            role: "Head of Design",
            bio: "Creative director shaping our product experience",
            avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
          }
        ]
      },
      useContainer: true,
      leftMedia: true
    },
    version: 1
  }
];

// ===== Definitions =====

const gridTeamDef: TeamBlockDefinition = {
  type: "team.gridteam",
  name: "Grid Team",
  variants: ["default", "detailed", "minimal"],
  version: 1,
  render: (node, renderedSlots) => {
    const { props = {}, variant } = node;
    return createElement(GridTeam as any, {
      variant: (variant as any) || "default",
      ...props
    });
  },
  presets: gridTeamPresets
};

const splitTeamDef: TeamBlockDefinition = {
  type: "team.splitteam",
  name: "Split Team",
  variants: ["leadership", "detailed", "minimal"],
  version: 1,
  render: (node) => {
    const { props = {}, variant } = node;
    return createElement(SplitTeam as any, {
      variant: (variant as any) || "leadership",
      ...props
    });
  },
  presets: splitTeamPresets
};

export const registerTeamBlocks = (registry: ReturnType<typeof createBlocksRegistry>) => {
  registry.register(gridTeamDef as any);
  registry.register(splitTeamDef as any);
  return registry;
};

export const createTeamRegistry = () => {
  const r = createBlocksRegistry();
  return registerTeamBlocks(r);
};
