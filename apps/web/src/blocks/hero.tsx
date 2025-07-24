import { HeroBlock } from "@ui8kit/blocks/hero/HeroBlock";
import { HeroWithImageSection, heroWithImageSectionTemplate } from "@ui8kit/blocks/hero/HeroWithImageSection";
import { HeroCenteredSection } from "@ui8kit/blocks/hero/HeroCenteredSection";
import { HeroCenteredWithTopButton } from "@ui8kit/blocks/hero/HeroCenteredWithTopButton";
import { HeroSplitWithMedia } from "@ui8kit/blocks/hero/HeroSplitWithMedia";
import { HeroSplitWithGallery } from "@ui8kit/blocks/hero/HeroSplitWithGallery";

const heroBlockContent = {
  title: "BuildY",
  subtitle: "BuildY is a platform for building amazing products.",
  buttonText: "Get Started",
  learnMoreText: "Learn More",
  backgroundImage: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
};

const heroCenteredContent = {
  badge: "Start Now",
  title: "Explore Our BuildY!",
  description: "Simplify your business operations with our cutting-edge solution.",
  primaryButtonText: "Learn More",
  secondaryButtonText: "Get Started"
};

const heroWithTopButtonContent = {
  topButton: {
    text: "Announcing our next round of funding",
    href: "#"
  },
  badge: "New Release",
  title: "Build Amazing Products",
  description: "Create stunning applications with our powerful tools and components.",
  primaryButtonText: "Get Started",
  secondaryButtonText: "Learn More"
};

const heroSplitMediaContent = {
  badge: "New Feature",
  title: "Transform Your Workflow",
  description: "Streamline your development process with our powerful tools and components.",
  primaryButtonText: "Try Now",
  secondaryButtonText: "View Demo",
  image: {
    src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    alt: "Hero Image"
  }
};

const heroGalleryContent = {
  badge: "We're building",
  title: "Build with modern components",
  description: "Beautifully designed components built with the latest technologies.",
  primaryButtonText: "Documentation",
  secondaryButtonText: "GitHub",
  images: [
    {
      id: "image1",
      src: "https://images.unsplash.com/photo-1618477247222-acbdb0e159b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Gallery Image 1"
    },
    {
      id: "image2", 
      src: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
      alt: "Gallery Image 2"
    },
    {
      id: "image3",
      src: "https://images.unsplash.com/photo-1618477202872-89cec7957b09?ixlib=rb-4.0.3&auto=format&fit=crop&w=320&q=80",
      alt: "Gallery Image 3"
    }
  ]
};

function HeroBlocks() {
  return (
    <div>
      <HeroBlock content={heroBlockContent} />
      <HeroWithImageSection content={heroWithImageSectionTemplate.defaultContent} />
      <HeroCenteredSection content={heroCenteredContent} />
      <HeroCenteredWithTopButton content={heroWithTopButtonContent} />
      <HeroSplitWithMedia content={heroSplitMediaContent} />
      <HeroSplitWithGallery content={heroGalleryContent} />
    </div>
  );
}

export default HeroBlocks;