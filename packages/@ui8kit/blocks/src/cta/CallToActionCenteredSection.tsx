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
  Group
} from "@ui8kit/core";

interface CallToActionCenteredSectionProps {
  content: {
    title: string;
    description: string;
    buttons: Array<{
      id: string;
      text: string;
      variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
      lucideIcon?: any;
    }>;
  };
}

export const CallToActionCenteredSection = forwardRef<HTMLElement, CallToActionCenteredSectionProps>(
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
            </Stack>
          </Box>
        </Container>
      </Block>
    );
  }
);

CallToActionCenteredSection.displayName = "CallToActionCenteredSection";

export const callToActionCenteredSectionTemplate = {
  id: "callToActionCenteredSection",
  name: "Call To Action Centered Section",
  description: "Call to action section with centered layout",
  component: CallToActionCenteredSection,
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
    ]
  }
}; 