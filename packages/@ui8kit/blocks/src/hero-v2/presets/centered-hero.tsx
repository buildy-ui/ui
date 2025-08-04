import { forwardRef, useMemo } from "react";
import { ArrowRight, Play } from "lucide-react";
import { HeroSection } from "../components/hero-section";
import { HeroContent } from "../components/hero-content";
import { HeroMedia } from "../components/hero-media";
import { HeroBadge } from "../ui/hero-badge";
import { HeroTitle } from "../ui/hero-title";
import { HeroDescription } from "../ui/hero-description";
import { HeroActions } from "../ui/hero-actions";
import { HeroButton } from "../ui/hero-button";
import { HeroStats } from "../ui/hero-stats";
import { heroContent } from "../content";
import type { HeroData } from "../types";

interface CenteredHeroProps {
  content?: Partial<HeroData>;
  variant?: "simple" | "withImage" | "withStats";
}

export const CenteredHero = forwardRef<HTMLElement, CenteredHeroProps>(
  ({ content = {}, variant = "simple", ...props }, ref) => {
    // Get default content based on variant
    const defaultContent = useMemo(() => {
      switch (variant) {
        case "withStats":
          return heroContent.centeredWithStats;
        default:
          return heroContent.centeredSimple;
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

    return (
      <HeroSection ref={ref} layout="centered" {...props}>
        <HeroContent align="center">
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
                  icon={(mergedContent as any).primaryButtonIcon ?? ArrowRight}
                >
                  {mergedContent.primaryButtonText}
                </HeroButton>
              )}
              {mergedContent.secondaryButtonText && (
                <HeroButton 
                  variant="outline"
                  icon={(mergedContent as any).secondaryButtonIcon ?? Play}
                >
                  {mergedContent.secondaryButtonText}
                </HeroButton>
              )}
            </HeroActions>
          )}
        </HeroContent>
        
        {/* Optional image */}
        {variant === "withImage" && ((mergedContent as any).imageUrl ?? (mergedContent as any).image) && (
          <HeroMedia
            src={(mergedContent as any).imageUrl ?? (mergedContent as any).image?.src}
            alt={(mergedContent as any).imageAlt ?? (mergedContent as any).image?.alt}
          />
        )}
        
        {/* Optional stats */}
        {variant === "withStats" && (mergedContent as any).stats && (
          <HeroStats stats={(mergedContent as any).stats} />
        )}
      </HeroSection>
    );
  }
);

CenteredHero.displayName = "CenteredHero";