import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Group,
  Grid,
  Title,
  Text,
  Button,
  Badge,
  Image,
  Icon
} from "@ui8kit/core";

interface HeroSplitWithMediaProps {
  content: {
    badge: string;
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    image: {
      src: string;
      alt: string;
    };
  };
}

export const HeroSplitWithMedia = forwardRef<HTMLElement, HeroSplitWithMediaProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <Grid
            cols="cols2"
            gap="xl"
            align="center"
          >
            {/* Content */}
            <Stack gap="lg" align="start">
              <Badge variant="secondary">
                {content.badge}
              </Badge>
              
              <Title
                order={1}
                size="3xl"
                fw="bold"
              >
                {content.title}
              </Title>
              
              <Text
                size="lg"
                c="muted-foreground"
              >
                {content.description}
              </Text>
              
              <Group gap="md" align="center">
                <Button
                  size="lg"
                  variant="default"
                  leftSection={
                    <Icon
                      component="span"
                      size="md"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z' /%3e%3c/svg%3e")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        width: '1rem',
                        height: '1rem'
                      }}
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
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.631 8.41m5.96 5.96a14.926 14.926 0 0 1-5.841 2.58m-.119-8.54a6 6 0 0 0-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 0 0-2.58 5.84m2.58-5.84a14.98 14.98 0 0 1 12.12 6.16M9.75 18.75h.008v.008H9.75V18.75Z' /%3e%3c/svg%3e")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        width: '1rem',
                        height: '1rem'
                      }}
                    />
                  }
                >
                  {content.secondaryButtonText}
                </Button>
              </Group>
            </Stack>
            
            {/* Image */}
            <Block className="relative">
              <Image
                src={content.image.src}
                alt={content.image.alt}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </Block>
          </Grid>
        </Container>
      </Block>
    );
  }
);

HeroSplitWithMedia.displayName = "HeroSplitWithMedia";

export const heroSplitWithMediaTemplate = {
  id: "heroSplitWithMedia",
  name: "Hero Split With Media",
  description: "Split layout hero section with content and image",
  component: HeroSplitWithMedia,
  defaultContent: {
    badge: "New Feature",
    title: "Build Amazing Products",
    description: "Create stunning applications with our powerful tools and components. Experience the future of development.",
    primaryButtonText: "Get Started",
    secondaryButtonText: "Learn More",
    image: {
      src: "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80",
      alt: "Hero Image"
    }
  }
}; 