import * as React from "react";
import { Block, Stack, Group, Title, Text, Button, Icon } from "@ui8kit/core";
import { Info, Rocket } from "lucide-react";
import { skyOSTheme } from "@ui8kit/theme";
const currentTheme = skyOSTheme;
const theme = { theme: currentTheme, themeRounded: currentTheme.rounded, themeButtonSize: currentTheme.buttonSize };

export interface CenteredHeroData { [key: string]: any }

export interface CenteredHeroProps extends React.HTMLAttributes<HTMLElement> {
  content?: CenteredHeroData;
}

export const CenteredHero = React.forwardRef<HTMLElement, CenteredHeroProps>(({ content, ...props }, ref) => {
  return (
        <Block data-class="centered-hero">
      <Stack data-class="centered-hero-stack">
        <Title data-class="centered-hero-title">
          {content?.title ?? null}

        </Title>
        <Text data-class="centered-hero-description">
          {content?.description ?? null}

        </Text>
        <Group data-class="centered-hero-actions">
          <Button data-class="centered-hero-primary">
            {content?.primaryButtonText ? (<><Icon c="primary-foreground" lucideIcon={Info} /> {content?.primaryButtonText}</>) : null}

          </Button>
          <Button data-class="centered-hero-secondary">
            {content?.secondaryButtonText ? (<><Icon lucideIcon={Rocket} /> {content?.secondaryButtonText}</>) : null}

          </Button>
        </Group>
      </Stack>
    </Block>
  );
});
CenteredHero.displayName = "CenteredHero";
