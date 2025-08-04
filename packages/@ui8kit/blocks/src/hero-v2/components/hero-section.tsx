import { forwardRef } from "react";
import { Block, Container, Stack, Grid } from "@ui8kit/core";
import type { HeroSectionProps } from "../types";

export const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  ({ children, layout = "split", ...props }, ref) => {
    const containerContent = layout === "split" ? (
      <Grid cols="1-2" gap="xl" align="center">
        {children}
      </Grid>
    ) : (
      <Stack gap="xl" align="center" ta="center" style={{ maxWidth: "56rem", margin: "0 auto" }}>
        {children}
      </Stack>
    );

    return (
      <Block
        ref={ref}
        component="section"
        w="full"
        py="xl"
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