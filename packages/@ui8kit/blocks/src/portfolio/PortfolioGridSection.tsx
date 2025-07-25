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
  Button,
  Icon,
} from "@ui8kit/core";
import { ChevronRight } from "lucide-react";

const IMAGE_URL = "https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80";

interface PortfolioGridSectionProps {
  content: {
    tagline: string;
    mainTitle: string;
    mainDescription: string;
    projects: {
      imageAlt: string;
      projectName: string;
      description: string;
      tags: string[];
      linkText: string;
    }[];
    buttonText: string;
  };
}

export const PortfolioGridSection = forwardRef<HTMLElement, PortfolioGridSectionProps>(
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

          <Grid cols="cols3" gap="xl" mt="2xl">
            {content.projects.map((project, index) => (
              <Stack key={index} gap="md" align="start" ta="left">
                <Image src={IMAGE_URL} alt={project.imageAlt} className="w-full rounded-md h-xl" />
                <Stack gap="xs">
                  <Title order={3} size="lg" fw="semibold">
                    {project.projectName}
                  </Title>
                  <Text size="sm" c="muted-foreground">
                    {project.description}
                  </Text>
                </Stack>
                <Box display="flex" gap="xs">
                  {project.tags.map((tag, tagIndex) => (
                    <Text key={tagIndex} size="xs" fw="medium" c="muted-foreground" p="xs" bg="muted" radius="sm">
                      {tag}
                    </Text>
                  ))}
                </Box>
                <Button variant="link" className="text-foreground p-none" rightSection={<Icon component="span" size="md" lucideIcon={ChevronRight} />}>
                  {project.linkText}
                </Button>
              </Stack>
            ))}
          </Grid>
          <Button variant="outline" size="lg" className="mt-2xl">
            {content.buttonText}
          </Button>
        </Container>
      </Block>
    );
  }
);

PortfolioGridSection.displayName = "PortfolioGridSection";

export const portfolioGridSectionTemplate = {
  id: "portfolioGridSection",
  name: "Portfolio Grid Section",
  description: "Grid display of portfolio projects with images, descriptions, tags, and links.",
  component: PortfolioGridSection,
  defaultContent: {
    tagline: "Portfolio",
    mainTitle: "Short heading goes here",
    mainDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    projects: [
      {
        imageAlt: "Project Image",
        projectName: "Project name will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
        tags: ["Tag one", "Tag two", "Tag three"],
        linkText: "View project"
      },
      {
        imageAlt: "Project Image",
        projectName: "Project name will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
        tags: ["Tag one", "Tag two", "Tag three"],
        linkText: "View project"
      },
      {
        imageAlt: "Project Image",
        projectName: "Project name will go here",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
        tags: ["Tag one", "Tag two", "Tag three"],
        linkText: "View project"
      },
    ],
    buttonText: "View all"
  }
}; 