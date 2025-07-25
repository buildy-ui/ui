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
} from "@ui8kit/core";
import { Star, User } from "lucide-react";

interface TestimonialsGridSectionProps {
  content: {
    mainTitle: string;
    mainDescription: string;
    testimonials: {
      rating: number;
      quote: string;
      author: string;
      position: string;
    }[];
  };
}

export const TestimonialsGridSection = forwardRef<HTMLElement, TestimonialsGridSectionProps>(
  ({ content }, ref) => {
    return (
      <Block component="section" ref={ref} w="full" py="xl">
        <Container size="lg" padding="responsive" ta="center">
          <Stack gap="lg" align="center">
            <Title order={1} size="3xl" fw="bold" ta="center">
              {content.mainTitle}
            </Title>
            <Text size="lg" c="muted-foreground" ta="center">
              {content.mainDescription}
            </Text>
          </Stack>

          <Grid cols="cols3" gap="xl" mt="2xl">
            {content.testimonials.map((testimonial, index) => (
              <Card key={index} padding="lg" radius="md">
                <Stack gap="md" align="start" ta="left">
                  <Box display="flex" gap="xs">
                    {[...Array(testimonial.rating)].map((_, starIndex) => (
                      <Icon
                        key={starIndex}
                        component="span"
                        size="md"
                        lucideIcon={Star}
                        c="yellow-500"
                      />
                    ))}
                  </Box>
                  <Text size="md" c="foreground" fw="medium">
                    &quot;{testimonial.quote}&quot;
                  </Text>
                  <Box display="flex" gap="md" ai="center">
                    <Box
                      w="lg"
                      h="lg"
                      display="flex"
                      ai="center"
                      jc="center"
                      bg="muted"
                      c="muted-foreground"
                      radius="full"
                    >
                      <Icon component="span" size="md" lucideIcon={User} />
                    </Box>
                    <Stack gap="xs" spacing="xs">
                      <Text size="sm" fw="semibold">
                        {testimonial.author}
                      </Text>
                      <Text size="xs" c="muted-foreground">
                        {testimonial.position}
                      </Text>
                    </Stack>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Grid>
        </Container>
      </Block>
    );
  }
);

TestimonialsGridSection.displayName = "TestimonialsGridSection";

export const testimonialsGridSectionTemplate = {
  id: "testimonialsGridSection",
  name: "Testimonials Grid Section",
  description: "Grid of customer testimonials with ratings.",
  component: TestimonialsGridSection,
  defaultContent: {
    mainTitle: "Customer testimonials",
    mainDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    testimonials: [
      {
        rating: 5,
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
        author: "Name Surname",
        position: "Position, Company name"
      },
      {
        rating: 5,
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, mi quis viverra ornare.",
        author: "Name Surname",
        position: "Position, Company name"
      },
      {
        rating: 5,
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
        author: "Name Surname",
        position: "Position, Company name"
      },
      {
        rating: 5,
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, mi quis viverra ornare.",
        author: "Name Surname",
        position: "Position, Company name"
      },
      {
        rating: 5,
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, mi quis viverra ornare.",
        author: "Name Surname",
        position: "Position, Company name"
      },
      {
        rating: 5,
        quote: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare.",
        author: "Name Surname",
        position: "Position, Company name"
      },
    ]
  }
}; 