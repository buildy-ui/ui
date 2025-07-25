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

interface PortfolioDetailsSectionProps {
  content: {
    projectName: string;
    description: string;
    tags: string[];
    client: string;
    role: string;
    date: string;
    website: string;
    imageAlt: string;
  };
}

export const PortfolioDetailsSection = forwardRef<HTMLElement, PortfolioDetailsSectionProps>(
  ({ content }, ref) => {
    return (
      <Block component="section" ref={ref} w="full" py="xl">
        <Container size="lg" padding="responsive">
          <Image src={IMAGE_URL} alt={content.imageAlt} className="w-full h-lg rounded-md" />
          <Grid cols="cols2" gap="2xl" mt="2xl" ai="start">
            <Stack gap="md" ta="left">
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
            <Grid cols="cols2" gap="md" ta="left">
              <Stack gap="xs">
                <Text size="sm" c="muted-foreground">
                  Client
                </Text>
                <Text size="md" fw="semibold">
                  {content.client}
                </Text>
              </Stack>
              <Stack gap="xs">
                <Text size="sm" c="muted-foreground">
                  Date
                </Text>
                <Text size="md" fw="semibold">
                  {content.date}
                </Text>
              </Stack>
              <Stack gap="xs">
                <Text size="sm" c="muted-foreground">
                  Role
                </Text>
                <Text size="md" fw="semibold">
                  {content.role}
                </Text>
              </Stack>
              <Stack gap="xs">
                <Text size="sm" c="muted-foreground">
                  Website
                </Text>
                <Text size="md" fw="semibold" component="a" href={content.website} target="_blank" rel="noopener noreferrer">
                  {content.website}
                </Text>
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Block>
    );
  }
);

PortfolioDetailsSection.displayName = "PortfolioDetailsSection";

export const portfolioDetailsSectionTemplate = {
  id: "portfolioDetailsSection",
  name: "Portfolio Details Section",
  description: "Portfolio section displaying project details including client, role, date, and website.",
  component: PortfolioDetailsSection,
  defaultContent: {
    projectName: "Project name here",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    tags: ["Tag one", "Tag two", "Tag three"],
    client: "Full name",
    role: "Role name",
    date: "March 2023",
    website: "www.ralume.io",
    imageAlt: "Project Image",
  }
}; 