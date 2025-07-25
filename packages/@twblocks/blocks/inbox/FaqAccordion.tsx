import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui8kit/core";

// Type definition for the component's content.
type Content = {
  tagline: string;
  title: string;
  description: string;
  faqs: {
    id: string;
    question: string;
    answer: string;
  }[];
};

// Default content for the FAQ section.
const content: Content = {
  tagline: "FAQs",
  title: "Frequently Asked Questions",
  description: "Here are some of our most frequently asked questions. If you have others, feel free to reach out.",
  faqs: [
    {
      id: "faq-1",
      question: "What is Buildy/UI?",
      answer: "Buildy/UI is a collection of beautifully designed, accessible, and customizable React components built on top of Radix UI and Tailwind CSS. It's designed to help you build modern web applications faster.",
    },
    {
      id: "faq-2",
      question: "Is it open source?",
      answer: "Yes, Buildy/UI is completely open source and free to use for personal and commercial projects under the MIT license.",
    },
    {
      id: "faq-3",
      question: "Can I customize the components?",
      answer: "Absolutely. The components are designed to be easily customizable. You can either extend the default styles with Tailwind CSS classes or use the underlying Radix UI primitives to build your own from scratch.",
    },
  ],
} as const;

// Props for the FaqAccordion component, allowing content overrides.
type FaqAccordionProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

/**
 * A FAQ section component with a centered layout and an accordion.
 * It displays a title, description, and a list of questions and answers.
 * The content can be customized via props.
 */
export const FaqAccordion = (props: FaqAccordionProps) => {
  // Merge default content with user-provided props.
  const { tagline, title, description, faqs } = {
    ...content,
    ...props,
  };

  return (
    <section className="w-full py-16 lg:py-32">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-8">
          <header className="flex flex-col gap-4 text-center">
            <p className="text-sm font-medium text-primary">{tagline}</p>
            <h2 className="text-3xl font-bold">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </header>

          <Accordion type="single" collapsible className="w-full">
            {faqs?.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>
                  <p className="text-base text-muted-foreground">{faq.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};