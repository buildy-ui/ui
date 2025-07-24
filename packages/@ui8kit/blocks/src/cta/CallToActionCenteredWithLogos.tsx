import { forwardRef } from "react";
import { ArrowRight, Zap, Shield, Star, Rocket, Globe, Heart } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Button,
  Box,
  Group,
  Grid,
  Icon
} from "@ui8kit/core";

interface CallToActionCenteredWithLogosProps {
  content: {
    title: string;
    description: string;
    buttons: Array<{
      id: string;
      text: string;
      variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
      lucideIcon?: any;
    }>;
    brands: Array<{
      id: string;
      name: string;
      lucideIcon: any;
    }>;
  };
}

export const CallToActionCenteredWithLogos = forwardRef<HTMLElement, CallToActionCenteredWithLogosProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <Box
            w="full"
            rounded="lg"
            bg="accent"
            p="2xl"
          >
            <Stack gap="xl" align="center" ta="center">
              {/* Content */}
              <Stack gap="md" align="center">
                <Title
                  order={2}
                  size="2xl"
                  fw="semibold"
                >
                  {content.title}
                </Title>
                
                <Text
                  c="muted-foreground"
                >
                  {content.description}
                </Text>
              </Stack>

              {/* Buttons */}
              <Group gap="md" responsive="sm_flex_col" justify="end">
                {content.buttons.map((button) => (
                  <Button
                    key={button.id}
                    variant={button.variant || "default"}
                    rightSection={button.lucideIcon && <button.lucideIcon size={16} />}
                  >
                    {button.text}
                  </Button>
                ))}
              </Group>

              {/* Brand Logos */}
              <Stack gap="md" align="center">
                <Text
                  size="sm"
                  c="muted-foreground"
                  fw="medium"
                >
                  Trusted by leading brands
                </Text>
                
                <Grid
                  cols={3}
                  colsMd={6}
                  gap="lg"
                  align="center"
                >
                  {content.brands.map((brand) => (
                    <Group
                      key={brand.id}
                      gap="sm"
                      align="center"
                      justify="center"
                    >
                      <Icon
                        component="span"
                        size="lg"
                        lucideIcon={brand.lucideIcon}
                        c="muted-foreground"
                      />
                      
                      <Text
                        size="sm"
                        c="muted-foreground"
                        fw="medium"
                      >
                        {brand.name}
                      </Text>
                    </Group>
                  ))}
                </Grid>
              </Stack>
            </Stack>
          </Box>
        </Container>
      </Block>
    );
  }
);

CallToActionCenteredWithLogos.displayName = "CallToActionCenteredWithLogos";

export const callToActionCenteredWithLogosTemplate = {
  id: "callToActionCenteredWithLogos",
  name: "Call To Action Centered With Logos",
  description: "Call to action section with centered layout and brand logos",
  component: CallToActionCenteredWithLogos,
  defaultContent: {
    title: "Unlock Your Business Potential",
    description: "Discover innovative solutions that drive growth, efficiency, and transformative success for your organization.",
    buttons: [
      {
        id: "learn-more",
        text: "Explore Solutions",
        variant: "outline" as const,
        lucideIcon: ArrowRight
      },
      {
        id: "get-started",
        text: "Start Your Journey",
        variant: "default" as const,
        lucideIcon: ArrowRight
      }
    ],
    brands: [
      {
        id: "1",
        name: "TechCorp",
        lucideIcon: Zap
      },
      {
        id: "2",
        name: "SecureNet",
        lucideIcon: Shield
      },
      {
        id: "3",
        name: "StarFlow",
        lucideIcon: Star
      },
      {
        id: "4",
        name: "RocketLab",
        lucideIcon: Rocket
      },
      {
        id: "5",
        name: "GlobalTech",
        lucideIcon: Globe
      },
      {
        id: "6",
        name: "HeartWare",
        lucideIcon: Heart
      }
    ]
  }
}; 