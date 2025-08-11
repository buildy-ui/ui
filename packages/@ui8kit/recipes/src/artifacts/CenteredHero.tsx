import { forwardRef } from "react";
import { Info, Rocket } from "lucide-react";
import { Block, Stack, Group, Title, Text, Button, Icon } from "@ui8kit/core";
import { skyOSTheme } from "@ui8kit/theme";

const currentTheme = skyOSTheme; // modernUITheme | skyOSTheme

const theme = {
  theme: currentTheme,
  themeRounded: currentTheme.rounded,
  themeButtonSize: currentTheme.buttonSize
}

// Minimal data interface for simplified CenteredHero
export interface CenteredHeroData {
  title: string;
  description: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonIcon?: any;
  secondaryButtonIcon?: any;
}

interface CenteredHeroProps {
  content: CenteredHeroData;
  py?: "none" | "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

export const CenteredHero = forwardRef<HTMLElement, CenteredHeroProps>(
  ({ content, py = "lg", className, ...props }, ref) => {
    return (
      <Block component="section" ref={ref} w="full" py={py} className={className} {...props}>
        <Stack gap="xl" align="center" ta="center" className="max-w-4xl mx-auto">
          <Title order={1} size="5xl" fw="bold" ta="center" className="tracking-tight leading-tight">
            {content.title}
          </Title>
          <Text c="secondary-foreground" ta="center" className="max-w-[42rem]">
            {content.description}
          </Text>
          {(content.primaryButtonText || content.secondaryButtonText) && (
            <Group gap="md" align="center" justify="center">
              {content.primaryButtonText && (
                <Button
                  variant="default"
                  rounded={theme?.themeRounded.default}
                  size={theme?.themeButtonSize.default}
                  leftSection={content.primaryButtonIcon ? (
                    <Icon c="primary-foreground" lucideIcon={content.primaryButtonIcon || Info} />
                  ) : undefined}
                >
                  {content.primaryButtonText}
                </Button>
              )}
              {content.secondaryButtonText && (
                <Button
                  variant="outline"
                  rounded={theme?.themeRounded.default}
                  size={theme?.themeButtonSize.default}
                  leftSection={content.secondaryButtonIcon ? (
                    <Icon lucideIcon={content.secondaryButtonIcon || Rocket} />
                  ) : undefined}
                >
                  {content.secondaryButtonText}
                </Button>
              )}
            </Group>
          )}
        </Stack>
      </Block>
    );
  }
);

CenteredHero.displayName = "CenteredHero";