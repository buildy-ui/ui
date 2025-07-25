import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Image,
  Box,
} from "@ui8kit/core";

const IMAGE_URL = "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";

interface PortfolioHorizontalSectionProps {
  content: {
    projectName: string;
    description: string;
    tags: string[];
    imageAlt: string;
  };
}

export const PortfolioHorizontalSection = forwardRef<HTMLElement, PortfolioHorizontalSectionProps>(
  ({ content }, ref) => {
    return (
      <Block component="section" ref={ref} w="full" py="xl">
        <Container size="lg" padding="responsive">
          <Image src={IMAGE_URL} alt={content.imageAlt} className="w-full h-lg rounded-md" />
          <Stack gap="md" ta="center" mt="2xl" align="center">
            <Title order={1} size="3xl" fw="bold">
              {content.projectName}
            </Title>
            <Text size="md" c="muted-foreground">
              {content.description}
            </Text>
            <Box display="flex" gap="xs">
              {content.tags.map((tag, tagIndex) => (
                <Text key={tagIndex} size="xs" fw="medium" c="muted-foreground" p="xs" bg="muted" radius="sm">
                  {tag}
                </Text>
              ))}
            </Box>
          </Stack>
        </Container>
      </Block>
    );
  }
);

PortfolioHorizontalSection.displayName = "PortfolioHorizontalSection";

export const portfolioHorizontalSectionTemplate = {
  id: "portfolioHorizontalSection",
  name: "Portfolio Horizontal Section",
  description: "Portfolio section with a large horizontal image and centered project details.",
  component: PortfolioHorizontalSection,
  defaultContent: {
    projectName: "Project name here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    tags: ["Tag one", "Tag two", "Tag three"],
    imageAlt: "Project Image",
  }
}; 