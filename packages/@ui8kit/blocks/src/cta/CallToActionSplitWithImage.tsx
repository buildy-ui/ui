import { forwardRef } from "react";
import { ArrowRight } from "lucide-react";
import {
  Block,
  Container,
  Grid,
  Stack,
  Title,
  Text,
  Button,
  Box,
  Group,
  Image
} from "@ui8kit/core";

interface CallToActionSplitWithImageProps {
  content: {
    title: string;
    description: string;
    image?: {
      src: string;
      alt: string;
    };
    buttons: Array<{
      id: string;
      text: string;
      variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
      lucideIcon?: any;
    }>;
  };
}

export const CallToActionSplitWithImage = forwardRef<HTMLElement, CallToActionSplitWithImageProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <Box
            w="full"
            rounded="lg"
            bg="accent"
            overflow="hidden"
          >
            <Grid cols={1} colsMd={2} gap="none" align="stretch">
                             {/* Content Side */}
               <Block p="xl" h="full" display="flex" align="center" className="items-center">
                 <Stack gap="xl" w="full">
                  <Stack gap="md">
                    <Title
                      order={2}
                      size="3xl"
                      fw="semibold"
                    >
                      {content.title}
                    </Title>
                    
                    <Text
                      c="muted-foreground"
                    >
                      {content.description}
                    </Text>
                  </Stack>

                  {/* Buttons */}
                  <Group gap="md" responsive="sm_flex_col" justify="start"> 
                    {content.buttons.map((button) => (
                      <Button
                        key={button.id}
                        variant={button.variant || "default"}
                        rightSection={button.lucideIcon && <button.lucideIcon size={16} />}
                      >
                        {button.text}
                      </Button>
                    ))}
                  </Group>
                </Stack>
              </Block>

                             {/* Image Side */}
               <Block
                 w="full"
                 h="full"
                 bg="muted"
                 position="relative"
                 className="min-h-[300px]"
               >
                                 {content.image?.src ? (
                   <Image
                     src={content.image.src}
                     alt={content.image.alt}
                     fit="cover"
                     width="100%"
                     height="100%"
                     position="center"
                     className="w-full h-full object-cover"
                   />
                 ) : (
                  <Block
                    w="full"
                    h="full"
                    display="flex"
                    bg="muted"
                    align="center"
                    justify="center"
                    position="absolute"
                  >
                    <Stack gap="md" align="center">
                      <Block
                        bg="muted-foreground"
                        rounded="md"
                        p="lg"
                        opacity="0.3"
                      >
                        <svg
                          width="48"
                          height="48"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                        </svg>
                      </Block>
                      
                      <Text
                        size="sm"
                        c="muted-foreground"
                        ta="center"
                      >
                        Image placeholder
                      </Text>
                    </Stack>
                  </Block>
                )}
              </Block>
            </Grid>
          </Box>
        </Container>
      </Block>
    );
  }
);

CallToActionSplitWithImage.displayName = "CallToActionSplitWithImage";

export const callToActionSplitWithImageTemplate = {
  id: "callToActionSplitWithImage",
  name: "Call To Action Split With Image",
  description: "Call to action section with content on left and image on right",
  component: CallToActionSplitWithImage,
  defaultContent: {
    title: "Ready to Transform Your Business?",
    description: "Join thousands of companies that have already revolutionized their operations with our cutting-edge solutions.",
    image: {
      src: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080&q=75",
      alt: "Business transformation illustration"
    },
    buttons: [
      {
        id: "learn-more",
        text: "Learn More",
        variant: "outline" as const,
        lucideIcon: ArrowRight
      },
      {
        id: "get-started",
        text: "Get Started",
        variant: "default" as const,
        lucideIcon: ArrowRight
      }
    ]
  }
}; 