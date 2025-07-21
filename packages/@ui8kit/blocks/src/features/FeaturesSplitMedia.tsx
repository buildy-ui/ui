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
  Badge,
  Image
} from "@ui8kit/core";

interface Feature {
  title: string;
  description: string;
}

interface FeaturesSplitMediaProps {
  badge: string;
  title: string;
  description: string;
  image: string;
  features: Feature[];
}

export const FeaturesSplitMedia = forwardRef<HTMLElement, FeaturesSplitMediaProps>(
  ({ badge, title, description, image, features }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        py="xl"
      >
        <Container size="xl" padding="responsive">
          <Grid cols={1} colsLg={2} gap="xl" align="center">
            {/* Content */}
            <Grid.Col>
              <Stack gap="lg">
                <Stack gap="md">
                  {/* Badge */}
                  <Box 
                    width="fit"
                  >
                    <Badge variant="outline">
                      {badge}
                    </Badge>
                  </Box>
                  
                  {/* Title and Description */}
                  <Stack gap="md">
                    <Title
                      order={2}
                      size="3xl"
                      fw="bold"
                      c="foreground"
                      data-class="title-max-w-2xl"
                      className="max-w-2xl"
                    >
                      {title}
                    </Title>
                    
                    <Text
                      size="lg"
                      c="muted-foreground"
                      data-class="text-max-w-2xl"
                      className="max-w-2xl"
                    >
                      {description}
                    </Text>
                  </Stack>
                </Stack>
                
                {/* Features List */}
                <Stack gap="md" data-class="features-list" className="lg:pl-4">
                  {features.map((feature, index) => (
                    <Group key={index} gap="md" align="start">
                      {/* Icon */}
                      <Box 
                        data-class="box-w-4"
                        className="w-4 h-4 mt-2 flex-shrink-0"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke-width='1.5' stroke='currentColor'%3e%3cpath stroke-linecap='round' stroke-linejoin='round' d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' /%3e%3c/svg%3e")`,
                          backgroundSize: 'contain',
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                      
                      {/* Feature Content */}
                      <Stack gap="xs">
                        <Text fw="medium" c="foreground"> 
                          {feature.title}
                        </Text>
                        <Text c="muted-foreground">
                          {feature.description}
                        </Text>
                      </Stack>
                    </Group>
                  ))}
                </Stack>
              </Stack>
            </Grid.Col>
            
            {/* Image */}
            <Grid.Col>
              <Box data-class="box-bg-muted" className="bg-muted rounded-md aspect-square w-full">
                <Image
                  src={image}
                  alt={title}
                  width="full"
                  height="auto"
                />
              </Box>
            </Grid.Col>
          </Grid>
        </Container>
      </Block>
    );
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
    image: 'https://via.placeholder.com/400x400', // Added default image
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
      }
    ]
  },
}; 