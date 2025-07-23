import { forwardRef } from "react";
import { Volleyball } from "lucide-react";
import {
  Block,
  Container,
  Grid,
  Stack,
  Group,
  Title,
  Text,
  Icon,
  Box
} from "@ui8kit/core";

interface FooterFourColumnsProps {
  content: {
    brand: string;
    description: string;
    copyright: string;
    links: Array<{
      name: string;
      href: string;
    }>;
    menu: Array<{
      title: string;
      links: Array<{
        name: string;
        href: string;
      }>;
    }>;
  };
}

export const FooterFourColumns = forwardRef<HTMLElement, FooterFourColumnsProps>(
  ({ content }, ref) => {
    return (
      <Block
        component="footer"
        ref={ref}
        w="full"
        py="md"
      >
        <Container size="lg" padding="responsive" centered>
          <Stack gap="2xl">
            {/* Main Footer Content */}
            <Grid cols="cols2_6" gap="2xl">
              {/* Brand Section */}
              <Grid.Col span={2}>
                <Stack gap="md">
                  <Group gap="xs" align="center">
                    <Icon
                      lucideIcon={Volleyball}
                      size="2xl"
                    />
                    <Title
                      order={3}
                      size="2xl"
                      fw="bold"
                    >
                      {content.brand}
                    </Title>
                  </Group>
                  
                  <Text
                    c="muted-foreground"
                  >
                    {content.description}
                  </Text>
                </Stack>
              </Grid.Col>
              
              {/* Menu Columns */}
              {content.menu.map((section, sectionIdx) => (
                <Grid.Col key={sectionIdx} span={1}>
                  <Stack gap="md">
                    <Title
                      order={4}
                      size="md"
                      fw="bold"
                    >
                      {section.title}
                    </Title>
                    
                    <Stack gap="sm">
                      {section.links.map((link, linkIdx) => (
                        <Text
                          key={`${link.name}-${linkIdx}`}
                          component="a"
                          href={link.href}
                          c="muted-foreground"
                          fw="medium"
                          td="none"
                        >
                          {link.name}
                        </Text>
                      ))}
                    </Stack>
                  </Stack>
                </Grid.Col>
              ))}
            </Grid>
            
            {/* Bottom Section */}
            <Box
              borderTop="1px"
              borderColor="border"
              pt="md"
            >
              <Group justify="between" align="center" gap="md">
                <Text
                  size="sm"
                  fw="medium"
                  c="muted-foreground"
                >
                  {content.copyright}
                </Text>
                
                <Group gap="md">
                  {content.links.map((link, idx) => (
                    <Text
                      key={`${link.name}-${idx}`}
                      component="a"
                      href={link.href}
                      size="sm"
                      fw="medium"
                      c="muted-foreground"
                      td="none"
                    >
                      {link.name}
                    </Text>
                  ))}
                </Group>
              </Group>
            </Box>
          </Stack>
        </Container>
      </Block>
    );
  }
);

FooterFourColumns.displayName = "FooterFourColumns";

export const footerFourColumnsTemplate = {
  id: "footerFourColumns",
  name: "Footer Four Columns",
  description: "Footer with brand section and four menu columns",
  component: FooterFourColumns,
  defaultContent: {
    brand: "BuildY/UI",
    description: "Easily build your website with our UI components",
    copyright: "© 2024 BuildY/UI. All rights reserved.",
    links: [
      { name: "Terms and Conditions", href: "#" },
      { name: "Privacy Policy", href: "#" }
    ],
    menu: [
      {
        title: "Product",
        links: [
          { name: "Overview", href: "#" },
          { name: "Pricing", href: "#" },
          { name: "Marketplace", href: "#" },
          { name: "Features", href: "#" },
          { name: "Integrations", href: "#" }
        ]
      },
      {
        title: "Company",
        links: [
          { name: "About", href: "#" },
          { name: "Team", href: "#" },
          { name: "Blog", href: "#" },
          { name: "Careers", href: "#" },
          { name: "Contact", href: "#" },
          { name: "Privacy", href: "#" }
        ]
      },
      {
        title: "Resources",
        links: [
          { name: "Help", href: "#" },
          { name: "Sales", href: "#" },
          { name: "Advertise", href: "#" }
        ]
      },
      {
        title: "Social",
        links: [
          { name: "Twitter", href: "#" },
          { name: "Instagram", href: "#" },
          { name: "LinkedIn", href: "#" }
        ]
      }
    ]
  }
}; 