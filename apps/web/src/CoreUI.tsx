import React from 'react';
import { 
  // Core primitives
  Block, 
  Container, 
  Grid, 
  Flex, 
  Box, 
  Stack,
  
  // Composite components
  Card, 
  Button, 
  Badge, 
  Image,
  Icon,
  
  // CVA variants for styling
  spacingVariants,
  roundedVariants,
  shadowVariants,
  colorVariants,
  layoutVariants,
  borderVariants,
  flexVariants,
  gridVariants,
  
  // Utility function
  cn
} from '@ui8kit/core';

// Example: Creating styled components using prop forwarding approach
interface StyledCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  bg?: 'background' | 'card' | 'muted';
}

const StyledCard: React.FC<StyledCardProps> = ({ 
  variant = 'default',
  padding = 'md',
  rounded = 'lg',
  shadow = 'sm',
  bg = 'card',
  className,
  children,
  ...props 
}) => {
  return (
    <Card
      className={cn(
        'border', // base card styles
        spacingVariants({ p: padding }),
        roundedVariants({ rounded }),
        shadowVariants({ shadow }),
        colorVariants({ bg }),
        borderVariants({ border: '1px' }),
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
};

// Example: Layout component with responsive grid
interface ResponsiveGridProps {
  cols?: '1-2' | '1-2-3' | '1-2-3-4';
  gap?: 'sm' | 'md' | 'lg';
  padding?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  cols = '1-2-3',
  gap = 'md',
  padding = 'md',
  children
}) => {
  return (
    <Container className={cn(spacingVariants({ p: padding }))}>
      <Grid className={cn(gridVariants({ cols, gap }))}>
        {children}
      </Grid>
    </Container>
  );
};

// Example: Hero section using clean composition
const ExampleHeroSection: React.FC = () => {
  return (
    <Block component="section" className={cn(spacingVariants({ py: 'xl' }))}>
      <Container>
        <Stack className={cn(flexVariants({ gap: 'lg', align: 'center' }))}>
          <Box className={cn(layoutVariants({ w: 'full' }))}>
            <h1 className="text-4xl font-bold text-center">
              Welcome to the New Architecture
            </h1>
            <p className="text-lg text-center text-muted-foreground mt-4">
              Clean primitives with prop forwarding approach
            </p>
          </Box>
          
          <Flex className={cn(flexVariants({ gap: 'md', justify: 'center' }))}>
            <Button 
              className={cn(
                'bg-primary text-primary-foreground px-6 py-3',
                roundedVariants({ rounded: 'md' }),
                shadowVariants({ shadow: 'sm' })
              )}
            >
              Get Started
            </Button>
            
            <Button 
              className={cn(
                'border border-input bg-background hover:bg-accent',
                roundedVariants({ rounded: 'md' })
              )}
            >
              Learn More
            </Button>
          </Flex>
        </Stack>
      </Container>
    </Block>
  );
};

// Example: Feature cards grid
const ExampleFeaturesSection: React.FC = () => {
  const features = [
    { title: 'Clean Primitives', description: 'Base components without styles' },
    { title: 'Prop Forwarding', description: 'Style through CVA variants' },
    { title: 'Universal Props', description: 'Consistent API across components' },
  ];

  return (
    <Block component="section" className={cn(spacingVariants({ py: 'xl' }))}>
      <ResponsiveGrid cols="1-2-3" gap="lg">
        {features.map((feature, index) => (
          <StyledCard
            key={index}
            padding="lg"
            rounded="xl"
            shadow="md"
            bg="card"
          >
            <Stack className={cn(flexVariants({ gap: 'sm' }))}>
              <Badge 
                className={cn(
                  'bg-primary text-primary-foreground px-3 py-1 text-sm font-medium',
                  roundedVariants({ rounded: 'full' })
                )}
              >
                Feature {index + 1}
              </Badge>
              
              <h3 className="text-xl font-semibold">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </Stack>
          </StyledCard>
        ))}
      </ResponsiveGrid>
    </Block>
  );
};

// Complete example showing the new architecture in action
const CoreUI: React.FC = () => {
  return (
    <Box className={cn(colorVariants({ bg: 'background' }))}>
      <ExampleHeroSection />
      <ExampleFeaturesSection />
    </Box>
  );
};

export default CoreUI; 