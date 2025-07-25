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

interface FaqTwoColumnsAccordionSectionProps {
  content: {
    mainTitle: string;
    mainDescription: string;
    buttonText: string;
    questions: {
      questionText: string;
      answerText: string;
    }[];
  };
}

export const FaqTwoColumnsAccordionSection = forwardRef<HTMLElement, FaqTwoColumnsAccordionSectionProps>(
  ({ content }, ref) => {
    return (
      <Block component="section" ref={ref} w="full" py="xl">
        <Container size="lg" padding="responsive">
          <Block
            display="grid"
            className="grid-cols-1 md:grid-cols-2 gap-2xl items-start"
          >
            {/* Left Column */}
            <Stack gap="lg">
              <Stack gap="md">
                <Title order={1} size="3xl" fw="bold">
                  {content.mainTitle}
                </Title>
                <Text size="lg" c="muted-foreground">
                  {content.mainDescription}
                </Text>
              </Stack>
              <Button size="lg" variant="outline" className="w-max-content">
                {content.buttonText}
              </Button>
            </Stack>

            {/* Right Column - Accordion */}
            <Accordion type="single" collapsible>
              {content.questions.map((faq, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger>
                    {faq.questionText}
                  </AccordionTrigger>
                  <AccordionContent>
                    {faq.answerText}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Block>
        </Container>
      </Block>
    );
  }
);

FaqTwoColumnsAccordionSection.displayName = "FaqTwoColumnsAccordionSection";

export const faqTwoColumnsAccordionSectionTemplate = {
  id: "faqTwoColumnsAccordionSection",
  name: "FAQ Two Columns Accordion Section",
  description: "FAQ section with two columns, one with text and button, other with accordion.",
  component: FaqTwoColumnsAccordionSection,
  defaultContent: {
    mainTitle: "FAQs",
    mainDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
    buttonText: "Contact",
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
    ]
  }
}; 