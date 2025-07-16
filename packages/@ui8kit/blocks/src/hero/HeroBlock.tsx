import { forwardRef } from "react";
import { 
  Box, 
  Container, 
  Stack, 
  Group, 
  Title, 
  Text, 
  Button, 
  BackgroundImage, 
  Overlay 
} from "@ui8kit/core";

interface HeroBlockProps {
  content: {
    title: string;
    subtitle: string;
    buttonText: string;
    backgroundImage: string;
  };
  className?: string;
}

export const HeroBlock = forwardRef<HTMLElement, HeroBlockProps>(
  ({ content, className, ...props }, ref) => {
    return (
      <Box
        ref={ref}
        component="section"
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        data-slot="hero-block"
        {...props}
      >
        {/* Background Image */}
        <BackgroundImage
          src={content.backgroundImage}
          size="cover"
          position="center"
          className="absolute inset-0"
        />
        
        {/* Overlay */}
        <Overlay 
          color="black" 
          opacity={50}
          className="absolute inset-0"
        />
        
        {/* Content */}
        <Container 
          size="lg" 
          className="relative z-10 h-full flex items-center"
        >
          <Stack gap="lg" className="text-center mx-auto max-w-4xl">
            <Title
              order={1}
              size="4xl"
              fw="bold"
              c="white"
              className="text-4xl md:text-6xl lg:text-7xl leading-tight"
            >
              {content.title}
            </Title>
            
            <Text
              size="xl"
              c="white"
              className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto leading-relaxed"
            >
              {content.subtitle}
            </Text>
            
            <Group 
              justify="center" 
              gap="md"
              className="flex-col sm:flex-row"
            >
              <Button
                size="lg"
                className="text-lg px-8 py-6 h-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
              >
                {content.buttonText}
                <Box 
                  component="span" 
                  className="ml-2 inline-block w-5 h-5"
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' /%3e%3c/svg%3e")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
              </Button>
              
              <Button
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6 h-auto bg-white/10 border-white/30 text-white hover:bg-white/20 hover:text-white rounded-lg backdrop-blur-sm"
              >
                <Box 
                  component="span" 
                  className="mr-2 inline-block w-5 h-5"
                  style={{ 
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z' /%3e%3c/svg%3e")`,
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat'
                  }}
                />
                Watch Demo
              </Button>
            </Group>
          </Stack>
        </Container>
      </Box>
    );
  }
);

HeroBlock.displayName = "HeroBlock";

export const heroTemplate = {
  id: "hero",
  name: "Hero Section",
  description: "Eye-catching header with CTA",
  component: HeroBlock,
  defaultContent: {
    title: "Build Something Amazing",
    subtitle: "Create stunning landing pages with our professional page builder",
    buttonText: "Get Started",
    backgroundImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080&q=75"
  }
}; 