import { forwardRef } from "react";
import { Box, Block, Container, Stack, Title, Text, Button, Card, Icon } from "@ui8kit/core";
import { BoxIcon } from "lucide-react";

interface FaqGridCardsSectionProps {
  content: {
    mainTitle: string;
    mainDescription: string;
    questions: {
      icon: string;
      questionText: string;
      answerText: string;
    }[];
    bottomTitle: string;
    bottomDescription: string;
    buttonText: string;
  };
}

export const FaqGridCardsSection = forwardRef<HTMLElement, FaqGridCardsSectionProps>(
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

          <Block
            display="grid"
            className="mt-2xl grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-xl"
          >
            {content.questions.map((faq, index) => (
              <Card key={index} className="shadow-sm p-lg rounded-md text-center">
                <Stack gap="md" align="center">
                  <Box
                    w="xl"
                    h="xl"
                    display="flex"
                    ai="center"
                    jc="center"
                    bg="secondary"
                    c="secondary-foreground"
                    radius="md"
                  >
                    <Icon component="span" size="lg" lucideIcon={BoxIcon} />
                  </Box>
                  <Title order={3} size="lg" fw="semibold" ta="center">
                    {faq.questionText}
                  </Title>
                  <Text size="sm" c="muted-foreground" ta="center">
                    {faq.answerText}
                  </Text>
                </Stack>
              </Card>
            ))}
          </Block>

          <Stack gap="lg" align="center" ta="center" mt="2xl">
            <Title order={2} size="2xl" fw="bold" ta="center">
              {content.bottomTitle}
            </Title>
            <Text size="md" c="muted-foreground" ta="center">
              {content.bottomDescription}
            </Text>
            <Button size="lg" variant="outline">
              {content.buttonText}
            </Button>
          </Stack>
        </Container>
      </Block>
    );
  }
);

FaqGridCardsSection.displayName = "FaqGridCardsSection";

export const faqGridCardsSectionTemplate = {
  id: "faqGridCardsSection",
  name: "FAQ Grid Cards Section",
  description: "FAQ section with questions displayed in a grid of cards.",
  component: FaqGridCardsSection,
  defaultContent: {
    mainTitle: "FAQs",
    mainDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    questions: [
      {
        icon: "cube",
        questionText: "Question text goes here",
        answerText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla,"
      },
      {
        icon: "cube",
        questionText: "Question text goes here",
        answerText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla,"
      },
      {
        icon: "cube",
        questionText: "Question text goes here",
        answerText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla,"
      },
      {
        icon: "cube",
        questionText: "Question text goes here",
        answerText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla,"
      },
      {
        icon: "cube",
        questionText: "Question text goes here",
        answerText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla,"
      },
      {
        icon: "cube",
        questionText: "Question text goes here",
        answerText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla,"
      }
    ],
    bottomTitle: "Still have questions?",
    bottomDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    buttonText: "Contact"
  }
}; 