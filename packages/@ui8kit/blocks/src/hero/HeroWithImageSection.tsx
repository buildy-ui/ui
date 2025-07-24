import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Image
} from "@ui8kit/core";

interface HeroWithImageSectionProps {
  content: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    imageUrl?: string;
    imageAlt?: string;
  };
}

export const HeroWithImageSection = forwardRef<HTMLElement, HeroWithImageSectionProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
        bg="background"
      >
        <Container size="lg" padding="responsive" centered>
          <Stack gap="xl" align="center">
            {/* Header Content */}
            <Stack gap="lg" align="center" ta="center">
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
              gap="md"
              direction="row"
              responsive="sm"
            >
              <Button
                size="lg"
                variant="default"
              >
                {content.primaryButtonText}
              </Button>
              
              <Button
                variant="outline"
                size="lg"
              >
                {content.secondaryButtonText}
              </Button>
            </Group>

            {/* Image Section */}
            <Block
              w="full"
              mt="xl"
              bg="muted"
              rounded="lg"
              display="flex"
              style={{ minHeight: "400px" }}
            >
              {content.imageUrl ? (
                <Image
                  src={content.imageUrl}
                  alt={content.imageAlt || "Hero image"}
                  fit="cover"
                  radius="lg"
                  width="100%"
                  height="400"
                />
              ) : (
                <Block
                  w="full"
                  h="full"
                  display="flex"
                  bg="muted"
                  rounded="lg"
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "400px"
                  }}
                >
                  <Block
                    bg="muted-foreground"
                    rounded="md"
                    p="lg"
                    style={{
                      opacity: 0.3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "80px",
                      height: "60px"
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ opacity: 0.6 }}
                    >
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </Block>
                </Block>
              )}
            </Block>
          </Stack>
        </Container>
      </Block>
    );
  }
);

HeroWithImageSection.displayName = "HeroWithImageSection";

export const heroWithImageSectionTemplate = {
  id: "heroWithImageSection",
  name: "Hero With Image Section",
  description: "Centered hero section with title, description, buttons and large image area",
  component: HeroWithImageSection,
  defaultContent: {
    title: "Medium length hero heading goes here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
    primaryButtonText: "Button",
    secondaryButtonText: "Button",
    imageUrl: "",
    imageAlt: "Hero section image"
  }
}; 