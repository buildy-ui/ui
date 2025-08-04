import { forwardRef } from "react";
import { Block, Grid, Image } from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";
import type { HeroMediaProps } from "../types";

const theme = skyOSTheme;

export const HeroMedia = forwardRef<HTMLDivElement, HeroMediaProps>(
  ({ src, alt, images, variant = "single", ...props }, ref) => {
    // Gallery variant with multiple images
    if (variant === "gallery" && images && images.length > 0) {
      return (
        <Grid
          ref={ref}
          cols="1-2"
          gap="md"
          {...props}
        >
          {images.map((image, index) => (
            <Block
              key={image.id}
              style={index === 0 ? { gridRowEnd: "span 2" } : undefined}
            >
              <Image
                src={image.src}
                alt={image.alt}
                width="100%"
                height="100%"
                fit="cover"
                rounded={theme.rounded.default}
                style={{ height: "100%", width: "100%" }}
              />
            </Block>
          ))}
        </Grid>
      );
    }

    // Single image variant
    if (src && alt) {
      return (
        <Block ref={ref} {...props}>
          <Image
            src={src}
            alt={alt}
            width="100%"
            height="auto"
            fit="cover"
            rounded={theme.rounded.default}
            shadow="2xl"
          />
        </Block>
      );
    }

    // Fallback - empty placeholder
    return (
      <Block
        ref={ref}
        bg="muted"
        rounded="lg"
        style={{ height: "16rem" }}
        {...props}
      >
        <div style={{ width: "100%", height: "100%" }} />
      </Block>
    );
  }
);

HeroMedia.displayName = "HeroMedia";