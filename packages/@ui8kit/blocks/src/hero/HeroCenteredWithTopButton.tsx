import { forwardRef } from "react";
import { ArrowUpRight, CheckCircle } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Button,
  Box
} from "@ui8kit/core";

interface HeroCenteredWithTopButtonProps {
  content: {
    topButtonText: string;
    title: string;
    description: string;
    mainButtonText: string;
  };
  className?: string;
}

export const HeroCenteredWithTopButton = forwardRef<HTMLElement, HeroCenteredWithTopButtonProps>(
  ({ content, className, ...props }, ref) => {
    return (
      <Block
        ref={ref}
        variant="section"
        className="w-full py-12 md:py-24 lg:py-32 bg-accent"
        data-class="section-padded"
        {...props}
      >
        <Container size="lg" padding="responsive">
          <Stack 
            gap="lg" 
            align="center" 
            ta="center"
            className="space-y-6"
            data-class="content-spaced"
          >
            {/* Top Button */}
            <Button 
              variant="outline" 
              size="sm"
              className="text-sm"
              data-class="button-outlined"
            >
              {content.topButtonText}
              <Box 
                component="span"
                className="ml-2 h-4 w-4"
                data-class="icon-small"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Box>
            </Button>
            
            {/* Title */}
            <Title
              order={1}
              size="4xl"
              fw="bold"
              c="foreground"
              className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl"
              data-class="title-responsive"
            >
              {content.title}
            </Title>
            
            {/* Description */}
            <Text
              size="lg"
              c="muted-foreground"
              className="max-w-[700px] md:text-xl"
              data-class="text-constrained"
            >
              {content.description}
            </Text>
            
            {/* Main Button */}
            <Button 
              size="lg" 
              variant="default"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-class="button-elevated"
            >
              {content.mainButtonText}
              <Box 
                component="span"
                className="ml-2 h-5 w-5"
                data-class="icon-medium"
              >
                <CheckCircle className="h-5 w-5" />
              </Box>
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