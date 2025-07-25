import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Title,
  Text,
  Button,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@ui8kit/core";

interface FaqCenteredAccordionSectionProps {
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

export const FaqCenteredAccordionSection = forwardRef<HTMLElement, FaqCenteredAccordionSectionProps>(
  ({ content }, ref) => {
    return (
      <Block component="section" ref={ref} w="full" py="xl">
        <Container size="md" padding="responsive" centered>
          <Stack gap="lg" align="center" ta="center">
            <Title order={1} size="3xl" fw="bold" ta="center">
              {content.mainTitle}
            </Title>
            <Text size="lg" c="muted-foreground" ta="center">
              {content.mainDescription}
            </Text>
          </Stack>

          <Accordion type="single" collapsible className="w-full mt-2xl">
            {content.questions.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger>{faq.questionText}</AccordionTrigger>
                <AccordionContent>{faq.answerText}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

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

FaqCenteredAccordionSection.displayName = "FaqCenteredAccordionSection";

export const faqCenteredAccordionSectionTemplate = {
  id: "faqCenteredAccordionSection",
  name: "FAQ Centered Accordion Section",
  description: "Centered FAQ section with an accordion of questions and answers.",
  component: FaqCenteredAccordionSection,
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