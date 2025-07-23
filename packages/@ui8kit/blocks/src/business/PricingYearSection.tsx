import { forwardRef, useState } from "react";
import { ArrowRight, CircleCheck } from "lucide-react";
import {
  Block,
  Container,
  Stack,
  Grid,
  Title,
  Text,
  Button,
  Card,
  Icon,
  Box,
  Group
} from "@ui8kit/core";

interface PricingYearSectionProps {
  content: {
    title: string;
    description: string;
    plans: Array<{
      id: string;
      name: string;
      description: string;
      monthlyPrice: string;
      yearlyPrice: string;
      features: string[];
      buttonText: string;
      buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
    }>;
  };
}

export const PricingYearSection = forwardRef<HTMLElement, PricingYearSectionProps>(
  ({ content }, ref) => {
    const [isYearly, setIsYearly] = useState(false);

    return (
      <Block
        component="section"
        ref={ref}
        w="full"
        py="lg"
        bg="background"
      >
        <Container size="lg" padding="responsive" centered>
          <Stack gap="xl" align="center">
            {/* Header */}
            <Stack gap="md" align="center" ta="center">
              <Title
                order={2}
                size="3xl"
                fw="bold"
              >
                {content.title}
              </Title>
              
              <Text
                size="md"
                c="muted-foreground"
                w="3xl"
              >
                {content.description}
              </Text>
            </Stack>
            
            {/* Toggle */}
            <Group gap="md" align="center">
              <Text size="sm" fw="medium">
                Monthly
              </Text>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsYearly(!isYearly)}
              >
                {isYearly ? "Switch to Monthly" : "Switch to Yearly"}
              </Button>
              <Text size="sm" fw="medium">
                Yearly (-10%)
              </Text>
            </Group>
            
            {/* Plans Grid */}
            <Grid cols="cols3" gap="lg" w="full">
              {content.plans.map((plan) => (
                <Card key={plan.id} padding="none" radius="lg">
                  <Stack align="center">
                  <Card.Header>
                    <Title size="lg" ta="center">
                      {plan.name}
                    </Title>
                    <Text size="sm" c="muted-foreground">
                      {plan.description}
                    </Text>
                    <Text size="4xl" fw="bold" ta="center">
                      {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </Text>
                  </Card.Header>
                  
                  <Card.Content>
                    <Box w="full" h="1px" bg="border" my="md" />
                    <Stack gap="sm">
                      {plan.features.map((feature, index) => (
                        <Stack key={index} gap="sm" direction="row" align="center">
                          <Icon
                            lucideIcon={CircleCheck}
                            size="sm"
                          />
                          <Text size="sm">
                            {feature}
                          </Text>
                        </Stack>
                      ))}
                    </Stack>
                  </Card.Content>
                  
                  <Card.Footer>
                    <Button 
                      variant={plan.buttonVariant || "default"}
                      rightSection={<ArrowRight size={16} />}
                    >
                      {plan.buttonText}
                    </Button>
                  </Card.Footer>
                  </Stack>
                </Card>
              ))}
            </Grid>
          </Stack>
        </Container>
      </Block>
    );
  }
);

PricingYearSection.displayName = "PricingYearSection";

export const pricingYearSectionTemplate = {
  id: "pricingYearSection",
  name: "Pricing Year Section",
  description: "Pricing plans section with monthly/yearly toggle",
  component: PricingYearSection,
  defaultContent: {
    title: "Pricing",
    description: "Choose the perfect plan for your needs, whether you're an individual or a team.",
    plans: [
      {
        id: "free",
        name: "Free",
        description: "Ideal for personal use and exploring the basics of our design system.",
        monthlyPrice: "$0",
        yearlyPrice: "$0",
        features: [
          "Access to all free components",
          "Basic support",
          "Community access"
        ],
        buttonText: "Get Started",
        buttonVariant: "outline" as const
      },
      {
        id: "premium",
        name: "Premium",
        description: "Perfect for professionals looking for advanced features.",
        monthlyPrice: "$249",
        yearlyPrice: "$224/year",
        features: [
          "Everything in Free",
          "Premium component library",
          "Priority support",
          "Early access to new features"
        ],
        buttonText: "Get Premium",
        buttonVariant: "default" as const
      },
      {
        id: "team",
        name: "Team",
        description: "Tailored for teams seeking collaborative tools.",
        monthlyPrice: "$459",
        yearlyPrice: "$413/year",
        features: [
          "Everything in Premium",
          "Team collaboration tools",
          "Dedicated support",
          "Custom component requests"
        ],
        buttonText: "Get Team Plan",
        buttonVariant: "default" as const
      }
    ]
  }
}; 