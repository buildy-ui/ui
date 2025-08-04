import { forwardRef } from "react";
import { Block, Grid, Image } from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";
import type { HeroMediaProps } from "../types";

const theme = skyOSTheme;

export const HeroMedia = forwardRef<HTMLDivElement, HeroMediaProps>(
  ({ src, alt, images, variant = "single", className, ...props }, ref) => {
    // Gallery variant with multiple images
    if (variant === "gallery" && images && images.length > 0) {
      return (
        <Grid
          ref={ref}
          cols="1-2"
          gap="md"
          className={className}
          {...props}
        >
          {images.map((image, index) => (
            <Block
              key={image.id}
              className={index === 0 ? "row-span-2" : ""}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width="100%"
                height="100%"
                fit="cover"
                rounded={theme.rounded.default}
                className="h-full w-full"
              />
            </Block>
          ))}
        </Grid>
      );
    }

    // Single image variant
    if (src && alt) {
      return (
        <Block ref={ref} className={className} {...props}>
          <Image
            src={src}
            alt={alt}
            width="100%"
            height="auto"
            fit="cover"
            rounded={theme.rounded.default}
            className="shadow-2xl"
          />
        </Block>
      );
    }

    // Fallback - empty placeholder
    return (
      <Block
        ref={ref}
        className={`bg-muted rounded-lg h-64 ${className || ""}`}
        {...props}
      />
    );
  }
);

HeroMedia.displayName = "HeroMedia";