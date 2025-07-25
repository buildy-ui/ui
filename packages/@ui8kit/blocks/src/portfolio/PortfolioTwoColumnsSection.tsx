import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Image,
  Box,
  Grid,
} from "@ui8kit/core";

const IMAGE_URL = "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";

interface PortfolioTwoColumnsSectionProps {
  content: {
    tagline: string;
    mainTitle: string;
    mainDescription: string;
    imageAlt: string;
    projectName: string;
    description: string;
    tags: string[];
  };
}

export const PortfolioTwoColumnsSection = forwardRef<HTMLElement, PortfolioTwoColumnsSectionProps>(
  ({ content }, ref) => {
    return (
      <Block component="section" ref={ref} w="full" py="xl">
        <Container size="lg" padding="responsive" ta="center">
          <Stack gap="lg" align="center">
            <Text size="sm" fw="bold" c="muted-foreground">
              {content.tagline}
            </Text>
            <Title order={1} size="3xl" fw="bold" ta="center">
              {content.mainTitle}
            </Title>
            <Text size="lg" c="muted-foreground" ta="center">
              {content.mainDescription}
            </Text>
          </Stack>
        </Container>
        <Container size="lg" padding="responsive" mt="2xl">
          <Grid cols="cols2" gap="2xl" ai="start">
            {/* Left Column */}
            <Stack gap="md" align="start" ta="left">
              <Title order={3} size="2xl" fw="semibold">
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

            {/* Right Column - Image */}
            <Box>
              <Image src={IMAGE_URL} alt={content.imageAlt} className="w-full rounded-md" />
            </Box>
          </Grid>
        </Container>
      </Block>
    );
  }
);

PortfolioTwoColumnsSection.displayName = "PortfolioTwoColumnsSection";

export const portfolioTwoColumnsSectionTemplate = {
  id: "portfolioTwoColumnsSection",
  name: "Portfolio Two Columns Section",
  description: "Two-column portfolio section with project details on the left and image on the right.",
  component: PortfolioTwoColumnsSection,
  defaultContent: {
    tagline: "Portfolio",
    mainTitle: "Short heading goes here",
    mainDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    imageAlt: "Project Image",
    projectName: "Project name will go here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere.",
    tags: ["Tag one", "Tag two", "Tag three"],
  }
}; 