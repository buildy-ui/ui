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
  Box } from
"@ui8kit/core";

interface HeroCenteredSectionProps {
  content: {
    badge?: string;
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
  };
  className?: string;
}

export const HeroCenteredSection = forwardRef<HTMLElement, HeroCenteredSectionProps>(
  ({ content, className, ...props }, ref) => {
    return (
      <Block
        ref={ref}
        variant="section"
        py="xl"
        bg="background"
        {...props}>
        
        <Container
          size="lg"
          padding="responsive"
          ta="center">
          
          <Stack gap="xl" justify="center" align="center" {...props}>
            {content.badge &&
            <Group justify="center">
                <Badge
                variant="secondary"

                className="badge-rounded-full">
                
                  {content.badge}
                </Badge>
              </Group>
            }
            
            <Stack gap="md">
              <Title
                order={1}
                size="4xl"
                fw="bold"
                c="foreground"
                maw="2xl"
                mx="auto">
                
                {content.title}
              </Title>
              
              <Text
                size="lg"
                c="mutedForeground"
                maw="2xl"
                mx="auto">
                
                {content.description}
              </Text>
            </Stack>
            
            <Group
              justify="center"
              gap="lg"

              className="button-group-flex">
              
              <Button
                size="lg"
                variant="default"

                className="button-shadow-lg">
                
                <Box
                  component="span"

                  className="inline-icon-mr"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z' /%3e%3c/svg%3e")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                  }} />
                
                {content.primaryButtonText}
              </Button>
              
              <Button
                variant="outline"
                size="lg"

                className="button-shadow-lg">
                
                <Box
                  component="span"

                  className="inline-icon-mr"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.58-5.84a14.98 14.98 0 0 1 12.12 6.16M9.75 18.75h.008v.008H9.75V18.75Z' /%3e%3c/svg%3e")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                  }} />
                
                {content.secondaryButtonText}
              </Button>
            </Group>
          </Stack>
        </Container>
      </Block>);

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