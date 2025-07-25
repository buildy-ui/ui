import { forwardRef } from "react";
import { Info, Rocket } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Badge,
  Icon
} from "@ui8kit/core";

interface HeroCenteredSectionProps {
  content: {
    badge: string;
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
}

export const HeroCenteredSection = forwardRef<HTMLElement, HeroCenteredSectionProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <Stack gap="xl" align="center" ta="center">
            {/* Badge */}
            <Badge variant="secondary">
              {content.badge}
            </Badge>
            
            {/* Header */}
            <Stack gap="md" align="center" size="2xl">
              <Title
                order={1}
                size="3xl"
                fw="bold"
                ta="center"
              >
                {content.title}
              </Title>
              
              <Text
                size="lg"
                c="muted-foreground"
                ta="center"
              >
                {content.description}
              </Text>
            </Stack>
            
            {/* Buttons */}
            <Group
              justify="center"
              gap="xl"
              direction="col"
              responsive="md"
            >
              <Button
                size="lg"
                variant="default"
                                  leftSection={
                    <Icon
                      component="span"
                      size="md"
                      lucideIcon={Info}
                    />
                  }
              >
                {content.primaryButtonText}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                                  leftSection={
                    <Icon
                      component="span"
                      size="md"
                      lucideIcon={Rocket}
                    />
                  }
              >
                {content.secondaryButtonText}
              </Button>
            </Group>
          </Stack>
        </Container>
      </Block>
    );
  }
);

HeroCenteredSection.displayName = "HeroCenteredSection";

export const heroCenteredSectionTemplate = {
  id: "heroCenteredSection",
  name: "Hero Centered Section",
  description: "Centered hero section with badge and buttons",
  component: HeroCenteredSection,
  defaultContent: {
    badge: "Start Now",
    title: "Explore Our BuildY!",
    description: "Simplify your business operations with our cutting-edge solution.",
    primaryButtonText: "Learn More",
    secondaryButtonText: "Get Started"
  }
}; 