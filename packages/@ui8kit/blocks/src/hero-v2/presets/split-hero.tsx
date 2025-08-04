import { forwardRef, useMemo } from "react";
import { Info, Rocket } from "lucide-react";
import { HeroSection } from "../components/hero-section";
import { HeroContent } from "../components/hero-content";
import { HeroMedia } from "../components/hero-media";
import { HeroBadge } from "../ui/hero-badge";
import { HeroTitle } from "../ui/hero-title";
import { HeroDescription } from "../ui/hero-description";
import { HeroActions } from "../ui/hero-actions";
import { HeroButton } from "../ui/hero-button";
import { heroContent } from "../content";
import type { HeroData } from "../types";

interface SplitHeroProps {
  content?: Partial<HeroData>;
  variant?: "media" | "leftMedia" | "gallery";
}

export const SplitHero = forwardRef<HTMLElement, SplitHeroProps>(
  ({ content = {}, variant = "media", ...props }, ref) => {
    // Get default content based on variant
    const defaultContent = useMemo(() => {
      switch (variant) {
        case "leftMedia":
          return heroContent.splitLeftMedia;
        case "gallery":
          return heroContent.splitGallery;
        default:
          return heroContent.splitMedia;
      }
    }, [variant]);

    // Merge content: user content over defaults
    const mergedContent = useMemo(() => {
      if (Object.keys(content).length > 0) {
        return {
          ...content,
          title: content.title || "Untitled",
          description: content.description || "No description provided"
        };
      }
      return defaultContent;
    }, [content, defaultContent]);

    const mediaVariant = (mergedContent as any).images ? "gallery" : "single";
    const isLeftMedia = variant === "leftMedia";

    return (
      <HeroSection ref={ref} layout="split" {...props}>
        {/* Conditionally render media first for left layout */}
        {isLeftMedia && (
          <HeroMedia
            src={(mergedContent as any).image?.src}
            alt={(mergedContent as any).image?.alt}
            images={(mergedContent as any).images}
            variant={mediaVariant}
          />
        )}
        
        <HeroContent>
          {mergedContent.badge && (
            <HeroBadge>{mergedContent.badge}</HeroBadge>
          )}
          
          <HeroTitle>{mergedContent.title}</HeroTitle>
          
          <HeroDescription>{mergedContent.description}</HeroDescription>
          
          {(mergedContent.primaryButtonText || mergedContent.secondaryButtonText) && (
            <HeroActions>
              {mergedContent.primaryButtonText && (
                <HeroButton 
                  variant="default"
                  icon={(mergedContent as any).primaryButtonIcon ?? Rocket}
                >
                  {mergedContent.primaryButtonText}
                </HeroButton>
              )}
              {mergedContent.secondaryButtonText && (
                <HeroButton 
                  variant="outline"
                  icon={(mergedContent as any).secondaryButtonIcon ?? Info}
                >
                  {mergedContent.secondaryButtonText}
                </HeroButton>
              )}
            </HeroActions>
          )}
        </HeroContent>
        
        {/* Render media second for normal layout */}
        {!isLeftMedia && (
          <HeroMedia
            src={(mergedContent as any).image?.src}
            alt={(mergedContent as any).image?.alt}
            images={(mergedContent as any).images}
            variant={mediaVariant}
          />
        )}
      </HeroSection>
    );
  }
);

SplitHero.displayName = "SplitHero";