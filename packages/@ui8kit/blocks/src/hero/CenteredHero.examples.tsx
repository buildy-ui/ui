import { Info, Rocket, Play, ArrowRight, Heart } from "lucide-react";
import { CenteredHero, type CenteredHeroData } from "./CenteredHero";

// ===== CENTERED HERO EXAMPLES =====

// 1. Simple centered hero
export const CenteredHeroSimpleExample = () => {
  const content: CenteredHeroData = {
    badge: "Welcome",
    title: "The future of work is here",
    description: "Transform the way your team collaborates with our innovative platform. Built for modern teams who demand flexibility, security, and performance.",
    primaryButtonText: "Get Started Free",
    secondaryButtonText: "Watch Demo",
    primaryButtonIcon: Rocket,
    secondaryButtonIcon: Play
  };

  return (
    <div className="w-full relative">
  {/* Radial Gradient Background */}
  <div
    className="absolute inset-0 z-0 bg-gradient-to-t from-primary/10 to-secondary/10"
  />
    <CenteredHero
      content={content}
      variant="simple"
      useContainer={true}
      className="relative z-10"
    />
    </div>
  );
};

// 2. Centered hero with top button
export const CenteredHeroWithTopButtonExample = () => {
  const content: CenteredHeroData = {
    topButton: {
      text: "✨ New: AI-powered automation is here",
      href: "#"
    },
    badge: "AI Innovation",
    title: "Automate your workflow with intelligent AI",
    description: "Discover how artificial intelligence can streamline your processes, reduce manual work, and help your team focus on what matters most.",
    primaryButtonText: "Try AI Features",
    secondaryButtonText: "Learn More",
    primaryButtonIcon: Info,
    secondaryButtonIcon: Rocket
  };

  return (
    <CenteredHero
      content={content}
      variant="withTopButton"
      useContainer={true}
    />
  );
};

// 3. Centered hero with image
export const CenteredHeroWithImageExample = () => {
  const content: CenteredHeroData = {
    title: "Experience the power of visual storytelling",
    description: "Create compelling narratives that resonate with your audience. Our platform provides all the tools you need to craft beautiful, engaging content that drives results.",
    imageUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Visual storytelling dashboard",
    primaryButtonText: "Start Creating",
    secondaryButtonText: "Watch Tutorial"
  };

  return (
<div data-class="centered-hero-background" className="w-full bg-background dark:bg-secondary/5 relative">
  {/* Bottom Fade Grid Background */}
  <div
  data-class="centered-hero-background-grid"
    className="absolute inset-0 z-0 
               [background-image:linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)]
               dark:[background-image:linear-gradient(to_right,rgba(71,85,105,0.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(71,85,105,0.4)_1px,transparent_1px)]"
    style={{
      backgroundSize: "20px 30px",
      WebkitMaskImage:
        "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)",
      maskImage:
        "radial-gradient(ellipse 70% 60% at 50% 100%, #000 60%, transparent 100%)"
    }}
  />
    <CenteredHero
      content={content}
      variant="withImage"
      useContainer={true}
      data-class="centered-hero-content"
      className="relative z-10"
    />
</div>
  );
};

// 4. Centered hero with stats
export const CenteredHeroWithStatsExample = () => {
  const content: CenteredHeroData = {
    badge: "Trusted Globally",
    title: "Join millions who trust our platform",
    description: "Our growing community of users worldwide relies on our platform to achieve their goals. See why businesses of all sizes choose us as their trusted partner.",
    stats: [
      {
        id: "1",
        value: "2M+",
        label: "Active Users"
      },
      {
        id: "2",
        value: "150+",
        label: "Countries"
      },
      {
        id: "3",
        value: "99.9%",
        label: "Uptime"
      },
      {
        id: "4",
        value: "24/7",
        label: "Support"
      }
    ],
    primaryButtonText: "Join Community",
    secondaryButtonText: "View Testimonials",
    primaryButtonIcon: ArrowRight
  };

  return (
    <CenteredHero
      content={content}
      variant="withStats"
      useContainer={true}
    />
  );
};

// 5. Mission-focused centered hero
export const CenteredHeroMissionExample = () => {
  const content: CenteredHeroData = {
    badge: "Our Mission",
    title: "Building technology that brings people together",
    description: "We believe technology should connect us, not divide us. Our mission is to create tools that foster collaboration, understanding, and positive change in the world.",
    stats: [
      {
        id: "1",
        value: "50M+",
        label: "Connections Made"
      },
      {
        id: "2",
        value: "195",
        label: "Countries Reached"
      },
      {
        id: "3",
        value: "1B+",
        label: "Messages Sent"
      }
    ],
    primaryButtonText: "Join Our Mission",
    secondaryButtonText: "Read Our Story",
    primaryButtonIcon: Heart
  };

  return (
    <CenteredHero
      content={content}
      variant="withStats"
      useContainer={true}
      className="bg-gradient-to-t from-primary/10 to-secondary/15"
    />
  );
};

// Export all examples
export const centeredHeroExamples = {
  simple: CenteredHeroSimpleExample,
  withTopButton: CenteredHeroWithTopButtonExample,
  withImage: CenteredHeroWithImageExample,
  withStats: CenteredHeroWithStatsExample,
  mission: CenteredHeroMissionExample
};