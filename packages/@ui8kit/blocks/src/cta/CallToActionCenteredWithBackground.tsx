import { forwardRef } from "react";
import { ArrowRight } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Button,
  Box,
  Group,
  BackgroundImage,
  Overlay
} from "@ui8kit/core";

interface CallToActionCenteredWithBackgroundProps {
  content: {
    title: string;
    description: string;
    backgroundImage?: string;
    gradient?: string;
    buttons: Array<{
      id: string;
      text: string;
      variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
      lucideIcon?: any;
    }>;
  };
}

export const CallToActionCenteredWithBackground = forwardRef<HTMLElement, CallToActionCenteredWithBackgroundProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <BackgroundImage
            src={content.backgroundImage}
            gradient={content.gradient}
            size="cover"
            position="center"
            rounded="lg"
          >
            <Box
              w="full"
              rounded="lg"
              bg="transparent"
              p="2xl"
              position="relative"
            >
              {/* Overlay */}
              <Overlay
                color="black"
                opacity={70}
              />
              
              {/* Content */}
              <Block position="relative">
                <Stack gap="xl" align="center" ta="center">
                  <Stack gap="md" align="center">
                    <Title
                      order={2}
                      size="3xl"
                      fw="semibold"
                      c="background"
                    >
                      {content.title}
                    </Title>
                    
                    <Text
                      c="background"
                    >
                      {content.description}
                    </Text>
                  </Stack>

                  {/* Buttons */}
                  <Group gap="md" responsive="sm_flex_col" justify="center">
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
                </Stack>
              </Block>
            </Box>
          </BackgroundImage>
        </Container>
      </Block>
    );
  }
);

CallToActionCenteredWithBackground.displayName = "CallToActionCenteredWithBackground";

export const callToActionCenteredWithBackgroundTemplate = {
  id: "callToActionCenteredWithBackground",
  name: "Call To Action Centered With Background",
  description: "Call to action section with centered layout and background image",
  component: CallToActionCenteredWithBackground,
  defaultContent: {
    title: "Transform Your Business Today",
    description: "Unlock powerful solutions that drive growth, efficiency, and innovation for your organization.",
    backgroundImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080&q=75",
    gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
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
    ]
  }
}; 