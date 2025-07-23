import { forwardRef } from "react";
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

interface HeroCenteredWithTopButtonProps {
  content: {
    topButton: {
      text: string;
      href?: string;
    };
    badge: string;
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
}

export const HeroCenteredWithTopButton = forwardRef<HTMLElement, HeroCenteredWithTopButtonProps>(
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
            {/* Top Button */}
            <Button variant="outline" size="sm">
              <Icon
                component="span"
                size="sm"
                svgPath="<path stroke-linecap='round' stroke-linejoin='round' d='M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25' />"
                svgSize="14"
              />
              {content.topButton.text}
            </Button>
            
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
                      svgPath="<path stroke-linecap='round' stroke-linejoin='round' d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z' />"
                      svgSize="16"
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
                      svgPath="<path stroke-linecap='round' stroke-linejoin='round' d='M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.58-5.84a14.98 14.98 0 0 1 12.12 6.16M9.75 18.75h.008v.008H9.75V18.75Z' />"
                      svgSize="16"
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

HeroCenteredWithTopButton.displayName = "HeroCenteredWithTopButton";

export const heroCenteredWithTopButtonTemplate = {
  id: "heroCenteredWithTopButton",
  name: "Hero Centered With Top Button",
  description: "Centered hero section with top button, badge and main buttons",
  component: HeroCenteredWithTopButton,
  defaultContent: {
    topButton: {
      text: "Announcing our next round of funding",
      href: "#"
    },
    badge: "Start Now",
    title: "Explore Our BuildY!",
    description: "Simplify your business operations with our cutting-edge solution.",
    primaryButtonText: "Learn More",
    secondaryButtonText: "Get Started"
  }
}; 