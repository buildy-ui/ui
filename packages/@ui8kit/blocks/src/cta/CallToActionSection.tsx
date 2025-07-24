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
  Group
} from "@ui8kit/core";

interface CallToActionSectionProps {
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

export const CallToActionSection = forwardRef<HTMLElement, CallToActionSectionProps>(
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
            <Grid cols="cols2" gap="2xl" align="center">
              {/* Content */}
              <Stack gap="md">
                <Title
                  order={2}
                  size="3xl"
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
            </Grid>
          </Box>
        </Container>
      </Block>
    );
  }
);

CallToActionSection.displayName = "CallToActionSection";

export const callToActionSectionTemplate = {
  id: "callToActionSection",
  name: "Call To Action Section",
  description: "Call to action section with split layout",
  component: CallToActionSection,
  defaultContent: {
    title: "Transform Your Business Today",
    description: "Unlock powerful solutions that drive growth, efficiency, and innovation for your organization.",
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