import { FeaturesGridMediaCards } from "@ui8kit/blocks/features/FeaturesGridMediaCards";
import { FeaturesSplitLeftMedia } from "@ui8kit/blocks/features/FeaturesSplitLeftMedia";
import { FeaturesSplitMedia } from "@ui8kit/blocks/features/FeaturesSplitMedia";
import { FeaturesThreeColumns } from "@ui8kit/blocks/features/FeaturesThreeColumns";
import { FeaturesThreeColumnsIcons } from "@ui8kit/blocks/features/FeaturesThreeColumnsIcons";

const featuresGridMediaContent = {
  badge: "Features",
  title: "Everything you need to succeed",
  description: "Our comprehensive platform provides all the tools and features you need to build amazing products.",
  features: [
    {
      id: "feature1",
      title: "Lightning Fast",
      description: "Built for speed and performance with optimized code and efficient architecture.",
      image: {
        src: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Fast Performance"
      },
      iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' /></svg>`
    },
    {
      id: "feature2",
      title: "Secure by Default",
      description: "Enterprise-grade security with encryption and compliance built-in from the ground up.",
      image: {
        src: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Security"
      },
      iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' /></svg>`
    },
    {
      id: "feature3",
      title: "Easy Integration",
      description: "Simple APIs and comprehensive documentation make integration a breeze for any team.",
      image: {
        src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        alt: "Integration"
      },
      iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244' /></svg>`
    }
  ]
};

const featuresSplitMediaContent = {
  badge: "Features",
  title: "Powerful features for modern development",
  description: "Everything you need to build amazing products with confidence and speed.",
  image: {
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    alt: "Features"
  },
  features: [
    {
      id: "feature1",
      title: "Fast Development",
      description: "Build faster with our optimized components and tools.",
      iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' /></svg>`
    },
    {
      id: "feature2",
      title: "Secure",
      description: "Enterprise-grade security built into every component.",
      iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' /></svg>`
    }
  ]
};

const featuresSplitLeftMediaContent = {
  badge: "Features",
  title: "Advanced capabilities",
  description: "Discover powerful features designed to enhance your workflow and productivity.",
  image: {
    src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    alt: "Advanced Features"
  },
  features: [
    {
      id: "feature1",
      title: "Real-time Analytics",
      description: "Monitor performance with live data and insights.",
      iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 010 0L21.75 9M21.75 9H15M21.75 9v6.75' /></svg>`
    },
    {
      id: "feature2",
      title: "Team Collaboration",
      description: "Work together seamlessly with built-in collaboration tools.",
      iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z' /></svg>`
    }
  ]
};

const featuresThreeColumnsContent = {
  badge: "Features",
  title: "Why choose our platform",
  description: "Discover the key benefits that make our solution the right choice for your business.",
  features: [
    {
      id: "feature1",
      title: "Easy to Use",
      description: "Intuitive interface designed for users of all skill levels."
    },
    {
      id: "feature2",
      title: "Reliable",
      description: "99.9% uptime guarantee with enterprise-grade infrastructure."
    },
    {
      id: "feature3",
      title: "Scalable",
      description: "Grows with your business from startup to enterprise scale."
    }
  ]
};

const featuresThreeColumnsIconsContent = {
  badge: "Features",
  title: "Built for developers",
  description: "Everything you need to build modern applications with confidence.",
  features: [
    {
      id: "feature1",
      title: "Developer-First",
      description: "Built by developers, for developers with best practices in mind.",
      iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5' /></svg>`
    },
    {
      id: "feature2",
      title: "Type Safe",
      description: "Full TypeScript support with comprehensive type definitions.",
      iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.623 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' /></svg>`
    },
    {
      id: "feature3",
      title: "Modern Stack",
      description: "Built with the latest technologies and frameworks.",
      iconSvg: `<svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'><path stroke-linecap='round' stroke-linejoin='round' d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' /></svg>`
    }
  ]
};

function FeaturesBlocks() {
  return (
    <div>
      <FeaturesGridMediaCards content={featuresGridMediaContent} />
      <FeaturesSplitLeftMedia content={featuresSplitLeftMediaContent} />
      <FeaturesSplitMedia content={featuresSplitMediaContent} />
      <FeaturesThreeColumns content={featuresThreeColumnsContent} />
      <FeaturesThreeColumnsIcons content={featuresThreeColumnsIconsContent} />
    </div>
  );
}

export default FeaturesBlocks;