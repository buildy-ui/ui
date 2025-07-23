import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Box,
  Group,
  Badge
} from "@ui8kit/core";

interface CareerSectionProps {
  content: {
    title: string;
    description: string;
    categories: Array<{
      id: string;
      category: string;
      openings: Array<{
        id: string;
        title: string;
        location: string;
        link: string;
      }>;
    }>;
  };
}

export const CareerSection = forwardRef<HTMLElement, CareerSectionProps>(
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
          <Stack gap="lg">
            {/* Header */}
            <Stack gap="md" align="start">
              <Title
                order={2}
                size="3xl"
                fw="semibold"
                c="foreground"
              >
                {content.title}
              </Title>
              
              <Text
                size="lg"
                c="muted-foreground"
                w="3xl"
                py="sm"
              >
                {content.description}
              </Text>
            </Stack>

            {/* Categories */}
            <Stack gap="md">
              {content.categories.map((category) => (
                <Box key={category.id} component="article">
                  <Title
                    order={3}
                    size="xl"
                    fw="bold"
                    c="muted-foreground"
                    py="sm"
                  >
                    {category.category}
                  </Title>

                  <Stack gap="none">
                    {category.openings.map((job) => (
                      <Box
                        key={job.id}
                        py="sm"
                        borderBottom="1px"
                        borderColor="border"
                      >
                        <Group
                          justify="between"
                          align="center"
                        >
                          <Text
                            component="a"
                            href={job.link}
                            c="foreground"
                            fw="medium"
                            td="none"
                          >
                            {job.title}
                          </Text>

                          <Badge
                            variant="secondary"
                            radius="full"
                            size="sm"
                          >
                            {job.location}
                          </Badge>
                        </Group>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Stack>
        </Container>
      </Block>
    );
  }
);

CareerSection.displayName = "CareerSection";

export const careerSectionTemplate = {
  id: "careerSection",
  name: "Career Section",
  description: "Career opportunities section with job listings",
  component: CareerSection,
  defaultContent: {
    title: "Explore Career Opportunities",
    description: "Become part of a team of advanced system design based on Radix and shadcn/ui",
    categories: [
      {
        id: "engineering",
        category: "Engineering",
        openings: [
          {
            id: "senior-software-engineer",
            title: "Senior Software Engineer",
            location: "Remote",
            link: "#"
          },
          {
            id: "product-manager",
            title: "Product Manager",
            location: "Windhoek, Namibia",
            link: "#"
          },
          {
            id: "qa-engineer",
            title: "QA Engineer",
            location: "Remote",
            link: "#"
          },
          {
            id: "tech-support",
            title: "Technical Support Specialist",
            location: "Remote",
            link: "#"
          }
        ]
      },
      {
        id: "marketing",
        category: "Marketing",
        openings: [
          {
            id: "content-writer",
            title: "Content Writer",
            location: "Fes, Morocco",
            link: "#"
          },
          {
            id: "social-media-manager",
            title: "Social Media Manager",
            location: "Goa, India",
            link: "#"
          }
        ]
      }
    ]
  }
}; 