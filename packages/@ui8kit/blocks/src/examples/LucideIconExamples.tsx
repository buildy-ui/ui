import { forwardRef } from "react";
import {
  Block,
  Container,
  Stack,
  Group,
  Title,
  Text,
  Button,
  Icon
} from "@ui8kit/core";

// Lucide imports (when installed: npm install lucide-react)
// import { ArrowRight, Info, Zap, Calendar, ExternalLink } from "lucide-react";

interface LucideExamplesProps {
  content: {
    title: string;
    description: string;
  };
}

export const LucideIconExamples = forwardRef<HTMLElement, LucideExamplesProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
      >
        <Container size="lg" padding="responsive" centered>
          <Stack gap="xl">
            <Stack gap="md" align="center" ta="center">
              <Title order={2} size="2xl" fw="bold">
                {content.title}
              </Title>
              <Text size="lg" c="muted-foreground">
                {content.description}
              </Text>
            </Stack>

            {/* Example 1: Buttons with Lucide icons */}
            <Group gap="md" justify="center">
              <Button
                size="lg"
                leftSection={
                  <Icon
                    component="span"
                    size="md"
                    // lucideIcon={ArrowRight} // Uncomment when Lucide is installed
                    svgPath="<path stroke-linecap='round' stroke-linejoin='round' d='M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3' />"
                    svgSize="16"
                  />
                }
              >
                Get Started
              </Button>

              <Button
                variant="outline"
                size="lg"
                leftSection={
                  <Icon
                    component="span"
                    size="md"
                    // lucideIcon={Info} // Uncomment when Lucide is installed
                    svgPath="<path stroke-linecap='round' stroke-linejoin='round' d='m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z' />"
                    svgSize="16"
                  />
                }
              >
                Learn More
              </Button>
            </Group>

            {/* Example 2: Different sizes */}
            <Group gap="md" justify="center" align="center">
              <Icon
                size="sm"
                // lucideIcon={Zap} // Uncomment when Lucide is installed
                svgPath="<path stroke-linecap='round' stroke-linejoin='round' d='M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' />"
                svgSize="16"
              />
              <Icon
                size="md"
                // lucideIcon={Calendar} // Uncomment when Lucide is installed
                svgPath="<path stroke-linecap='round' stroke-linejoin='round' d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5' />"
                svgSize="20"
              />
              <Icon
                size="lg"
                // lucideIcon={ExternalLink} // Uncomment when Lucide is installed
                svgPath="<path stroke-linecap='round' stroke-linejoin='round' d='M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25' />"
                svgSize="24"
              />
            </Group>
          </Stack>
        </Container>
      </Block>
    );
  }
);

LucideIconExamples.displayName = "LucideIconExamples";

export const lucideIconExamplesTemplate = {
  id: "lucideIconExamples",
  name: "Lucide Icon Examples",
  description: "Examples of using Lucide icons with our Icon component",
  component: LucideIconExamples,
  defaultContent: {
    title: "Lucide Icons Integration",
    description: "See how to use Lucide icons with our Icon component"
  }
}; 