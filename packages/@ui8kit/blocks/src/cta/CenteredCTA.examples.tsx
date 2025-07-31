import { 
  ArrowRight, 
  Play, 
 
  ExternalLink, 
  Star, 
  Rocket, 
  Globe, 
  Heart,
  Zap,
  Shield,
  Users,
  CheckCircle,
  Award,
  TrendingUp
} from "lucide-react";
import { CenteredCTA, type CenteredCTAData } from "./CenteredCTA";

// Example 1: Simple Centered CTA
const simpleCTAData: CenteredCTAData = {
  badge: "New Release",
  title: "Transform Your Business Today",
  description: "Join thousands of companies already using our platform to streamline operations, increase productivity, and drive growth.",
  buttons: [
    {
      id: "get-started",
      text: "Get Started Free",
      variant: "default",
      lucideIcon: ArrowRight
    },
    {
      id: "watch-demo",
      text: "Watch Demo",
      variant: "outline",
      lucideIcon: Play
    }
  ]
};

export const SimpleCenteredCTAExample = () => (
  <CenteredCTA 
    content={simpleCTAData} 
    variant="simple"
    py="xl"
  />
);

// Example 2: CTA with Brand Logos
const ctaWithLogosData: CenteredCTAData = {
  title: "Trusted by Industry Leaders",
  description: "Join the companies that have already transformed their business with our innovative solutions.",
  buttons: [
    {
      id: "start-trial",
      text: "Start Free Trial",
      variant: "default",
      lucideIcon: Rocket
    },
    {
      id: "contact-sales",
      text: "Contact Sales",
      variant: "outline"
    }
  ],
  brands: [
    {
      id: "tech-corp",
      name: "TechCorp",
      lucideIcon: Zap
    },
    {
      id: "global-inc",
      name: "GlobalInc",
      lucideIcon: Globe
    },
    {
      id: "shield-security",
      name: "ShieldSec",
      lucideIcon: Shield
    },
    {
      id: "heart-health",
      name: "HealthCare+",
      lucideIcon: Heart
    },
    {
      id: "star-systems",
      name: "StarSystems",
      lucideIcon: Star
    },
    {
      id: "rocket-labs",
      name: "RocketLabs",
      lucideIcon: Rocket
    }
  ]
};

export const CTAWithLogosExample = () => (
  <CenteredCTA 
    content={ctaWithLogosData} 
    variant="withLogos"
    py="xl"
  />
);

// Example 3: CTA with Background
const ctaWithBackgroundData: CenteredCTAData = {
  badge: "Limited Time",
  title: "Ready to Scale Your Success?",
  description: "Don't let another opportunity pass by. Start your journey to exponential growth with our proven platform.",
  buttons: [
    {
      id: "claim-offer",
      text: "Claim Your Spot",
      variant: "default",
      lucideIcon: Award
    },
    {
      id: "learn-more",
      text: "Learn More",
      variant: "outline",
      lucideIcon: ExternalLink
    }
  ],
  backgroundImage: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop",
  gradient: "bg-gradient-to-br from-blue-600 to-purple-700"
};

export const CTAWithBackgroundExample = () => (
  <CenteredCTA 
    content={ctaWithBackgroundData} 
    variant="withBackground"
    py="xl"
  />
);

// Example 4: CTA with Features
const ctaWithFeaturesData: CenteredCTAData = {
  title: "Everything You Need to Succeed",
  description: "Our comprehensive platform provides all the tools and features your business needs to thrive in today's competitive market.",
  buttons: [
    {
      id: "explore-features",
      text: "Explore Features",
      variant: "default",
      lucideIcon: Rocket
    },
    {
      id: "get-demo",
      text: "Get Demo",
      variant: "outline",
      lucideIcon: Play
    }
  ],
  features: [
    {
      id: "analytics",
      title: "Advanced Analytics",
      description: "Deep insights into your business performance",
      lucideIcon: TrendingUp
    },
    {
      id: "security",
      title: "Enterprise Security",
      description: "Bank-level security for your data",
      lucideIcon: Shield
    },
    {
      id: "support",
      title: "24/7 Support",
      description: "Round-the-clock expert assistance",
      lucideIcon: Users
    },
    {
      id: "integration",
      title: "Easy Integration",
      description: "Seamless connection with your existing tools",
      lucideIcon: Zap
    },
    {
      id: "scalability",
      title: "Infinite Scalability",
      description: "Grows with your business needs",
      lucideIcon: Rocket
    },
    {
      id: "reliability",
      title: "99.9% Uptime",
      description: "Reliable performance you can count on",
      lucideIcon: CheckCircle
    }
  ]
};

export const CTAWithFeaturesExample = () => (
  <CenteredCTA 
    content={ctaWithFeaturesData} 
    variant="withFeatures"
    py="xl"
  />
);

// Example 5: CTA with Statistics
const ctaWithStatsData: CenteredCTAData = {
  badge: "Proven Results",
  title: "Join the Success Story",
  description: "See why thousands of businesses choose our platform to accelerate their growth and achieve remarkable results.",
  buttons: [
    {
      id: "join-now",
      text: "Join Now",
      variant: "default",
      lucideIcon: ArrowRight
    },
    {
      id: "view-case-studies",
      text: "View Case Studies",
      variant: "outline",
      lucideIcon: ExternalLink
    }
  ],
  stats: {
    users: "50K+",
    rating: "4.9",
    downloads: "1M+"
  }
};

export const CTAWithStatsExample = () => (
  <CenteredCTA 
    content={ctaWithStatsData} 
    variant="withStats"
    py="xl"
  />
);

// Export all examples
export const centeredCTAExamples = {
  simple: SimpleCenteredCTAExample,
  withLogos: CTAWithLogosExample,
  withBackground: CTAWithBackgroundExample,
  withFeatures: CTAWithFeaturesExample,
  withStats: CTAWithStatsExample
};