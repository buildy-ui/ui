import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Button,
} from "@ui8kit/core";

interface FaqSimpleListSectionProps {
  content: {
    mainTitle: string;
    mainDescription: string;
    questions: {
      questionText: string;
      answerText: string;
    }[];
    bottomTitle: string;
    bottomDescription: string;
    buttonText: string;
  };
}

export const FaqSimpleListSection = forwardRef<HTMLElement, FaqSimpleListSectionProps>(
  ({ content }, ref) => {
    return (
      <Block component="section" ref={ref} w="full" py="xl">
        <Container size="md" padding="responsive" ta="center">
          <Stack gap="lg" align="center">
            <Title order={1} size="3xl" fw="bold" ta="center">
              {content.mainTitle}
            </Title>
            <Text size="lg" c="muted-foreground" ta="center">
              {content.mainDescription}
            </Text>
          </Stack>

          <Stack gap="lg" mt="2xl">
            {content.questions.map((faq, index) => (
              <Stack key={index} gap="md" align="center">
                <Title order={3} size="xl" fw="semibold" ta="center">
                  {faq.questionText}
                </Title>
                <Text size="md" c="muted-foreground" ta="center">
                  {faq.answerText}
                </Text>
              </Stack>
            ))}
          </Stack>

          <Stack gap="lg" align="center" mt="2xl">
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

FaqSimpleListSection.displayName = "FaqSimpleListSection";

export const faqSimpleListSectionTemplate = {
  id: "faqSimpleListSection",
  name: "FAQ Simple List Section",
  description: "Simple FAQ section with questions and answers listed vertically.",
  component: FaqSimpleListSection,
  defaultContent: {
    mainTitle: "FAQs",
    mainDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    questions: [
      {
        questionText: "Question text goes here",
        answerText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
      },
      {
        questionText: "Question text goes here",
        answerText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
      },
      {
        questionText: "Question text goes here",
        answerText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
      },
      {
        questionText: "Question text goes here",
        answerText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
      },
      {
        questionText: "Question text goes here",
        answerText: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus tristique posuere."
      }
    ],
    bottomTitle: "Still have questions?",
    bottomDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    buttonText: "Contact"
  }
}; 