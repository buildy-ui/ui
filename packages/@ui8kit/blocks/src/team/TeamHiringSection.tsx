import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Card,
  Box,
  Icon,
  Grid,
  Button,
} from "@ui8kit/core";
import { Linkedin, Twitter, Globe, Image as ImageIcon } from "lucide-react";

interface TeamHiringSectionProps {
  content: {
    tagline: string;
    mainTitle: string;
    mainDescription: string;
    members: {
      image: string;
      fullName: string;
      jobTitle: string;
      description: string;
      social: {
        linkedin: string;
        twitter: string;
        website: string;
      };
    }[];
    hiringTitle: string;
    hiringDescription: string;
    hiringButtonText: string;
  };
}

export const TeamHiringSection = forwardRef<HTMLElement, TeamHiringSectionProps>(
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
            {content.members.map((member, index) => (
              <Card key={index} padding="lg" radius="md">
                <Stack gap="md" align="center" ta="center">
                  <Box
                    w="4xl"
                    h="4xl"
                    display="flex"
                    ai="center"
                    jc="center"
                    bg="muted"
                    radius="full"
                    c="muted-foreground"
                  >
                    <Icon component="span" size="xl" lucideIcon={ImageIcon} />
                  </Box>
                  <Stack gap="xs">
                    <Title order={3} size="lg" fw="semibold">
                      {member.fullName}
                    </Title>
                    <Text size="sm" c="muted-foreground">
                      {member.jobTitle}
                    </Text>
                  </Stack>
                  <Box display="flex" gap="md">
                    <Icon component="a" lucideIcon={Linkedin} href={member.social.linkedin} target="_blank" rel="noopener noreferrer" />
                    <Icon component="a" lucideIcon={Twitter} href={member.social.twitter} target="_blank" rel="noopener noreferrer" />
                    <Icon component="a" lucideIcon={Globe} href={member.social.website} target="_blank" rel="noopener noreferrer" />
                  </Box>
                </Stack>
              </Card>
            ))}
          </Grid>

          <Stack gap="lg" align="center" ta="center" mt="2xl">
            <Title order={2} size="2xl" fw="bold" ta="center">
              {content.hiringTitle}
            </Title>
            <Text size="md" c="muted-foreground" ta="center">
              {content.hiringDescription}
            </Text>
            <Button size="lg" variant="outline">
              {content.hiringButtonText}
            </Button>
          </Stack>
        </Container>
      </Block>
    );
  }
);

TeamHiringSection.displayName = "TeamHiringSection";

export const teamHiringSectionTemplate = {
  id: "teamHiringSection",
  name: "Team Hiring Section",
  description: "Team section with a hiring call to action.",
  component: TeamHiringSection,
  defaultContent: {
    tagline: "Tagline",
    mainTitle: "Our team",
    mainDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    members: [
      {
        image: "/placeholder.jpg",
        fullName: "Full name",
        jobTitle: "Job title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        social: {
          linkedin: "#",
          twitter: "#",
          website: "#"
        }
      },
      {
        image: "/placeholder.jpg",
        fullName: "Full name",
        jobTitle: "Job title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        social: {
          linkedin: "#",
          twitter: "#",
          website: "#"
        }
      },
      {
        image: "/placeholder.jpg",
        fullName: "Full name",
        jobTitle: "Job title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        social: {
          linkedin: "#",
          twitter: "#",
          website: "#"
        }
      },
      {
        image: "/placeholder.jpg",
        fullName: "Full name",
        jobTitle: "Job title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        social: {
          linkedin: "#",
          twitter: "#",
          website: "#"
        }
      },
      {
        image: "/placeholder.jpg",
        fullName: "Full name",
        jobTitle: "Job title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        social: {
          linkedin: "#",
          twitter: "#",
          website: "#"
        }
      },
      {
        image: "/placeholder.jpg",
        fullName: "Full name",
        jobTitle: "Job title",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
        social: {
          linkedin: "#",
          twitter: "#",
          website: "#"
        }
      },
    ],
    hiringTitle: "We're hiring!",
    hiringDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    hiringButtonText: "Open positions"
  }
}; 