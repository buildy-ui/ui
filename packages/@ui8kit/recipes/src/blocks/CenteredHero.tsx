import * as React from "react";
import { Block, Stack, Group, Title, Text, Button, Icon } from "@ui8kit/core";
import { Info, Rocket } from "lucide-react";
import { skyOSTheme } from "@ui8kit/theme";
const currentTheme = skyOSTheme;
const theme = { theme: currentTheme, themeRounded: currentTheme.rounded, themeButtonSize: currentTheme.buttonSize };

export interface CenteredHeroData { [key: string]: any }

export interface CenteredHeroProps extends Omit<React.HTMLAttributes<HTMLElement>, 'content'> {
  content?: CenteredHeroData;
  py?: any;
}

export const CenteredHero = React.forwardRef<HTMLElement, CenteredHeroProps>(({ content, py = "lg", ...props }, ref) => {
  return (
            <Block data-class="centered-hero" w="full" component="section">
        <Stack data-class="centered-hero-stack" gap="xl" align="center" ta="center">
          <Title data-class="centered-hero-title" order={1} size="5xl" fw="bold" ta="center">
            {content?.title ?? null}

          </Title>
          <Text data-class="centered-hero-description" c="secondary-foreground" ta="center">
            {content?.description ?? null}

          </Text>
          {content?.primaryButtonText || content?.secondaryButtonText ? (
          <Group data-class="centered-hero-actions" gap="md" align="center" justify="center">
            <Button data-class="centered-hero-primary" variant="default" rounded={theme?.themeRounded.default} size={theme?.themeButtonSize.default} leftSection={content?.primaryButtonIcon ? (<Icon c="primary-foreground" lucideIcon={content?.primaryButtonIcon || Info} />) : undefined}>
              {content?.primaryButtonText ? (<>{content?.primaryButtonText}</>) : null}

            </Button>
            <Button data-class="centered-hero-secondary" variant="outline" rounded={theme?.themeRounded.default} size={theme?.themeButtonSize.default} leftSection={content?.secondaryButtonIcon ? (<Icon lucideIcon={content?.secondaryButtonIcon || Rocket} />) : undefined}>
              {content?.secondaryButtonText ? (<>{content?.secondaryButtonText}</>) : null}

            </Button>
          </Group>
          ) : null}
        </Stack>
      </Block>
  );
});
CenteredHero.displayName = "CenteredHero";
