import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@ui8kit/core";

// Type definition for the component's content.
type Content = {
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
  title: "Your Questions, Answered",
  description: "Find answers to common questions about our platform, services, and how we can help you achieve your goals.",
  faqs: [
    {
      id: "faq-1",
      question: "How do I get started?",
      answer: "Getting started is easy! Simply sign up for a free account, and you can start exploring our features right away. Check out our documentation for a step-by-step guide.",
    },
    {
      id: "faq-2",
      question: "What is the pricing model?",
      answer: "We offer a flexible pricing model, including a free tier for individuals and small teams. For larger organizations, we have custom enterprise plans. Visit our pricing page for more details.",
    },
    {
      id: "faq-3",
      question: "Can I integrate with other tools?",
      answer: "Yes, our platform is designed to be highly extensible and offers a rich API for integrations with popular third-party services and tools.",
    },
  ],
} as const;

// Props for the FaqGrid component, allowing content overrides.
type FaqGridProps = React.ComponentPropsWithoutRef<"section"> & Partial<Content>;

/**
 * A FAQ section component with a two-column grid layout.
 * It displays a title and description on one side, and an accordion on the other.
 * The content can be customized via props.
 */
export const FaqGrid = (props: FaqGridProps) => {
  // Merge default content with user-provided props.
  const { title, description, faqs } = {
    ...content,
    ...props,
  };

  return (
    <section className="w-full bg-muted/40 py-16 lg:py-32">
      <div className="container mx-auto grid grid-cols-1 items-start gap-12 px-4 md:grid-cols-2 md:px-6 lg:px-8">
        <header className="flex flex-col gap-4">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="text-lg text-muted-foreground">{description}</p>
        </header>

        <Accordion type="single" collapsible className="w-full">
          {faqs?.map((faq) => (
            <AccordionItem key={faq.id} value={faq.id}>
              <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
              <AccordionContent>
                <p className="text-base text-muted-foreground">{faq.answer}</p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};