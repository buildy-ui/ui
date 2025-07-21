import { forwardRef } from "react";
import { ArrowUpRight, CheckCircle } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Button,
  Box,
  Icon
} from "@ui8kit/core";

interface HeroCenteredWithTopButtonProps {
  content: {
    topButtonText: string;
    title: string;
    description: string;
    mainButtonText: string;
  };
}

export const HeroCenteredWithTopButton = forwardRef<HTMLElement, HeroCenteredWithTopButtonProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        py="xl"
      >
        <Container size="lg" padding="responsive">
          <Stack gap="xl" align="center" ta="center">
            {/* Top Button */}
            <Button
              variant="outline"
              size="sm"
            >
              {content.topButtonText}
              <Icon 
                component="span"
                size="sm"
                spacing="left"
                display="inline"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Icon>
            </Button>
            
            {/* Title */}
            <Title
              order={1}
              size="4xl"
              fw="bold"
              c="foreground"
            >
              {content.title}
            </Title>
            
            {/* Description */}
            <Text
              size="lg"
              c="muted-foreground"
              data-class="text-constrained"
              className="max-w-[700px]"
            >
              {content.description}
            </Text>
            
            {/* Main Button */}
            <Button 
              size="lg" 
              variant="elevated"
            >
              {content.mainButtonText}
              <Icon 
                component="span"
                size="md"
                spacing="left"
                display="inline"
              >
                <CheckCircle className="h-5 w-5" />
              </Icon>
            </Button>
          </Stack>
        </Container>
      </Block>
    );
  }
);

HeroCenteredWithTopButton.displayName = "HeroCenteredWithTopButton";

export const heroCenteredWithTopButtonTemplate = {
  id: "heroCenteredWithTopButton",
  name: "Hero Centered With Top Button",
  description: "Centered hero section with a top button",
  component: HeroCenteredWithTopButton,
  defaultContent: {
    topButtonText: "New Feature",
    title: "Discover the Power of BuildY",
    description: "Our platform is designed to enhance your productivity and streamline your workflows.",
    mainButtonText: "Start Building"
  }
}; 