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

interface PortfolioWithButtonsSectionProps {
  content: {
    tagline: string;
    mainTitle: string;
    mainDescription: string;
    projects: {
      projectName: string;
      tags: string[];
      description: string;
      button1Text: string;
      button2Text: string;
      imageAlt: string;
    }[];
  };
}

export const PortfolioWithButtonsSection = forwardRef<HTMLElement, PortfolioWithButtonsSectionProps>(
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
          <Stack gap="2xl">
            {content.projects.map((project, index) => (
              <Grid key={index} cols="cols2" gap="2xl" ai="center">
                <Stack gap="md" align="start" ta="left">
                  <Title order={3} size="2xl" fw="semibold">
                    {project.projectName}
                  </Title>
                  <Box display="flex" gap="xs">
                    {project.tags.map((tag, tagIndex) => (
                      <Text key={tagIndex} size="xs" fw="medium" c="muted-foreground" p="xs" bg="muted" radius="sm">
                        {tag}
                      </Text>
                    ))}
                  </Box>
                  <Text size="md" c="muted-foreground">
                    {project.description}
                  </Text>
                  <Box display="flex" gap="md" mt="md">
                    <Button variant="outline" size="lg">
                      {project.button1Text}
                    </Button>
                    <Button variant="link" className="text-foreground p-none" rightSection={<Icon component="span" size="md" lucideIcon={ChevronRight} />}>
                      {project.button2Text}
                    </Button>
                  </Box>
                </Stack>
                <Image src={IMAGE_URL} alt={project.imageAlt} className="w-full rounded-md" />
              </Grid>
            ))}
          </Stack>
        </Container>
      </Block>
    );
  }
);

PortfolioWithButtonsSection.displayName = "PortfolioWithButtonsSection";

export const portfolioWithButtonsSectionTemplate = {
  id: "portfolioWithButtonsSection",
  name: "Portfolio With Buttons Section",
  description: "Portfolio section displaying projects with images, descriptions, tags, and two action buttons.",
  component: PortfolioWithButtonsSection,
  defaultContent: {
    tagline: "Portfolio",
    mainTitle: "Short heading goes here",
    mainDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    projects: [
      {
        projectName: "Project name",
        tags: ["Tag one", "Tag two", "Tag three"],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        button1Text: "Button",
        button2Text: "Button",
        imageAlt: "Project Image",
      },
      {
        projectName: "Project name",
        tags: ["Tag one", "Tag two", "Tag three"],
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
        button1Text: "Button",
        button2Text: "Button",
        imageAlt: "Project Image",
      },
    ]
  }
}; 