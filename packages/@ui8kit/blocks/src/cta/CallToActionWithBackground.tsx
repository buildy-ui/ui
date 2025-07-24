import { forwardRef } from "react";
import { ArrowRight } from "lucide-react";
import {
  Block,
  Container,
  Grid,
  Stack,
  Title,
  Text,
  Button,
  Box,
  Group,
  BackgroundImage
} from "@ui8kit/core";

interface CallToActionWithBackgroundProps {
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

export const CallToActionWithBackground = forwardRef<HTMLElement, CallToActionWithBackgroundProps>(
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
            radius="lg"
            position="relative"
            overflow="hidden"
          >
            {/* Background Image */}
            <BackgroundImage
              src={content.backgroundImage}
              gradient={content.gradient}
              size="cover"
              position="center"
            >
              {/* Overlay for better text readability */}
              <Block
                position="absolute"
                w="full"
                h="full"
                bg="foreground"
                opacity="0.7"
              />
              
              {/* Content */}
              <Block
                position="relative"
                p="2xl"
              >
                <Grid cols={1} colsMd={2} gap="2xl" align="center">
                  {/* Content */}
                  <Stack gap="md">
                    <Title
                      order={2}
                      size="2xl"
                      fw="semibold"
                      c="background"
                    >
                      {content.title}
                    </Title>
                    
                    <Text
                      c="background"
                      opacity="0.9"
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
                </Grid>
              </Block>
            </BackgroundImage>
          </Box>
        </Container>
      </Block>
    );
  }
);

CallToActionWithBackground.displayName = "CallToActionWithBackground";

export const callToActionWithBackgroundTemplate = {
  id: "callToActionWithBackground",
  name: "Call To Action With Background",
  description: "Call to action section with split layout and background image",
  component: CallToActionWithBackground,
  defaultContent: {
    title: "Transform Your Business Today",
    description: "Unlock powerful solutions that drive growth, efficiency, and innovation for your organization.",
    backgroundImage: "",
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