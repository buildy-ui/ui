import { Block, Button, Icon, Text, Group, Sheet } from "@ui8kit/core";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@ui8kit/core";
import { Home, Moon, Sun } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export function Navbar({ isDarkMode, toggleDarkMode }: { isDarkMode: boolean, toggleDarkMode: () => void }) {
  const isMobile = useIsMobile();
  return (
    <Block component="nav" bg="card" p="md">
      <Group justify="between" align="center">
        <Text size="xl" fw="bold" c="primary">BuildY/UI</Text>

        {!isMobile && (
          <Group gap="sm" align="center">
            <Button variant="ghost" size="sm">
              <Icon component="span" lucideIcon={Home} />
              <Text size="sm" c="muted">Home</Text>
            </Button>
            <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
              <Icon component="span" lucideIcon={isDarkMode ? Moon : Sun} />
            </Button>
          </Group>
        )}

        {isMobile && (
          <Sheet id="main-nav" side="right" size="md" openLabel="Menu" title="Menu">
            <Accordion type="single" collapsible defaultValue="menu">
              <AccordionItem value="menu">
                <AccordionTrigger>
                  <Text c="foreground">Navigation</Text>
                </AccordionTrigger>
                <AccordionContent>
                  <Group gap="sm" align="start">
                    <Button variant="ghost" size="sm">
                      <Icon component="span" lucideIcon={Home} />
                      <Text size="sm" c="muted">Home</Text>
                    </Button>
                    <Button variant="ghost" size="sm" onClick={toggleDarkMode}>
                      <Icon component="span" lucideIcon={isDarkMode ? Moon : Sun} />
                      <Text size="sm" c="muted">Toggle theme</Text>
                    </Button>
                  </Group>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Sheet>
        )}
      </Group>
    </Block>
  )
}