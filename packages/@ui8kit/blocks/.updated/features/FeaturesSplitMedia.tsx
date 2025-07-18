import { forwardRef } from "react";
import {
  Box,
  Block,
  Container,
  Stack,
  Group,
  Grid,
  Title,
  Text,
  Badge } from
"@ui8kit/core";

interface Feature {
  title: string;
  description: string;
}

interface FeaturesSplitMediaProps {
  content: {
    badge: string;
    title: string;
    description: string;
    features: Feature[];
  };
  className?: string;
}

export const FeaturesSplitMedia = forwardRef<HTMLElement, FeaturesSplitMediaProps>(
  ({ content, className, ...props }, ref) => {
    const { badge, title, description, features } = content;

    return (
      <Block
        ref={ref}
        variant="section"
        className="features-split-media"

        {...props}>
        
        <Container size="lg" padding="responsive">
          <Grid cols={2} gap="lg" align="center" centered={true}>
            {/* Content Section */}
            <Grid.Col span={1}>
              <Stack gap="lg">
                <Stack gap="md">
                  {/* Badge */}
                  <Badge
                    variant="outline"
                    className="w-fit">
                    
                    {badge}
                  </Badge>
                  
                  {/* Title and Description */}
                  <Stack gap="sm">
                    <Title
                      order={2}
                      size="3xl"
                      fw="bold"
                      c="foreground"
                      ta="left"
                      className="max-w-2xl text-3xl md:text-4xl lg:text-5xl">
                      
                      {title}
                    </Title>
                    
                    <Text
                      size="lg"
                      c="muted-foreground"
                      ta="left"
                      className="max-w-2xl">
                      
                      {description}
                    </Text>
                  </Stack>
                </Stack>
                
                {/* Features List */}
                <Stack gap="md" className="features-list">
                  {features?.map((feature, index) =>
                  <Group key={index} gap="md" align="start">
                      {/* Check Icon */}
                      <Box
                      className="w-4 h-4 mt-2 flex-shrink-0 text-primary dark:text-white"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='2.5' stroke='currentColor' %3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='m4.5 12.75 6 6 9-13.5' /%3e%3c/svg%3e")`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        filter: 'hue-rotate(210deg) saturate(2) brightness(1.2)'
                      }} />
                    
                      
                      {/* Feature Content */}
                      <Stack gap="xs" className="flex-1">
                        <Text fw="medium" c="foreground">
                          {feature.title}
                        </Text>
                        <Text
                        size="sm"
                        c="muted-foreground">
                        
                          {feature.description}
                        </Text>
                      </Stack>
                    </Group>
                  )}
                </Stack>
              </Stack>
            </Grid.Col>
            
            {/* Media Placeholder */}
            <Grid.Col span={1}>
              <Box
                className="bg-muted rounded-md aspect-square w-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z' /%3e%3c/svg%3e")`,
                  backgroundSize: '3rem',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'center',
                  opacity: 0.4
                }} />
              
            </Grid.Col>
          </Grid>
        </Container>
      </Block>);

  }
);

FeaturesSplitMedia.displayName = "FeaturesSplitMedia";

export const featuresSplitMediaTemplate = {
  id: "featuresSplitMedia",
  name: "Features Split Media",
  description: "A split layout for features with media on the right",
  component: FeaturesSplitMedia,
  defaultContent: {
    badge: 'Open Source',
    title: 'Beautiful Components for Your Next Project',
    description: 'Elevate your application with stunning, customizable UI elements built with Radix UI and Tailwind CSS.',
    features: [
    {
      title: 'Radix UI Integration',
      description: 'Harness the power of Radix UI\'s robust component library for seamless integration into your project.'
    },
    {
      title: 'Tailwind CSS Styling',
      description: 'Utilize Tailwind CSS for effortless customization and rapid development of your UI components.'
    },
    {
      title: 'Free and Open Source',
      description: 'Access these beautifully crafted components absolutely free, perfect for both personal and commercial projects.'
    }]

  }
};