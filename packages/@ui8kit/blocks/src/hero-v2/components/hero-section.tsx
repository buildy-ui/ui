import { forwardRef } from "react";
import { Block, Container, Stack, Grid } from "@ui8kit/core";
import type { HeroSectionProps } from "../types";

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  ({ children, layout = "split", className, ...props }, ref) => {
    const containerContent = layout === "split" ? (
      <Grid cols="1-2" gap="xl" align="center">
        {children}
      </Grid>
    ) : (
      <Stack gap="xl" align="center" ta="center" className="max-w-4xl mx-auto">
        {children}
      </Stack>
    );

    return (
      <Block
        ref={ref}
        component="section"
        w="full"
        py="xl"
        className={className}
        {...props}
      >
        <Container size="lg" px="md" centered>
          {containerContent}
        </Container>
      </Block>
    );
  }
);

HeroSection.displayName = "HeroSection";